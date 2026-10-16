import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Star, X } from 'lucide-react'
import {
  fetchActaEntries, fetchAdminSeasons, fetchAllPlayers, fetchMatchById, fetchRoster, saveActa, setMatchScore,
  type ActaEntry, type MatchRecord,
} from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, ErrorState, Field, NativeSelect, Notice, NumberInput, SaveBar, Skeletons, Stepper } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, formatShortDate, POSITIONS, useUnsavedChanges } from './adminUtils'

const TEAM = 'Sansugus FC'
const STARTERS = 7

const POSITION_SHORT: Record<string, string> = { Portero: 'POR', Defensa: 'DEF', Medio: 'MED', Delantero: 'DEL' }

/** Grupo de botones excluyentes (rol, posición), cómodo con el dedo */
function Segmented({ label, name, value, options, onChange, disabled, className }: {
  label: string
  name: string
  value: string
  options: (readonly [string, string])[]
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div role="group" aria-label={`${label} de ${name}`} className="flex h-11 overflow-hidden rounded-md border border-input text-xs font-bold uppercase tracking-wider sm:h-10">
        {options.map(([v, text]) => (
          <button key={v} type="button" disabled={disabled} aria-pressed={value === v} title={v} onClick={() => onChange(v)}
            className={cn('min-w-0 flex-1 border-l border-input px-1 transition first:border-l-0 disabled:opacity-50', value === v ? 'bg-white text-black' : 'text-muted-foreground hover:bg-white/5 hover:text-white')}>
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

const snapshot = (rows: ActaEntry[]) => JSON.stringify([...rows].sort((a, b) => a.playerId - b.playerId))

export default function ActaEditorPage() {
  const matchId = Number(useParams().id)
  const [match, setMatch] = useState<MatchRecord | undefined>()
  const loaded = useAsync(async () => {
    const m = await fetchMatchById(matchId)
    if (!m) throw new Error('El partido no existe')
    const [entries, roster, players, seasons] = await Promise.all([fetchActaEntries(matchId), fetchRoster(m.seasonId), fetchAllPlayers(), fetchAdminSeasons()])
    return { m, entries, roster, players, seasonName: seasons.find((x) => x.id === m.seasonId)?.name }
  }, [matchId])

  const [rows, setRows] = useState<ActaEntry[]>([])
  const [initial, setInitial] = useState('[]')
  const [pick, setPick] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!loaded.data) return
    setMatch(loaded.data.m)
    setRows(loaded.data.entries)
    setInitial(snapshot(loaded.data.entries))
  }, [loaded.data])

  const roster = loaded.data?.roster ?? []
  const players = loaded.data?.players ?? []
  const nameOf = (id: number) => players.find((p) => p.id === id)?.name ?? `Jugador ${id}`
  const isHistoric = roster.some((r) => r.historic)

  const dirty = snapshot(rows) !== initial
  useUnsavedChanges(dirty)

  const update = (playerId: number, patch: Partial<ActaEntry>) => {
    setSavedAt(undefined)
    setRows((list) => list.map((r) => (r.playerId === playerId ? { ...r, ...patch } : r)))
  }
  // Solo puede haber un MVP por partido
  const setMvp = (playerId: number, mvp: boolean) => {
    setSavedAt(undefined)
    setRows((list) => list.map((r) => ({ ...r, mvp: r.playerId === playerId ? mvp : mvp ? false : r.mvp })))
  }

  const inActa = new Set(rows.map((r) => r.playerId))
  const inRoster = new Map(roster.map((r) => [r.playerId, r]))
  const candidates = useMemo(
    () => players.filter((p) => !inActa.has(p.id)).sort((a, b) => Number(inRoster.has(b.id)) - Number(inRoster.has(a.id)) || a.name.localeCompare(b.name, 'es')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [players, rows, roster]
  )

  const onAdd = () => {
    const p = players.find((x) => x.id === Number(pick))
    if (!p) return
    const starters = rows.filter((r) => r.starter).length
    setSavedAt(undefined)
    setRows((list) => [...list, {
      playerId: p.id, starter: starters < STARTERS, position: p.position, number: inRoster.get(p.id)?.number ?? null,
      goals: 0, assists: 0, yellows: 0, reds: 0, mvp: false,
    }])
    setPick('')
  }

  const clubSide = match ? (match.home === TEAM ? 'home' : match.away === TEAM ? 'away' : null) : null
  const clubGoals = clubSide === 'home' ? match?.homeGoals : clubSide === 'away' ? match?.awayGoals : null
  const actaGoals = rows.reduce((s, r) => s + r.goals, 0)
  const starters = rows.filter((r) => r.starter).length

  const onSave = async () => {
    setSaving(true)
    setError(undefined)
    try {
      await saveActa(matchId, rows)
      setInitial(snapshot(rows))
      setSavedAt(Date.now())
    } catch (err) {
      setError(errorText(err))
    } finally {
      setSaving(false)
    }
  }

  const adjustScore = async () => {
    if (!match || !clubSide) return
    setError(undefined)
    try {
      const [h, a] = clubSide === 'home' ? [actaGoals, match.awayGoals ?? 0] : [match.homeGoals ?? 0, actaGoals]
      await setMatchScore(matchId, h, a)
      setMatch({ ...match, homeGoals: h, awayGoals: a })
    } catch (err) {
      setError(errorText(err))
    }
  }

  const back = (
    <Link to={loaded.data?.seasonName ? `/admin/partidos?temporada=${encodeURIComponent(loaded.data.seasonName)}` : '/admin/partidos'} onClick={(e) => { if (dirty && !window.confirm('Hay cambios sin guardar. ¿Salir sin guardarlos?')) e.preventDefault() }}
      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-teamOrange">
      <ArrowLeft className="size-4" aria-hidden /> Partidos
    </Link>
  )

  if (loaded.loading) return <><div className="mb-4">{back}</div><div className="panel"><Skeletons /></div></>
  if (loaded.error || !match) return <><div className="mb-4">{back}</div><div className="panel"><ErrorState description={loaded.error?.message} onRetry={loaded.reload} /></div></>

  const locked = isHistoric || !match.played
  return (
    <>
      <div className="mb-4">{back}</div>
      <AdminPageHeader
        title="Acta del partido"
        description={`${match.home} ${match.played ? `${match.homeGoals} - ${match.awayGoals}` : 'vs'} ${match.away}${match.date ? ` · ${formatShortDate(match.date)}` : ''} · ${match.competition} ${match.round}`}
      />
      <ActionError message={error} />
      {isHistoric && <div className="mb-6"><Notice tone="warn">Esta temporada usa estadísticas históricas y no admite actas. Sus estadísticas se editan en Plantilla.</Notice></div>}
      {!isHistoric && !match.played && <div className="mb-6"><Notice tone="warn">El partido no está marcado como jugado. Márcalo como jugado y guarda el resultado para rellenar el acta.</Notice></div>}

      <section className="panel mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end md:p-5">
        <Field label="Añadir jugador al acta" htmlFor="acta-pick">
          <NativeSelect id="acta-pick" value={pick} disabled={locked} onChange={(e) => setPick(e.target.value)} className="w-full sm:w-72">
            <option value="">Elige un jugador…</option>
            {candidates.map((p) => <option key={p.id} value={p.id}>{p.name}{p.ownGoal ? ' (propia puerta)' : inRoster.has(p.id) ? '' : ' · fuera de la plantilla'}</option>)}
          </NativeSelect>
        </Field>
        <Button type="button" variant="outline" disabled={!pick || locked} onClick={onAdd} className="h-11 sm:h-10"><Plus className="mr-1 size-4" aria-hidden /> Añadir</Button>
        <div className="flex flex-wrap items-center gap-2 text-sm sm:ml-auto">
          <Badge tone={starters === STARTERS ? 'win' : 'soft'}>{starters} titulares</Badge>
          <Badge tone={clubGoals != null && clubGoals === actaGoals ? 'win' : 'soft'}>{actaGoals} goles en acta</Badge>
        </div>
      </section>

      {clubGoals != null && clubGoals !== actaGoals && rows.length > 0 && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Notice tone="warn">Sansugus FC marcó {clubGoals} según el partido y el acta suma {actaGoals}.</Notice>
          <Button type="button" variant="outline" className="h-11 sm:h-9" disabled={locked || dirty} title={dirty ? 'Guarda primero el acta' : undefined} onClick={() => void adjustScore()}>Ajustar marcador a {actaGoals}</Button>
        </div>
      )}
      {starters !== STARTERS && rows.length > 0 && <div className="mb-5"><Notice>En fútbol 7 salen {STARTERS} titulares; hay {starters} marcados.</Notice></div>}

      {rows.length === 0 ? (
        <section className="panel">
          <p className="px-6 py-14 text-center text-muted-foreground">Aún no hay jugadores en el acta. Añade a los que jugaron.</p>
        </section>
      ) : (
        ([['Titulares', true], ['Suplentes', false]] as const).map(([title, isStarter]) => {
          const group = rows.filter((r) => r.starter === isStarter)
          if (group.length === 0) return null
          return (
            <section key={title} className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-white">
                {title} <span className="text-base text-muted-foreground">{group.length}</span>
              </h2>
              <ul className="grid gap-3 xl:grid-cols-2">
                {group.map((r) => {
                  const name = nameOf(r.playerId)
                  return (
                    <li key={r.playerId} className={cn('panel flex flex-col gap-4 p-4', r.mvp && 'border-teamOrange/70')}>
                      <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-teamOrange font-display text-xl text-black tabular-nums">{r.number ?? '–'}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-lg leading-tight text-white">{name}</p>
                          {!inRoster.has(r.playerId) && <p className="text-xs text-teamOrange">Se añadirá a la plantilla al guardar</p>}
                        </div>
                        <button type="button" disabled={locked} onClick={() => setMvp(r.playerId, !r.mvp)} aria-pressed={r.mvp} aria-label={`MVP: ${name}`}
                          className={cn('flex h-11 shrink-0 items-center gap-1 rounded-md border px-3 text-xs font-extrabold uppercase tracking-widest transition disabled:opacity-50',
                            r.mvp ? 'border-teamOrange bg-teamOrange text-black' : 'border-border text-muted-foreground hover:text-white')}>
                          <Star className={cn('size-4', r.mvp && 'fill-current')} aria-hidden /> MVP
                        </button>
                        <Button type="button" variant="ghost" size="icon" disabled={locked} aria-label={`Quitar a ${name} del acta`} className="size-11 shrink-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => { setSavedAt(undefined); setRows((list) => list.filter((x) => x.playerId !== r.playerId)) }}>
                          <X className="size-5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-[1fr_5rem] gap-3 sm:grid-cols-[9rem_1fr_5rem]">
                        <Segmented label="Rol" name={name} disabled={locked} value={r.starter ? 'T' : 'S'}
                          options={[['T', 'Titular'], ['S', 'Suplente']]} onChange={(v) => update(r.playerId, { starter: v === 'T' })} />
                        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:order-last">
                          Dorsal
                          <NumberInput className="w-full" value={r.number} allowEmpty disabled={locked} onChange={(v) => update(r.playerId, { number: v })} aria-label={`Dorsal de ${name}`} />
                        </label>
                        <Segmented label="Posición" name={name} disabled={locked} value={r.position} className="col-span-2 sm:col-span-1"
                          options={POSITIONS.map((p) => [p, POSITION_SHORT[p] ?? p])} onChange={(v) => update(r.playerId, { position: v })} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {([['goals', 'Goles'], ['assists', 'Asist.'], ['yellows', 'Amarillas'], ['reds', 'Rojas']] as const).map(([k, label]) => (
                          <Stepper key={k} label={label} ariaLabel={`${label.toLowerCase()} de ${name}`} value={r[k]} disabled={locked} highlight onChange={(v) => update(r.playerId, { [k]: v })} />
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })
      )}
      <p className="mt-4 text-sm text-muted-foreground">Al guardar, los goles, asistencias, tarjetas y el MVP se reflejan al instante en las estadísticas de cada jugador y de la temporada.</p>

      {!locked && <SaveBar changes={dirty ? 1 : 0} saving={saving} savedAt={savedAt} onSave={() => void onSave()}
        onDiscard={() => { setRows(loaded.data?.entries ?? []); setInitial(snapshot(loaded.data?.entries ?? [])) }} saveLabel="Guardar acta" />}
    </>
  )
}
