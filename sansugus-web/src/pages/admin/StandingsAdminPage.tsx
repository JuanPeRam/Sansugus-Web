import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ListOrdered, Plus, Trash2 } from 'lucide-react'
import { fetchSeasonStandings, fetchSuggestions, saveStandings, type StandingInput } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TeamCrest } from '@/components/TeamCrest'
import { ActionError, Badge, EmptyState, ErrorState, Input, Notice, NumberInput, SaveBar, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { errorText, formatShortDate, formatTime, useAdminSeason, useUnsavedChanges } from './adminUtils'

type DraftRow = StandingInput & { key: string }

const CLUB = 'Sansugus FC'

const toDraft = (r: StandingInput, i: number): DraftRow => ({ ...r, key: `r${i}-${r.team}` })
const strip = (r: DraftRow): StandingInput => ({
  team: r.team.trim(), played: r.played, remaining: r.remaining, won: r.won, drawn: r.drawn, lost: r.lost,
  goalsFor: r.goalsFor, goalsAgainst: r.goalsAgainst, points: r.points,
})
const blank = (remaining: number): DraftRow => ({
  key: `n${Date.now()}`, team: '', played: 0, remaining, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0,
})

/** Orden de liga: puntos, diferencia de goles, goles a favor (a igualdad, se mantiene el orden actual) */
const byTable = (a: StandingInput, b: StandingInput) =>
  b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) || b.goalsFor - a.goalsFor

const FIELDS: { key: keyof Omit<StandingInput, 'team' | 'played'>; label: string; title: string }[] = [
  { key: 'won', label: 'G', title: 'Ganados' },
  { key: 'drawn', label: 'E', title: 'Empatados' },
  { key: 'lost', label: 'P', title: 'Perdidos' },
  { key: 'goalsFor', label: 'GF', title: 'Goles a favor' },
  { key: 'goalsAgainst', label: 'GC', title: 'Goles en contra' },
  { key: 'remaining', label: 'PR', title: 'Partidos restantes' },
  { key: 'points', label: 'PTS', title: 'Puntos' },
]

export default function StandingsAdminPage() {
  const { seasonId, season, picker, loading: seasonsLoading, error: seasonsError } = useAdminSeason()
  const ready = seasonId != null
  const standings = useAsync(() => fetchSeasonStandings(seasonId!), [seasonId], ready)
  const suggestions = useAsync(fetchSuggestions, [])
  const [rows, setRows] = useState<DraftRow[]>([])
  const [actionError, setActionError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number>()

  const original = useMemo(() => (standings.data?.rows ?? []).map((r) => strip({ ...r, key: '' })), [standings.data])
  const reset = () => setRows(original.map(toDraft))
  useEffect(reset, [original])

  // Cambios = posiciones cuyo contenido difiere de lo guardado (incluidas las que sobran al quitar equipos)
  const changes = useMemo(() => {
    const current = rows.map(strip)
    const differ = current.filter((r, i) => JSON.stringify(r) !== JSON.stringify(original[i])).length
    return differ + Math.max(0, original.length - current.length)
  }, [rows, original])
  useUnsavedChanges(changes > 0)

  const edit = (key: string, apply: (r: DraftRow) => DraftRow) => {
    setRows((list) => list.map((r) => (r.key === key ? apply(r) : r)))
    setSavedAt(undefined)
  }

  /** G/E/P recalculan PJ, PR y puntos (3 por victoria, 1 por empate); los puntos se pueden ajustar a mano */
  const setResult = (r: DraftRow, field: 'won' | 'drawn' | 'lost', value: number): DraftRow => {
    const next = { ...r, [field]: value }
    const played = next.won + next.drawn + next.lost
    return {
      ...next,
      played,
      remaining: Math.max(0, r.remaining - (played - r.played)),
      points: r.points + (next.won - r.won) * 3 + (next.drawn - r.drawn),
    }
  }

  const move = (index: number, delta: number) => {
    setRows((list) => {
      const to = index + delta
      if (to < 0 || to >= list.length) return list
      const next = [...list]
      ;[next[index], next[to]] = [next[to], next[index]]
      return next
    })
    setSavedAt(undefined)
  }

  const sortTable = () => {
    setRows((list) => [...list].sort(byTable))
    setSavedAt(undefined)
  }

  const addTeam = () => {
    const remaining = rows.length ? Math.max(...rows.map((r) => r.played + r.remaining)) : 0
    setRows((list) => [...list, blank(remaining)])
    setSavedAt(undefined)
  }

  const onSave = async () => {
    if (seasonId == null) return
    const current = rows.map(strip)
    if (current.some((r) => !r.team)) return setActionError('Hay un equipo sin nombre.')
    const lower = current.map((r) => r.team.toLowerCase())
    if (new Set(lower).size !== lower.length) return setActionError('Un equipo aparece dos veces en la clasificación.')
    const names = new Set(current.map((r) => r.team))
    const removed = original.map((r) => r.team).filter((t) => !names.has(t))
    setSaving(true)
    setActionError(undefined)
    try {
      await saveStandings(seasonId, current, removed)
      setSavedAt(Date.now())
      standings.reload()
    } catch (err) {
      setActionError(errorText(err))
    } finally {
      setSaving(false)
    }
  }

  const updatedAt = standings.data?.updatedAt
  const loading = seasonsLoading || standings.loading
  const error = seasonsError ?? standings.error

  return (
    <>
      <AdminPageHeader
        title="Clasificación"
        description="Actualízala cada semana después de la jornada: cambia los números de cada equipo y guarda. La web muestra la de la temporada activa."
        actions={picker}
      />
      <ActionError message={actionError} />

      <div className="mb-4 flex flex-col gap-3">
        <Notice>
          Al cambiar <b>G</b>, <b>E</b> o <b>P</b> se recalculan solos los partidos jugados, los restantes (<b>PR</b>) y los puntos.
          Usa <b>Ordenar por puntos</b> (puntos, diferencia de goles y goles a favor) y las flechas para deshacer empates como la liga.
        </Notice>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={sortTable} disabled={rows.length < 2} className="h-11 flex-1 sm:h-9 sm:flex-none">
            <ListOrdered className="mr-1 size-4" aria-hidden /> Ordenar por puntos
          </Button>
          <Button type="button" variant="outline" onClick={addTeam} disabled={!ready} className="h-11 flex-1 sm:h-9 sm:flex-none">
            <Plus className="mr-1 size-4" aria-hidden /> Añadir equipo
          </Button>
          {updatedAt && (
            <span className="w-full text-xs text-muted-foreground sm:ml-auto sm:w-auto">
              Última actualización: {formatShortDate(updatedAt)} · {formatTime(updatedAt)}
            </span>
          )}
        </div>
      </div>

      <datalist id="standings-teams">
        {(suggestions.data?.teams ?? []).map((t) => <option key={t} value={t} />)}
      </datalist>

      <section className="panel">
        {loading ? (
          <Skeletons rows={8} />
        ) : error ? (
          <ErrorState onRetry={standings.reload} description={error.message} />
        ) : rows.length === 0 ? (
          <EmptyState title={`Sin clasificación en ${season ?? 'esta temporada'}`} description="Pulsa «Añadir equipo» para empezar a cargarla." />
        ) : (
          <ol className="divide-y divide-border">
            {rows.map((r, i) => {
              const saved = original[i]
              const modified = !saved || JSON.stringify(strip(r)) !== JSON.stringify(saved)
              const dg = r.goalsFor - r.goalsAgainst
              return (
                <li key={r.key} className={cn('flex flex-col gap-3 px-3 py-3 sm:px-5 xl:flex-row xl:items-center', r.team.trim() === CLUB && 'bg-teamOrange/10')}>
                  <div className="flex min-w-0 items-center gap-2 xl:w-80 xl:shrink-0">
                    <span className="w-7 shrink-0 text-center font-display text-2xl text-white">{i + 1}</span>
                    <TeamCrest name={r.team.trim()} className="size-8 shrink-0" />
                    <Input
                      aria-label={`Equipo en la posición ${i + 1}`}
                      list="standings-teams"
                      value={r.team}
                      placeholder="Nombre del equipo"
                      onChange={(e) => edit(r.key, (x) => ({ ...x, team: e.target.value }))}
                      className="min-w-0 flex-1"
                    />
                    {modified && <span className="hidden sm:inline"><Badge>{saved ? 'Modificado' : 'Nuevo'}</Badge></span>}
                  </div>

                  <div className="grid grid-cols-4 items-end gap-2 sm:flex sm:flex-wrap sm:pl-9 xl:flex-1 xl:pl-0">
                    <div className="flex flex-col items-center gap-1 sm:w-12" title="Partidos jugados">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PJ</span>
                      <span className="flex h-11 items-center font-display text-xl tabular-nums text-white sm:h-10">{r.played}</span>
                    </div>
                    {FIELDS.map(({ key, label, title }) => (
                      <label key={key} className="flex flex-col items-center gap-1" title={title}>
                        <span className={cn('text-[10px] font-bold uppercase tracking-widest', key === 'points' ? 'text-teamOrange' : 'text-muted-foreground')}>{label}</span>
                        <NumberInput
                          aria-label={`${title} de ${r.team || 'equipo'}`}
                          value={r[key]}
                          onChange={(v) => edit(r.key, (x) =>
                            key === 'won' || key === 'drawn' || key === 'lost' ? setResult(x, key, v ?? 0) : { ...x, [key]: v ?? 0 })}
                          onFocus={(e) => e.target.select()}
                          className={cn('w-full sm:w-14', key === 'points' && 'border-teamOrange/60 font-bold')}
                        />
                      </label>
                    ))}
                    <div className="flex flex-col items-center gap-1 sm:w-12" title="Diferencia de goles">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">DG</span>
                      <span className={cn('flex h-11 items-center font-display text-xl tabular-nums sm:h-10', dg > 0 ? 'text-emerald-300' : dg < 0 ? 'text-red-300' : 'text-white')}>
                        {dg > 0 ? `+${dg}` : dg}
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-1 sm:ml-auto">
                      <Button type="button" size="icon" variant="ghost" aria-label={`Subir ${r.team || 'equipo'}`} disabled={i === 0} onClick={() => move(i, -1)} className="size-11 sm:size-9">
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button type="button" size="icon" variant="ghost" aria-label={`Bajar ${r.team || 'equipo'}`} disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="size-11 sm:size-9">
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button" size="icon" variant="ghost" aria-label={`Quitar ${r.team || 'equipo'}`}
                        onClick={() => { setRows((list) => list.filter((x) => x.key !== r.key)); setSavedAt(undefined) }}
                        className="size-11 text-red-400 hover:bg-red-500/10 hover:text-red-300 sm:size-9"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>
      <SaveBar changes={changes} saving={saving} savedAt={savedAt} onSave={() => void onSave()} onDiscard={reset} saveLabel="Guardar clasificación" />
    </>
  )
}
