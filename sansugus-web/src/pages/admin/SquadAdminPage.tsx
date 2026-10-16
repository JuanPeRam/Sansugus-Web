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
import { RosterImageSlot } from './RosterImageSlot'
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

  // Foto y camiseta por jugador: se guardan al momento, fuera del borrador (descartar no las toca)
  type Images = { photoUrl: string | null; shirtUrl: string | null }
  const [images, setImages] = useState<Record<number, Images>>({})
  useEffect(() => {
    setImages(Object.fromEntries((roster.data ?? []).map((e) => [e.playerId, { photoUrl: e.photoUrl, shirtUrl: e.shirtUrl }])))
  }, [roster.data])
  const setImage = (playerId: number, patch: Partial<Images>) =>
    setImages((all) => ({ ...all, [playerId]: { ...(all[playerId] ?? { photoUrl: null, shirtUrl: null }), ...patch } }))

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
        description="Jugadores de cada temporada, su dorsal, su foto y la camiseta de las actas. Las estadísticas salen de las actas de los partidos."
        actions={picker}
      />
      <ActionError message={actionError} />
      {isHistoric && (
        <div className="mb-5">
          <Notice>Temporada anterior a las actas: sus estadísticas se escriben aquí a mano.</Notice>
        </div>
      )}

      <section className="panel mb-5 p-4 md:p-5">
        <h2 className="mb-3 font-display text-xl text-white md:text-2xl">Añadir a la temporada {season}</h2>
        <form onSubmit={onAdd} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <Field label="Jugador existente" htmlFor="sq-pick">
            <NativeSelect id="sq-pick" value={pick} onChange={(e) => { setPick(e.target.value); if (e.target.value) setNewName('') }} className="w-full sm:w-60">
              <option value="">Elige un jugador…</option>
              {candidates.filter((p) => !p.ownGoal).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </NativeSelect>
          </Field>
          <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground sm:pb-3 sm:text-sm sm:normal-case sm:tracking-normal">
            <span className="h-px flex-1 bg-border sm:hidden" aria-hidden /> o <span className="h-px flex-1 bg-border sm:hidden" aria-hidden />
          </span>
          <Field label="Jugador nuevo" htmlFor="sq-new">
            <Input id="sq-new" value={newName} onChange={(e) => { setNewName(e.target.value); if (e.target.value) setPick('') }} placeholder="Nombre y apellidos" className="w-full sm:w-60" />
          </Field>
          <Button type="submit" variant="outline" disabled={!ready} className="h-11 sm:h-10"><Plus className="mr-1 size-4" aria-hidden /> Añadir</Button>
        </form>
      </section>

      {seasonsLoading || roster.loading ? (
        <div className="panel"><Skeletons /></div>
      ) : error ? (
        <div className="panel"><ErrorState onRetry={roster.reload} description={error.message} /></div>
      ) : visible.length === 0 ? (
        <div className="panel"><EmptyState title="Plantilla vacía" description={`Añade los jugadores de la temporada ${season ?? ''}.`} /></div>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{visible.filter((r) => !r.removed).length} jugadores · toca la foto o la camiseta para subirla</p>
          <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {visible.map((r) => {
              const state = rowState(r, original)
              const stats = r.stats
              const img = r.playerId != null ? images[r.playerId] : undefined
              return (
                <li key={r.key} className={cn('panel flex flex-col gap-4 p-4', state && 'border-teamOrange/50 bg-teamOrange/5', r.removed && 'opacity-60')}>
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className={cn('font-display text-xl leading-tight text-white', r.removed && 'line-through')}>{r.name}</p>
                      {state && <span className="mt-1 inline-block"><Badge tone={STATE_BADGE[state].tone}>{STATE_BADGE[state].label}</Badge></span>}
                      {!r.historic && !r.isNew && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stats.played} PJ · {stats.goals} G · {stats.assists} A · {stats.yellows} TA · {stats.reds} TR · {stats.mvps} MVP
                        </p>
                      )}
                    </div>
                    {r.removed ? (
                      <Button size="icon" variant="ghost" className="size-11 shrink-0 border border-border" aria-label={`Mantener a ${r.name}`} onClick={() => update(r.key, { removed: false })}><Undo2 className="size-4" /></Button>
                    ) : (
                      <Button size="icon" variant="ghost" aria-label={`Quitar a ${r.name} de la temporada`} title="No se puede quitar a quien ya tiene partidos esta temporada" className="size-11 shrink-0 border border-border text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => update(r.key, { removed: true })}>
                        <UserMinus className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-end gap-4">
                    {r.isNew || seasonId == null ? (
                      <p className="flex-1 text-xs text-muted-foreground">Guarda la plantilla para poder subir su foto y su camiseta.</p>
                    ) : (
                      <>
                        <RosterImageSlot
                          seasonId={seasonId} playerId={r.playerId!} playerName={r.name} kind="photo" url={img?.photoUrl ?? null} disabled={r.removed}
                          onChange={(url) => setImage(r.playerId!, { photoUrl: url })} onError={setActionError}
                        />
                        <RosterImageSlot
                          seasonId={seasonId} playerId={r.playerId!} playerName={r.name} kind="shirt" url={img?.shirtUrl ?? null} disabled={r.removed}
                          onChange={(url) => setImage(r.playerId!, { shirtUrl: url })} onError={setActionError}
                        />
                      </>
                    )}
                    <label className="ml-auto flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Dorsal
                      <NumberInput value={r.number} allowEmpty disabled={r.removed} onChange={(v) => update(r.key, { number: v })} aria-label={`Dorsal de ${r.name}`} className="h-14 w-20 font-display text-2xl sm:h-14 sm:text-2xl" />
                    </label>
                  </div>

                  {r.historic && (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {HISTORIC_FIELDS.map(({ key, label }) => (
                        <label key={key} className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {label}
                          <NumberInput value={r.historic![key]} disabled={r.removed} onChange={(v) => update(r.key, { historic: { ...r.historic!, [key]: v ?? 0 } })} aria-label={`${label} de ${r.name}`} className="w-full" />
                        </label>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}

      <SaveBar changes={changes} saving={saving} savedAt={savedAt} onSave={() => void onSave()} onDiscard={reset} />
    </>
  )
}
