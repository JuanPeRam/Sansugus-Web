import { useState } from 'react'
import { CalendarCheck, Plus, Trash2 } from 'lucide-react'
import { activateSeason, createSeason, deleteSeason, fetchAdminSeasons, renameSeason } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, EmptyState, ErrorState, Input, SaveBar, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, useUnsavedChanges } from './adminUtils'

const SEASON_FORMAT = /^\d{2}\/\d{2}$/

export default function SeasonsAdminPage() {
  const { data, loading, error, reload } = useAsync(fetchAdminSeasons, [])
  const [busy, setBusy] = useState<number | 'new' | null>(null)
  const [actionError, setActionError] = useState<string>()
  const [newName, setNewName] = useState('')
  // Nombres cambiados y aún sin guardar (por id de temporada)
  const [renames, setRenames] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number>()
  const changes = Object.keys(renames).length
  useUnsavedChanges(changes > 0)

  // La más reciente primero
  const seasons = data ? [...data].reverse() : []

  const run = async (key: number | 'new', action: () => Promise<unknown>) => {
    setBusy(key)
    setActionError(undefined)
    try {
      await action()
      reload()
      return true
    } catch (err) {
      setActionError(errorText(err))
      return false
    } finally {
      setBusy(null)
    }
  }

  const onActivate = (id: number, name: string) => {
    if (!window.confirm(`¿Activar la temporada ${name}? La web pasará a mostrarla y la actual quedará desactivada.`)) return
    void run(id, () => activateSeason(id))
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!SEASON_FORMAT.test(name)) return setActionError('Escribe la temporada con el formato AA/AA, por ejemplo 26/27.')
    if (seasons.some((s) => s.name === name)) return setActionError(`La temporada ${name} ya existe.`)
    if (await run('new', () => createSeason(name))) setNewName('')
  }

  const setName = (id: number, original: string, name: string) => {
    setSavedAt(undefined)
    setRenames((prev) => {
      const next = { ...prev }
      if (name.trim() === original) delete next[id]
      else next[id] = name
      return next
    })
  }

  const onSaveRenames = async () => {
    const entries = Object.entries(renames).map(([id, name]) => [Number(id), name.trim()] as const)
    if (entries.some(([, name]) => !SEASON_FORMAT.test(name))) {
      return setActionError('Escribe las temporadas con el formato AA/AA, por ejemplo 26/27.')
    }
    const finalNames = seasons.map((s) => renames[s.id]?.trim() ?? s.name)
    if (new Set(finalNames).size !== finalNames.length) return setActionError('Hay dos temporadas con el mismo nombre.')
    setSaving(true)
    setActionError(undefined)
    try {
      for (const [id, name] of entries) {
        await renameSeason(id, name)
        setRenames((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }
      setSavedAt(Date.now())
    } catch (err) {
      setActionError(errorText(err))
    } finally {
      setSaving(false)
      reload()
    }
  }

  const onDelete = (id: number, name: string) => {
    if (!window.confirm(`¿Borrar la temporada ${name}? Solo se puede si no tiene partidos.`)) return
    void run(id, () => deleteSeason(id))
  }

  return (
    <>
      <AdminPageHeader
        title="Temporadas"
        description="La web muestra por defecto la temporada activa. Prepara la nueva temporada y actívala cuando empiece."
      />
      <ActionError message={actionError} />

      <section className="panel mb-5 p-4 md:p-5">
        <form onSubmit={onCreate} className="flex flex-col gap-2">
          <label htmlFor="new-season" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nueva temporada</label>
          <div className="flex gap-2">
            <Input id="new-season" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="26/27" inputMode="numeric" className="w-28 font-display text-lg sm:w-40" />
            <Button type="submit" disabled={busy !== null || !newName.trim()} className="h-11 flex-1 bg-teamOrange text-black hover:bg-teamOrange-light sm:h-10 sm:flex-none">
              <Plus className="mr-1 size-4" aria-hidden /> Crear temporada
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">Formato AA/AA. Se crea desactivada.</span>
        </form>
      </section>

      <section className="panel">
        {loading ? (
          <Skeletons rows={3} />
        ) : error ? (
          <ErrorState onRetry={reload} description={error.message} />
        ) : seasons.length === 0 ? (
          <EmptyState title="No hay temporadas" description="Crea la primera temporada con el formulario de arriba." />
        ) : (
          <ul className="divide-y divide-border">
            {seasons.map((s) => (
              <li key={s.id} className={cn('flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-5', s.active && 'bg-emerald-500/5')}>
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <span className="hidden font-display text-2xl text-white sm:inline">Temporada</span>
                  <Input
                    aria-label={`Nombre de la temporada ${s.name}`}
                    value={renames[s.id] ?? s.name}
                    onChange={(e) => setName(s.id, s.name, e.target.value)}
                    className={cn('w-24 font-display text-xl sm:w-28', renames[s.id] !== undefined && 'border-teamOrange')}
                  />
                  {renames[s.id] !== undefined && <Badge>Modificado</Badge>}
                </div>
                {s.active ? (
                  <Badge tone="win">Activa · en la web</Badge>
                ) : (
                  <>
                    <Button variant="outline" disabled={busy !== null} onClick={() => onActivate(s.id, s.name)} className="h-11 sm:h-9">
                      <CalendarCheck className="mr-1 size-4" aria-hidden /> {busy === s.id ? 'Guardando…' : 'Activar'}
                    </Button>
                    <Button size="icon" variant="ghost" aria-label={`Borrar ${s.name}`} className="size-11 border border-border text-red-400 hover:bg-red-500/10 hover:text-red-300 sm:size-10 sm:border-0" disabled={busy !== null} onClick={() => onDelete(s.id, s.name)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <SaveBar changes={changes} saving={saving} savedAt={savedAt} onSave={() => void onSaveRenames()} onDiscard={() => setRenames({})} />
    </>
  )
}
