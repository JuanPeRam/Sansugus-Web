import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Plus, Trash2 } from 'lucide-react'
import {
  changeSponsorLogo, createSponsor, deleteSponsor, fetchAdminSponsors, updateSponsor, type SponsorRecord,
} from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, Checkbox, EmptyState, ErrorState, Field, Input, SaveBar, Skeletons, Spinner } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, useUnsavedChanges } from './adminUtils'

const ACCEPT = 'image/svg+xml,image/png,image/webp,image/jpeg,image/gif'
const LOGO_HINT = 'Mejor SVG o PNG con fondo transparente'

type Draft = SponsorRecord

/** Campos que se guardan con la barra de «Guardar» (el logo y el borrado van al momento) */
const editable = (s: SponsorRecord) => JSON.stringify([s.name.trim(), s.webUrl.trim(), s.order, s.active, s.monochrome])

/**
 * Ficha oscura como la de la web: muestra el logo tal y como se verá (en blanco si
 * está marcado como monocromo). Al pulsarla se elige otro logo.
 */
function LogoTile({ url, monochrome, name, busy, onPick, className }: {
  url: string | null
  monochrome: boolean
  name: string
  busy?: boolean
  onPick: (file: File) => void
  className?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <button
      type="button"
      onClick={() => input.current?.click()}
      disabled={busy}
      title={`${url ? 'Cambiar' : 'Subir'} logo · ${LOGO_HINT}`}
      aria-label={`${url ? 'Cambiar' : 'Subir'} el logo de ${name || 'el patrocinador'}`}
      className={cn(
        'group relative flex h-28 items-center justify-center overflow-hidden border bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-6 transition hover:border-teamOrange/60 disabled:cursor-wait',
        url ? 'border-white/[0.08] bg-[#0b0b0b]' : 'border-dashed border-white/20 bg-[#0b0b0b]',
        className,
      )}
    >
      {busy ? (
        <Spinner className="h-6 w-6 text-teamOrange" />
      ) : url ? (
        <>
          <img src={url} alt="" className={cn('max-h-14 max-w-full object-contain', monochrome && '[filter:brightness(0)_invert(1)]')} />
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/80 py-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <ImagePlus className="h-3 w-3" aria-hidden /> Cambiar logo
          </span>
        </>
      ) : (
        <span className="flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <ImagePlus className="h-6 w-6" aria-hidden /> Subir logo
        </span>
      )}
      <input
        ref={input} type="file" accept={ACCEPT} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onPick(f) }}
      />
    </button>
  )
}

export default function SponsorsAdminPage() {
  const sponsors = useAsync(fetchAdminSponsors, [])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [actionError, setActionError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number>()
  const [busyLogo, setBusyLogo] = useState<number | null>(null)

  // Formulario de alta
  const [form, setForm] = useState({ name: '', webUrl: '' })
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState<string>()
  const [creating, setCreating] = useState(false)

  const original = useMemo(() => new Map((sponsors.data ?? []).map((s) => [s.id, s])), [sponsors.data])
  const reset = () => setDrafts((sponsors.data ?? []).map((s) => ({ ...s })))
  useEffect(reset, [sponsors.data])

  // Previsualización del logo elegido en el alta
  useEffect(() => {
    if (!file) return setPreview(undefined)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const changed = drafts.filter((d) => { const o = original.get(d.id); return o && editable(o) !== editable(d) })
  useUnsavedChanges(changed.length > 0)

  const update = (id: number, patch: Partial<Draft>) => {
    setSavedAt(undefined)
    setDrafts((list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  /** Sube o baja un puesto; el orden se guarda como 1, 2, 3… */
  const move = (index: number, delta: -1 | 1) => {
    setSavedAt(undefined)
    setDrafts((list) => {
      const next = [...list]
      const target = index + delta
      if (target < 0 || target >= next.length) return list
      ;[next[index], next[target]] = [next[target], next[index]]
      return next.map((d, i) => ({ ...d, order: i + 1 }))
    })
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return setActionError('Escribe el nombre del patrocinador.')
    setCreating(true)
    setActionError(undefined)
    try {
      const order = drafts.reduce((max, d) => Math.max(max, d.order), 0) + 1
      await createSponsor({ ...form, file }, order)
      setForm({ name: '', webUrl: '' })
      setFile(undefined)
      sponsors.reload()
    } catch (err) {
      setActionError(errorText(err, 'No se pudo añadir el patrocinador'))
    } finally {
      setCreating(false)
    }
  }

  const onSave = async () => {
    if (changed.some((d) => !d.name.trim())) return setActionError('Hay un patrocinador sin nombre.')
    setSaving(true)
    setActionError(undefined)
    try {
      for (const d of changed) await updateSponsor(d.id, d)
      setSavedAt(Date.now())
    } catch (err) {
      setActionError(`${errorText(err)} Los cambios anteriores a este error sí se guardaron.`)
    } finally {
      setSaving(false)
      sponsors.reload()
    }
  }

  const onLogo = async (d: Draft, f: File) => {
    setBusyLogo(d.id)
    setActionError(undefined)
    try {
      const url = await changeSponsorLogo(d.id, f, d.logoUrl)
      // El logo se guarda al momento: se actualiza sin tocar el resto del borrador
      setDrafts((list) => list.map((x) => (x.id === d.id ? { ...x, logoUrl: url } : x)))
      const o = original.get(d.id)
      if (o) o.logoUrl = url
    } catch (err) {
      setActionError(`Logo de ${d.name}: ${errorText(err, 'No se pudo subir')}`)
    } finally {
      setBusyLogo(null)
    }
  }

  const onDelete = async (d: Draft) => {
    if (!window.confirm(`¿Quitar a ${d.name} de los patrocinadores? Dejará de verse en la web.`)) return
    setActionError(undefined)
    try {
      await deleteSponsor(d.id, d.logoUrl)
      sponsors.reload()
    } catch (err) {
      setActionError(errorText(err, 'No se pudo borrar'))
    }
  }

  const visibleCount = drafts.filter((d) => d.active).length

  return (
    <>
      <AdminPageHeader
        title="Patrocinadores"
        description="Aparecen en Inicio y en el pie de la web, en este orden. El logo y el borrado se guardan al momento; el resto, con «Guardar cambios»."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm text-white/80 hover:border-teamOrange hover:text-white sm:h-10">
            <ExternalLink className="h-4 w-4" aria-hidden /> Ver en la web
          </a>
        }
      />
      <ActionError message={actionError} />

      <section className="panel mb-5 p-4 md:p-5">
        <h2 className="mb-3 font-display text-xl text-white md:text-2xl">Nuevo patrocinador</h2>
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-[14rem_1fr] md:items-start">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logo</span>
            <LogoTile url={preview ?? null} monochrome name={form.name} onPick={setFile} />
            <span className="text-xs text-muted-foreground">{file ? file.name : LOGO_HINT}</span>
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Nombre" htmlFor="sp-name">
              <Input id="sp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del patrocinador" className="w-full" />
            </Field>
            <Field label="Web (opcional)" htmlFor="sp-web">
              <Input id="sp-web" type="url" inputMode="url" value={form.webUrl} onChange={(e) => setForm({ ...form, webUrl: e.target.value })} placeholder="https://…" className="w-full" />
            </Field>
            <Button type="submit" disabled={creating || !form.name.trim()} className="h-11 bg-teamOrange text-black hover:bg-teamOrange-light sm:h-10 sm:self-start">
              {creating ? <Spinner className="mr-2 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" aria-hidden />} Añadir patrocinador
            </Button>
          </div>
        </form>
      </section>

      {sponsors.loading ? (
        <div className="panel"><Skeletons rows={3} className="h-28" /></div>
      ) : sponsors.error ? (
        <div className="panel"><ErrorState onRetry={sponsors.reload} description={sponsors.error.message} /></div>
      ) : drafts.length === 0 ? (
        <div className="panel"><EmptyState title="Sin patrocinadores" description="Añade el primero con el formulario de arriba." /></div>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{drafts.length} patrocinadores · {visibleCount} visibles en la web</p>
          <ul className="grid gap-3 lg:grid-cols-2">
            {drafts.map((d, i) => {
              const o = original.get(d.id)
              const dirty = o && editable(o) !== editable(d)
              return (
                <li key={d.id} className={cn('panel flex flex-col gap-4 p-4 sm:flex-row', dirty && 'border-teamOrange/50 bg-teamOrange/5', !d.active && 'opacity-70')}>
                  <div className="flex flex-col gap-2 sm:w-44 sm:shrink-0">
                    <LogoTile url={d.logoUrl} monochrome={d.monochrome} name={d.name} busy={busyLogo === d.id} onPick={(f) => void onLogo(d, f)} className="w-full" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-lg text-muted-foreground">#{i + 1}</span>
                      <div className="flex gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 border border-border sm:h-9 sm:w-9" disabled={i === 0} aria-label={`Subir a ${d.name}`} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 border border-border sm:h-9 sm:w-9" disabled={i === drafts.length - 1} aria-label={`Bajar a ${d.name}`} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <Field label="Nombre" htmlFor={`sp-n-${d.id}`}>
                          <Input id={`sp-n-${d.id}`} value={d.name} onChange={(e) => update(d.id, { name: e.target.value })} className="w-full font-semibold" />
                        </Field>
                      </div>
                      <Button type="button" variant="ghost" size="icon" aria-label={`Quitar a ${d.name}`} className="mt-6 h-11 w-11 shrink-0 border border-border text-red-400 hover:bg-red-500/10 hover:text-red-300 sm:h-10 sm:w-10" onClick={() => void onDelete(d)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Field label="Web" htmlFor={`sp-w-${d.id}`}>
                      <Input id={`sp-w-${d.id}`} type="url" inputMode="url" value={d.webUrl} placeholder="Sin enlace" onChange={(e) => update(d.id, { webUrl: e.target.value })} className="w-full" />
                    </Field>
                    <div className="flex flex-wrap items-center gap-x-5">
                      <Checkbox label="Visible en la web" checked={d.active} onChange={(e) => update(d.id, { active: e.target.checked })} />
                      <Checkbox label="Logo en blanco" checked={d.monochrome} onChange={(e) => update(d.id, { monochrome: e.target.checked })} />
                      {dirty && <Badge tone="orange">Sin guardar</Badge>}
                      {!d.active && !dirty && <Badge>Oculto</Badge>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <SaveBar changes={changed.length} saving={saving} savedAt={savedAt} onSave={() => void onSave()} onDiscard={reset} />
    </>
  )
}
