import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import {
  fetchActaEntries, fetchAdminSeasons, fetchAllPlayers, fetchMatchById, fetchRoster, saveActa, setMatchScore,
  type ActaEntry, type MatchRecord,
} from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, Checkbox, ErrorState, Field, NativeSelect, Notice, NumberInput, SaveBar, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, formatShortDate, POSITIONS, useUnsavedChanges } from './adminUtils'

const TEAM = 'Sansugus FC'
const STARTERS = 7

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

      <section className="panel mb-6 flex flex-wrap items-end gap-3 p-5">
        <Field label="Añadir jugador al acta" htmlFor="acta-pick">
          <NativeSelect id="acta-pick" value={pick} disabled={locked} onChange={(e) => setPick(e.target.value)} className="w-72">
            <option value="">—</option>
            {candidates.map((p) => <option key={p.id} value={p.id}>{p.name}{p.ownGoal ? ' (propia puerta)' : inRoster.has(p.id) ? '' : ' · fuera de la plantilla'}</option>)}
          </NativeSelect>
        </Field>
        <Button type="button" variant="outline" disabled={!pick || locked} onClick={onAdd}><Plus className="mr-1 size-4" aria-hidden /> Añadir</Button>
        <div className="ml-auto flex flex-wrap items-center gap-2 text-sm">
          <Badge tone={starters === STARTERS ? 'win' : 'soft'}>{starters} titulares</Badge>
          <Badge tone={clubGoals != null && clubGoals === actaGoals ? 'win' : 'soft'}>{actaGoals} goles en acta</Badge>
        </div>
      </section>

      {clubGoals != null && clubGoals !== actaGoals && rows.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Notice tone="warn">Sansugus FC marcó {clubGoals} según el partido y el acta suma {actaGoals}.</Notice>
          <Button type="button" size="sm" variant="outline" disabled={locked || dirty} title={dirty ? 'Guarda primero el acta' : undefined} onClick={() => void adjustScore()}>Ajustar marcador a {actaGoals}</Button>
        </div>
      )}
      {starters !== STARTERS && rows.length > 0 && <div className="mb-6"><Notice>En fútbol 7 salen {STARTERS} titulares; hay {starters} marcados.</Notice></div>}

      <section className="panel">
        {rows.length === 0 ? (
          <p className="px-6 py-14 text-center text-muted-foreground">Aún no hay jugadores en el acta. Añade a los que jugaron.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.playerId} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3">
                <div className="w-52 shrink-0">
                  <p className="font-display text-lg leading-tight text-white">{nameOf(r.playerId)}</p>
                  {!inRoster.has(r.playerId) && <p className="text-xs text-teamOrange">Se añadirá a la plantilla al guardar</p>}
                </div>
                <label className="flex flex-col items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Dorsal
                  <NumberInput className="w-16" value={r.number} allowEmpty disabled={locked} onChange={(v) => update(r.playerId, { number: v })} aria-label={`Dorsal de ${nameOf(r.playerId)}`} />
                </label>
                <label className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Posición
                  <NativeSelect value={r.position} disabled={locked} onChange={(e) => update(r.playerId, { position: e.target.value })} className="w-32 normal-case" aria-label={`Posición de ${nameOf(r.playerId)}`}>
                    <option value="">—</option>
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </NativeSelect>
                </label>
                <Checkbox label="Titular" checked={r.starter} disabled={locked} onChange={(e) => update(r.playerId, { starter: e.target.checked })} />
                {([['goals', 'Goles'], ['assists', 'Asist.'], ['yellows', 'Amar.'], ['reds', 'Rojas']] as const).map(([k, label]) => (
                  <label key={k} className="flex flex-col items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                    <NumberInput className="w-16" value={r[k]} disabled={locked} onChange={(v) => update(r.playerId, { [k]: v ?? 0 })} aria-label={`${label} de ${nameOf(r.playerId)}`} />
                  </label>
                ))}
                <label className={cn('flex cursor-pointer flex-col items-center text-[10px] font-bold uppercase tracking-widest', r.mvp ? 'text-teamOrange' : 'text-muted-foreground')}>
                  MVP
                  <input type="radio" name="mvp" checked={r.mvp} disabled={locked} readOnly onClick={() => setMvp(r.playerId, !r.mvp)} className="mt-3 size-5 accent-[var(--orange-main)]" aria-label={`MVP: ${nameOf(r.playerId)}`} />
                </label>
                <Button type="button" variant="ghost" size="icon" disabled={locked} aria-label={`Quitar a ${nameOf(r.playerId)} del acta`} className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => { setSavedAt(undefined); setRows((list) => list.filter((x) => x.playerId !== r.playerId)) }}>
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="mt-4 text-sm text-muted-foreground">Al guardar, los goles, asistencias, tarjetas y el MVP se reflejan al instante en las estadísticas de cada jugador y de la temporada.</p>

      {!locked && <SaveBar changes={dirty ? 1 : 0} saving={saving} savedAt={savedAt} onSave={() => void onSave()}
        onDiscard={() => { setRows(loaded.data?.entries ?? []); setInitial(snapshot(loaded.data?.entries ?? [])) }} saveLabel="Guardar acta" />}
    </>
  )
}
