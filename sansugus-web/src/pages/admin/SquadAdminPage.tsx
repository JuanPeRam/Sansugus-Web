import { useEffect, useMemo, useState } from 'react'
import { Plus, Undo2, UserMinus } from 'lucide-react'
import {
  addToRoster, createPlayer, fetchAllPlayers, fetchRoster, removeFromRoster, updateHistoricStats, updateRosterNumber,
  type HistoricStats, type RosterEntry,
} from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, EmptyState, ErrorState, Field, Input, NativeSelect, NumberInput, Notice, SaveBar, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, useAdminSeason, useUnsavedChanges } from './adminUtils'

/** Fila editable: las existentes llevan playerId; las nuevas, playerId (jugador ya creado) o solo el nombre */
type DraftRow = {
  key: string
  playerId?: number
  isNew: boolean
  name: string
  number: number | null
  historic: HistoricStats | null
  stats: RosterEntry['stats']
  removed: boolean
}

const toDraft = (e: RosterEntry): DraftRow => ({
  key: `p${e.playerId}`, playerId: e.playerId, isNew: false, name: e.name, number: e.number, historic: e.historic, stats: e.stats, removed: false,
})

type RowState = 'nuevo' | 'quitar' | 'modificado' | null

const sameHistoric = (a: HistoricStats | null, b: HistoricStats | null) => JSON.stringify(a) === JSON.stringify(b)

function rowState(row: DraftRow, original: Map<number, RosterEntry>): RowState {
  if (row.isNew) return row.removed ? null : 'nuevo'
  if (row.removed) return 'quitar'
  const o = original.get(row.playerId!)
  if (!o) return null
  return o.number !== row.number || !sameHistoric(o.historic, row.historic) ? 'modificado' : null
}

const STATE_BADGE: Record<Exclude<RowState, null>, { label: string; tone: 'orange' | 'loss' | 'soft' }> = {
  nuevo: { label: 'Nuevo', tone: 'orange' },
  quitar: { label: 'Se quitará', tone: 'loss' },
  modificado: { label: 'Modificado', tone: 'soft' },
}

const HISTORIC_FIELDS: { key: keyof HistoricStats; label: string }[] = [
  { key: 'played', label: 'PJ' }, { key: 'goals', label: 'Goles' }, { key: 'assists', label: 'Asist.' },
  { key: 'yellows', label: 'Amar.' }, { key: 'reds', label: 'Rojas' }, { key: 'mvps', label: 'MVP' },
]
const ZERO: HistoricStats = { goals: 0, assists: 0, played: 0, yellows: 0, reds: 0, mvps: 0 }

export default function SquadAdminPage() {
  const { seasonId, season, picker, loading: seasonsLoading, error: seasonsError } = useAdminSeason()
  const ready = seasonId != null
  const roster = useAsync(() => fetchRoster(seasonId!), [seasonId], ready)
  const players = useAsync(fetchAllPlayers, [])
  const [rows, setRows] = useState<DraftRow[]>([])
  const [actionError, setActionError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number>()
  const [pick, setPick] = useState('')
  const [newName, setNewName] = useState('')

  const original = useMemo(() => new Map((roster.data ?? []).map((e) => [e.playerId, e])), [roster.data])
  // Temporadas anteriores a las actas: las estadísticas se escriben a mano
  const isHistoric = (roster.data ?? []).some((e) => e.historic)
  const reset = () => setRows((roster.data ?? []).map(toDraft))
  useEffect(reset, [roster.data])

  const changes = rows.filter((r) => rowState(r, original)).length
  useUnsavedChanges(changes > 0)

  const update = (key: string, patch: Partial<DraftRow>) => {
    setRows((list) => list.map((r) => (r.key === key ? { ...r, ...patch } : r)))
    setSavedAt(undefined)
  }

  const taken = new Set(rows.filter((r) => !r.removed && r.playerId != null).map((r) => r.playerId))
  const candidates = (players.data ?? []).filter((p) => !taken.has(p.id))

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const existing = players.data?.find((p) => p.id === Number(pick))
    const name = existing?.name ?? newName.trim()
    if (!name) return setActionError('Elige un jugador existente o escribe el nombre de uno nuevo.')
    if (!existing && (players.data ?? []).some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return setActionError(`${name} ya existe: elígelo en la lista de jugadores existentes.`)
    }
    setActionError(undefined)
    setRows((list) => [
      ...list,
      { key: `n${Date.now()}`, playerId: existing?.id, isNew: true, name, number: null, historic: isHistoric ? { ...ZERO } : null, stats: { goals: 0, assists: 0, played: 0, yellows: 0, reds: 0, mvps: 0 }, removed: false },
    ])
    setPick('')
    setNewName('')
  }

  const onSave = async () => {
    if (seasonId == null) return
    setSaving(true)
    setActionError(undefined)
    try {
      for (const r of rows) {
        const state = rowState(r, original)
        const o = r.playerId != null ? original.get(r.playerId) : undefined
        if (state === 'quitar') await removeFromRoster(seasonId, r.playerId!, !!o?.historic)
        else if (state === 'modificado') {
          if (o!.number !== r.number) await updateRosterNumber(seasonId, r.playerId!, r.number)
          if (r.historic && !sameHistoric(o!.historic, r.historic)) await updateHistoricStats(seasonId, r.playerId!, r.historic)
        } else if (state === 'nuevo') {
          const playerId = r.playerId ?? (await createPlayer({ name: r.name }))
          await addToRoster(seasonId, playerId, r.number, isHistoric)
          if (r.historic && isHistoric) await updateHistoricStats(seasonId, playerId, r.historic)
        }
      }
      setSavedAt(Date.now())
    } catch (err) {
      setActionError(`${errorText(err)} Los cambios anteriores a este error sí se guardaron.`)
    } finally {
      setSaving(false)
      roster.reload()
      players.reload()
    }
  }

  const visible = rows.filter((r) => !(r.isNew && r.removed))
  const error = seasonsError ?? roster.error
  return (
    <>
      <AdminPageHeader
        title="Plantilla"
        description="Jugadores de cada temporada y su dorsal. Las estadísticas salen de las actas de los partidos."
        actions={picker}
      />
      <ActionError message={actionError} />
      {isHistoric && (
        <div className="mb-6">
          <Notice>Temporada anterior a las actas: sus estadísticas se escriben aquí a mano.</Notice>
        </div>
      )}

      <section className="panel mb-6 p-5">
        <h2 className="mb-4 font-display text-2xl text-white">Añadir jugador a la temporada {season}</h2>
        <form onSubmit={onAdd} className="flex flex-wrap items-end gap-3">
          <Field label="Jugador existente" htmlFor="sq-pick">
            <NativeSelect id="sq-pick" value={pick} onChange={(e) => { setPick(e.target.value); if (e.target.value) setNewName('') }} className="w-60">
              <option value="">—</option>
              {candidates.filter((p) => !p.ownGoal).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </NativeSelect>
          </Field>
          <span className="pb-3 text-sm text-muted-foreground">o</span>
          <Field label="Jugador nuevo" htmlFor="sq-new">
            <Input id="sq-new" value={newName} onChange={(e) => { setNewName(e.target.value); if (e.target.value) setPick('') }} placeholder="Nombre y apellidos" className="w-60" />
          </Field>
          <Button type="submit" variant="outline" disabled={!ready}><Plus className="mr-1 size-4" aria-hidden /> Añadir</Button>
        </form>
      </section>

      <section className="panel">
        {seasonsLoading || roster.loading ? (
          <Skeletons />
        ) : error ? (
          <ErrorState onRetry={roster.reload} description={error.message} />
        ) : visible.length === 0 ? (
          <EmptyState title="Plantilla vacía" description={`Añade los jugadores de la temporada ${season ?? ''}.`} />
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((r) => {
              const state = rowState(r, original)
              const stats = r.stats
              return (
                <li key={r.key} className={cn('flex flex-wrap items-center gap-4 px-5 py-3', state && 'bg-teamOrange/5', r.removed && 'opacity-60')}>
                  <div className="min-w-44 flex-1">
                    <p className={cn('flex items-center gap-2 font-display text-xl text-white', r.removed && 'line-through')}>
                      {r.name}
                      {state && <Badge tone={STATE_BADGE[state].tone}>{STATE_BADGE[state].label}</Badge>}
                    </p>
                    {!r.historic && !r.isNew && (
                      <p className="text-xs text-muted-foreground">
                        {stats.played} PJ · {stats.goals} goles · {stats.assists} asist. · {stats.yellows} am. · {stats.reds} rojas · {stats.mvps} MVP
                      </p>
                    )}
                  </div>
                  <label className="flex flex-col items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Dorsal
                    <NumberInput value={r.number} allowEmpty disabled={r.removed} onChange={(v) => update(r.key, { number: v })} aria-label={`Dorsal de ${r.name}`} />
                  </label>
                  {r.historic && HISTORIC_FIELDS.map(({ key, label }) => (
                    <label key={key} className="flex flex-col items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {label}
                      <NumberInput value={r.historic![key]} disabled={r.removed} onChange={(v) => update(r.key, { historic: { ...r.historic!, [key]: v ?? 0 } })} aria-label={`${label} de ${r.name}`} />
                    </label>
                  ))}
                  {r.removed ? (
                    <Button size="icon" variant="ghost" aria-label={`Mantener a ${r.name}`} onClick={() => update(r.key, { removed: false })}><Undo2 className="size-4" /></Button>
                  ) : (
                    <Button size="icon" variant="ghost" aria-label={`Quitar a ${r.name} de la temporada`} title="No se puede quitar a quien ya tiene partidos esta temporada" className="text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => update(r.key, { removed: true })}>
                      <UserMinus className="size-4" />
                    </Button>
                  )}
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
