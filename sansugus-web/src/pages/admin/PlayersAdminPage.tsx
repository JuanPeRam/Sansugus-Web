import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Undo2 } from 'lucide-react'
import { createPlayer, deletePlayer, fetchAllPlayers, updatePlayer, type PlayerRecord } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, EmptyState, ErrorState, Field, Input, NativeSelect, SaveBar, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, POSITIONS, useUnsavedChanges } from './adminUtils'

type Draft = PlayerRecord & { removed: boolean }

function stateOf(p: Draft, o?: PlayerRecord): 'borrar' | 'modificado' | null {
  if (!o) return null
  if (p.removed) return 'borrar'
  return p.name.trim() !== o.name || p.alias.trim() !== o.alias || p.position !== o.position ? 'modificado' : null
}

export default function PlayersAdminPage() {
  const players = useAsync(fetchAllPlayers, [])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [actionError, setActionError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number>()
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ name: '', alias: '', position: '' })

  const original = useMemo(() => new Map((players.data ?? []).map((p) => [p.id, p])), [players.data])
  const reset = () => setDrafts((players.data ?? []).map((p) => ({ ...p, removed: false })))
  useEffect(reset, [players.data])

  const changes = drafts.filter((p) => stateOf(p, original.get(p.id))).length
  useUnsavedChanges(changes > 0)

  const update = (id: number, patch: Partial<Draft>) => {
    setDrafts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    setSavedAt(undefined)
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return setActionError('Escribe el nombre del jugador.')
    if ((players.data ?? []).some((p) => p.name.toLowerCase() === name.toLowerCase())) return setActionError(`${name} ya existe.`)
    setActionError(undefined)
    try {
      await createPlayer({ name, alias: form.alias, position: form.position })
      setForm({ name: '', alias: '', position: '' })
      players.reload()
    } catch (err) {
      setActionError(errorText(err))
    }
  }

  const onSave = async () => {
    if (drafts.some((p) => !p.removed && !p.name.trim())) return setActionError('Hay un jugador sin nombre.')
    setSaving(true)
    setActionError(undefined)
    try {
      for (const p of drafts) {
        const state = stateOf(p, original.get(p.id))
        if (state === 'borrar') await deletePlayer(p.id)
        else if (state === 'modificado') await updatePlayer(p.id, p)
      }
      setSavedAt(Date.now())
    } catch (err) {
      setActionError(`${errorText(err)} Los cambios anteriores a este error sí se guardaron.`)
    } finally {
      setSaving(false)
      players.reload()
    }
  }

  const term = filter.trim().toLowerCase()
  const list = drafts.filter((p) => !p.ownGoal && (!term || p.name.toLowerCase().includes(term) || p.alias.toLowerCase().includes(term)))

  return (
    <>
      <AdminPageHeader
        title="Jugadores"
        description="Todos los jugadores de la historia del club. Para añadirlos a una temporada, ve a Plantilla."
        actions={<Input aria-label="Buscar jugador" placeholder="Buscar…" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-56" />}
      />
      <ActionError message={actionError} />

      <section className="panel mb-6 p-5">
        <form onSubmit={onCreate} className="flex flex-wrap items-end gap-3">
          <Field label="Nombre" htmlFor="p-name"><Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre y apellidos" className="w-64" /></Field>
          <Field label="Alias" htmlFor="p-alias"><Input id="p-alias" value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} className="w-36" /></Field>
          <Field label="Posición" htmlFor="p-pos">
            <NativeSelect id="p-pos" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-40">
              <option value="">—</option>
              {POSITIONS.map((p) => <option key={p}>{p}</option>)}
            </NativeSelect>
          </Field>
          <Button type="submit" className="bg-teamOrange text-black hover:bg-teamOrange-light"><Plus className="mr-1 size-4" aria-hidden /> Crear jugador</Button>
        </form>
      </section>

      <section className="panel">
        {players.loading ? (
          <Skeletons />
        ) : players.error ? (
          <ErrorState onRetry={players.reload} description={players.error.message} />
        ) : list.length === 0 ? (
          <EmptyState title="Sin jugadores" description={filter ? 'Ningún jugador coincide con la búsqueda.' : 'Crea el primer jugador con el formulario.'} />
        ) : (
          <ul className="divide-y divide-border">
            {list.map((p) => {
              const o = original.get(p.id)
              const state = stateOf(p, o)
              return (
                <li key={p.id} className={cn('flex flex-wrap items-center gap-3 px-5 py-3', state && 'bg-teamOrange/5', p.removed && 'opacity-60')}>
                  <Input aria-label={`Nombre de ${o?.name ?? p.name}`} value={p.name} disabled={p.removed} onChange={(e) => update(p.id, { name: e.target.value })} className={cn('w-64', p.removed && 'line-through')} />
                  <Input aria-label={`Alias de ${o?.name ?? p.name}`} placeholder="Alias" value={p.alias} disabled={p.removed} onChange={(e) => update(p.id, { alias: e.target.value })} className="w-36" />
                  <NativeSelect aria-label={`Posición de ${o?.name ?? p.name}`} value={p.position} disabled={p.removed} onChange={(e) => update(p.id, { position: e.target.value })} className="w-36">
                    <option value="">Sin posición</option>
                    {POSITIONS.map((x) => <option key={x}>{x}</option>)}
                  </NativeSelect>
                  <div className="flex flex-1 items-center justify-end gap-2">
                    {state === 'modificado' && <Badge>Modificado</Badge>}
                    {state === 'borrar' && <Badge tone="loss">Se borrará</Badge>}
                    {p.removed ? (
                      <Button size="icon" variant="ghost" aria-label={`No borrar a ${o?.name ?? p.name}`} onClick={() => update(p.id, { removed: false })}><Undo2 className="size-4" /></Button>
                    ) : (
                      <Button size="icon" variant="ghost" aria-label={`Borrar a ${o?.name ?? p.name}`} title="Solo se puede borrar si no tiene partidos ni temporadas" className="text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => update(p.id, { removed: true })}>
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      <SaveBar changes={changes} saving={saving} savedAt={savedAt} onSave={() => void onSave()} onDiscard={reset} />
    </>
  )
}
