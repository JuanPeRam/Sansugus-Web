import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight, ClipboardList, ListOrdered, Users } from 'lucide-react'
import { fetchDashboard } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { Badge, ErrorState, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { formatShortDate, formatTime, useAdminSeason } from './adminUtils'

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="panel panel-accent p-4 md:p-5">
      <p className="font-display text-4xl text-white md:text-5xl">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { seasonId, season, active, picker, loading: seasonsLoading, error: seasonsError } = useAdminSeason()
  const ready = seasonId != null
  const dash = useAsync(() => fetchDashboard(seasonId!), [seasonId], ready)

  const data = dash.data
  const played = data?.matches.filter((m) => m.played && m.away !== 'Descansa' && m.home !== 'Descansa') ?? []
  const pending = data?.usesActas ? played.filter((m) => !m.hasActa) : []
  const upcoming = (data?.matches ?? []).filter((m) => !m.played && m.date && new Date(m.date) >= new Date()).slice(-3).reverse()
  const error = seasonsError ?? dash.error

  return (
    <>
      <AdminPageHeader
        title="Resumen"
        description={`Estado de la temporada ${season ?? ''}${active ? ' (la que muestra la web)' : ''}.`}
        actions={picker}
      />
      {seasonsLoading || dash.loading ? (
        <Skeletons rows={3} className="h-24" />
      ) : error ? (
        <div className="panel"><ErrorState description={error.message} onRetry={dash.reload} /></div>
      ) : data && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-4 lg:grid-cols-4">
            <Tile label="Partidos jugados" value={played.length} hint={`${data.matches.length} en el calendario`} />
            <Tile label="Jugadores en plantilla" value={data.rosterCount} />
            <Tile label="Goles del equipo" value={data.goals} />
            <Tile label="Asistencias" value={data.assists} />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 md:hidden">
            <Link to="/admin/partidos" className="flex h-12 items-center justify-center gap-2 rounded-sm bg-teamOrange text-sm font-extrabold uppercase tracking-widest text-black"><CalendarDays className="size-4" aria-hidden /> Partidos</Link>
            <Link to="/admin/plantilla" className="flex h-12 items-center justify-center gap-2 rounded-sm border border-white/30 text-sm font-extrabold uppercase tracking-widest text-white"><Users className="size-4" aria-hidden /> Plantilla</Link>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <section className="panel">
              <h2 className="section-title p-4 pb-3 text-xl md:p-5 md:pb-3 md:text-2xl"><ClipboardList className="size-5 text-teamOrange" aria-hidden /> Actas pendientes</h2>
              {!data.usesActas ? (
                <p className="px-5 pb-5 text-sm text-muted-foreground">Esta temporada usa estadísticas históricas: no lleva actas.</p>
              ) : pending.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-muted-foreground">Todos los partidos jugados tienen acta. 👌</p>
              ) : (
                <ul className="divide-y divide-border">
                  {pending.map((m) => (
                    <li key={m.id}>
                      <Link to={`/admin/partidos/${m.id}/acta`} className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 transition hover:bg-white/5 md:px-5">
                        <span className="min-w-0">
                          <span className="block truncate font-display text-lg leading-tight text-white">{m.home} <span className="text-teamOrange">{m.homeGoals}-{m.awayGoals}</span> {m.away}</span>
                          <span className="text-xs font-extrabold uppercase tracking-widest text-teamOrange">Rellenar acta</span>
                        </span>
                        <ChevronRight className="size-5 shrink-0 text-teamOrange" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel">
              <h2 className="section-title p-4 pb-3 text-xl md:p-5 md:pb-3 md:text-2xl"><CalendarDays className="size-5 text-teamOrange" aria-hidden /> Próximos partidos</h2>
              {upcoming.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-muted-foreground">No hay partidos futuros en el calendario. Añádelos desde Partidos.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {upcoming.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
                      <span className="min-w-0 font-display text-lg leading-tight text-white">{m.home} <span className="text-muted-foreground">vs</span> {m.away}</span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        <Badge>{m.date ? formatShortDate(m.date) : 'Sin fecha'}</Badge>
                        {m.date && <span className="text-xs text-muted-foreground">{formatTime(m.date)}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="mt-8 hidden flex-wrap gap-3 md:flex">
            <Link to="/admin/partidos" className="btn-club">Gestionar partidos</Link>
            <Link to="/admin/clasificacion" className="btn-ghost"><ListOrdered className="size-4" aria-hidden /> Actualizar clasificación</Link>
            <Link to="/admin/plantilla" className="btn-ghost"><Users className="size-4" aria-hidden /> Plantilla</Link>
          </div>
        </>
      )}
    </>
  )
}
