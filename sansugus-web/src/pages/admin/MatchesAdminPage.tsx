import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Pencil, Plus, Trash2, X } from 'lucide-react'
import { deleteMatch, fetchSeasonMatches, fetchSuggestions, saveMatch, type MatchInput, type MatchRecord } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { Button } from '@/components/ui/button'
import { ActionError, Badge, Checkbox, EmptyState, ErrorState, Field, Input, NumberInput, Skeletons, Stepper } from '@/components/admin/ui'
import { cn } from '@/lib/utils'
import { AdminPageHeader } from './AdminLayout'
import { errorText, formatShortDate, formatTime, isoToMadridInput, madridInputToIso, useAdminSeason, useConfirmLeave, useLockBodyScroll, useUnsavedChanges } from './adminUtils'

const TEAM = 'Sansugus FC'

const EMPTY: MatchInput = {
  home: TEAM, away: '', date: null, homeGoals: null, awayGoals: null, homePens: null, awayPens: null,
  field: null, competition: 'Torneo Apertura', round: '', played: false,
}

const toInput = (m: MatchRecord): MatchInput => ({
  home: m.home, away: m.away, date: m.date, homeGoals: m.homeGoals, awayGoals: m.awayGoals, homePens: m.homePens, awayPens: m.awayPens,
  field: m.field, competition: m.competition, round: m.round, played: m.played,
})

/** Representación comparable del formulario para saber si hay cambios */
const snapshot = (f: MatchInput) => JSON.stringify({ ...f, home: f.home.trim(), away: f.away.trim(), round: f.round.trim(), competition: f.competition.trim() })

function MatchEditor({ seasonId, match, suggestions, onSaved, onCancel }: {
  seasonId: number
  match: MatchRecord | null
  suggestions: { teams: string[]; competitions: string[] }
  onSaved: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<MatchInput>(match ? toInput(match) : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [initial] = useState(() => snapshot(match ? toInput(match) : EMPTY))

  const dirty = snapshot(form) !== initial
  useUnsavedChanges(dirty)
  const cancel = () => {
    if (!dirty || window.confirm('Hay cambios sin guardar en el partido. ¿Cerrar sin guardarlos?')) onCancel()
  }
  const set = <K extends keyof MatchInput>(key: K, value: MatchInput[K]) => setForm((f) => ({ ...f, [key]: value }))
  // En móvil el editor ocupa toda la pantalla: la página de debajo no debe desplazarse
  useLockBodyScroll()

  const rest = form.away.trim() === 'Descansa' || form.home.trim() === 'Descansa'
  const tied = form.played && form.homeGoals != null && form.homeGoals === form.awayGoals

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.home.trim() || !form.away.trim()) return setError('Indica el equipo local y el visitante.')
    if (!form.competition.trim() || !form.round.trim()) return setError('Indica la competición y la jornada.')
    if (form.played && (form.homeGoals == null || form.awayGoals == null)) return setError('Indica el resultado o desmarca «Jugado».')
    setSaving(true)
    setError(undefined)
    try {
      await saveMatch(seasonId, form, match?.id)
      onSaved()
    } catch (err) {
      setError(errorText(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section role="dialog" aria-modal="true" aria-labelledby="match-editor-title"
      className="fixed inset-0 z-50 flex flex-col bg-background lg:static lg:z-auto lg:mb-6 lg:block lg:rounded-sm lg:border lg:border-t-[3px] lg:border-border lg:border-t-teamOrange lg:bg-card">
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-black px-4 py-3 lg:bg-transparent lg:px-5 lg:py-4">
          <h2 id="match-editor-title" className="font-display text-2xl text-white">{match ? 'Editar partido' : 'Nuevo partido'}</h2>
          <div className="flex items-center gap-2">
            {dirty && <Badge tone="orange">Sin guardar</Badge>}
            <Button type="button" variant="ghost" size="icon" aria-label="Cerrar editor" className="size-11 lg:size-10" onClick={cancel}><X className="size-5" /></Button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 lg:overflow-visible lg:p-5">
          <ActionError message={error} />
          <datalist id="teams">{suggestions.teams.map((t) => <option key={t} value={t} />)}</datalist>
          <datalist id="competitions">{suggestions.competitions.map((t) => <option key={t} value={t} />)}</datalist>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Local" htmlFor="m-home"><Input id="m-home" list="teams" value={form.home} onChange={(e) => set('home', e.target.value)} /></Field>
            <Field label="Visitante" htmlFor="m-away" hint="Escribe «Descansa» para una jornada de descanso."><Input id="m-away" list="teams" value={form.away} onChange={(e) => set('away', e.target.value)} /></Field>
            <Field label="Fecha y hora (hora de España)" htmlFor="m-date">
              <Input id="m-date" type="datetime-local" disabled={rest} value={isoToMadridInput(form.date)} onChange={(e) => set('date', madridInputToIso(e.target.value))} />
            </Field>
            <Field label="Campo" htmlFor="m-field"><NumberInput id="m-field" allowEmpty disabled={rest} value={form.field} onChange={(v) => set('field', v)} className="w-full sm:w-24" /></Field>
            <Field label="Competición" htmlFor="m-comp"><Input id="m-comp" list="competitions" value={form.competition} onChange={(e) => set('competition', e.target.value)} /></Field>
            <Field label="Jornada / ronda" htmlFor="m-round"><Input id="m-round" value={form.round} onChange={(e) => set('round', e.target.value)} placeholder="Jornada 1, Semifinal…" /></Field>
          </div>

          <div className="flex flex-col gap-4 rounded-sm border border-border bg-black/30 p-4">
            <Checkbox
              label="Partido jugado"
              checked={form.played}
              disabled={rest}
              onChange={(e) => setForm((f) => ({ ...f, played: e.target.checked, homeGoals: f.homeGoals ?? 0, awayGoals: f.awayGoals ?? 0 }))}
              className="font-semibold"
            />
            {form.played && (
              <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                <Stepper label={form.home.trim() || 'Local'} ariaLabel="goles del local" value={form.homeGoals ?? 0} onChange={(v) => set('homeGoals', v)} />
                <Stepper label={form.away.trim() || 'Visitante'} ariaLabel="goles del visitante" value={form.awayGoals ?? 0} onChange={(v) => set('awayGoals', v)} />
              </div>
            )}
            {tied && (
              <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                <Field label="Penaltis local" htmlFor="m-hp" hint="Solo si hubo tanda"><NumberInput id="m-hp" value={form.homePens} allowEmpty onChange={(v) => set('homePens', v)} className="w-full" /></Field>
                <Field label="Penaltis visitante" htmlFor="m-ap"><NumberInput id="m-ap" value={form.awayPens} allowEmpty onChange={(v) => set('awayPens', v)} className="w-full" /></Field>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Los goleadores, asistencias, tarjetas y el MVP se añaden en el <strong>acta</strong> del partido (botón «Acta» de la lista), una vez guardado.</p>
        </div>
        <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-border bg-black p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:flex lg:justify-end lg:bg-transparent lg:px-5 lg:py-4">
          <Button type="button" variant="ghost" className="h-11 lg:h-10" onClick={cancel}>Cancelar</Button>
          <Button type="submit" disabled={saving || !dirty} className="h-11 bg-teamOrange text-black hover:bg-teamOrange-light lg:h-10">{saving ? 'Guardando…' : 'Guardar partido'}</Button>
        </footer>
      </form>
    </section>
  )
}

export default function MatchesAdminPage() {
  const { seasonId, season, picker, loading: seasonsLoading, error: seasonsError } = useAdminSeason()
  const ready = seasonId != null
  const matches = useAsync(() => fetchSeasonMatches(seasonId!), [seasonId], ready)
  const suggestions = useAsync(fetchSuggestions, [])
  const [editing, setEditingRaw] = useState<MatchRecord | 'new' | null>(null)
  const confirmLeave = useConfirmLeave()
  const setEditing = (next: MatchRecord | 'new' | null) => {
    if (next !== null && editing !== null && !confirmLeave()) return
    setEditingRaw(next)
  }
  const [actionError, setActionError] = useState<string>()

  useEffect(() => setEditingRaw(null), [seasonId])

  const list = matches.data ?? []

  const onDelete = async (m: MatchRecord) => {
    if (!window.confirm(`¿Borrar ${m.home} - ${m.away}? También se borrará su acta y se recalcularán las estadísticas.`)) return
    setActionError(undefined)
    try {
      await deleteMatch(m.id)
      matches.reload()
    } catch (err) {
      setActionError(errorText(err, 'No se pudo borrar'))
    }
  }

  const error = seasonsError ?? matches.error
  return (
    <>
      <AdminPageHeader
        title="Partidos"
        description="Calendario y resultados de la temporada. Desde cada partido jugado accedes a su acta."
        actions={
          <>
            {picker}
            <Button onClick={() => setEditing('new')} disabled={!ready} className="bg-teamOrange text-black hover:bg-teamOrange-light"><Plus className="mr-1 size-4" aria-hidden /> Nuevo partido</Button>
          </>
        }
      />
      <ActionError message={actionError} />
      {editing && seasonId != null && (
        <MatchEditor
          key={editing === 'new' ? 'new' : editing.id}
          seasonId={seasonId}
          match={editing === 'new' ? null : editing}
          suggestions={suggestions.data ?? { teams: [], competitions: [] }}
          onCancel={() => setEditingRaw(null)}
          onSaved={() => {
            setEditingRaw(null)
            matches.reload()
            suggestions.reload()
          }}
        />
      )}
      <section className="panel">
        {seasonsLoading || matches.loading ? (
          <Skeletons />
        ) : error ? (
          <ErrorState onRetry={matches.reload} description={error.message} />
        ) : list.length === 0 ? (
          <EmptyState title="No hay partidos" description={`Añade el primer partido de la temporada ${season ?? ''}.`} />
        ) : (
          <ul className="divide-y divide-border">
            {list.map((m) => {
              const rest = m.home === 'Descansa' || m.away === 'Descansa'
              const pens = m.homePens != null || m.awayPens != null
              const line = (team: string, goals: number | null, pen: number | null, other: number | null) => {
                const won = m.played && goals != null && other != null && goals > other
                return (
                  <p className="flex items-center justify-between gap-3">
                    <span className={cn('min-w-0 truncate font-display text-lg leading-tight', team === TEAM ? 'text-white' : 'text-white/80')}>{team}</span>
                    {m.played && !rest && (
                      <span className={cn('shrink-0 font-display text-2xl leading-none tabular-nums', won ? 'text-teamOrange' : 'text-white')}>
                        {goals}{pens && <span className="ml-1 text-sm text-muted-foreground">({pen})</span>}
                      </span>
                    )}
                  </p>
                )
              }
              return (
                <li key={m.id} className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:gap-6 lg:px-5 lg:py-3">
                  <div className="flex items-start justify-between gap-3 lg:w-44 lg:shrink-0 lg:flex-col lg:gap-1">
                    <div className="text-sm text-muted-foreground">
                      {m.date ? (
                        <span className="font-semibold text-white">{formatShortDate(m.date)} <span className="font-normal text-muted-foreground">· {formatTime(m.date)}</span></span>
                      ) : 'Sin fecha'}
                      <span className="block text-xs">{m.competition} · {m.round}</span>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1.5 lg:justify-start">
                      <Badge tone={m.played ? 'win' : 'soft'}>{rest ? 'Descanso' : m.played ? 'Jugado' : 'Pendiente'}</Badge>
                      {m.played && !rest && <Badge tone={m.hasActa ? 'orange' : 'soft'}>{m.hasActa ? 'Con acta' : 'Sin acta'}</Badge>}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-sm border border-border bg-black/30 px-3 py-2 lg:max-w-md lg:border-0 lg:bg-transparent lg:p-0">
                    {line(m.home, m.homeGoals, m.homePens, m.awayGoals)}
                    {line(m.away, m.awayGoals, m.awayPens, m.homeGoals)}
                  </div>
                  <div className="flex items-center gap-2 lg:gap-1">
                    {m.played && !rest && (
                      <Link to={`/admin/partidos/${m.id}/acta`} onClick={(e) => { if (!confirmLeave()) e.preventDefault() }}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-teamOrange/60 px-3 text-xs font-extrabold uppercase tracking-widest text-teamOrange hover:bg-teamOrange/10 lg:h-9 lg:flex-none lg:border-0">
                        <ClipboardList className="size-4" aria-hidden /> {m.hasActa ? 'Ver acta' : 'Rellenar acta'}
                      </Link>
                    )}
                    <Button variant="ghost" size="icon" aria-label={`Editar ${m.home} - ${m.away}`} className="size-11 border border-border lg:size-10 lg:border-0" onClick={() => setEditing(m)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Borrar ${m.home} - ${m.away}`} className="size-11 border border-border text-red-400 hover:bg-red-500/10 hover:text-red-300 lg:size-10 lg:border-0" onClick={() => void onDelete(m)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
