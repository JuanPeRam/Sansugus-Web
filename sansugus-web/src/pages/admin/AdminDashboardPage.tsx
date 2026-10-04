import { Link } from 'react-router-dom'
import { CalendarDays, ClipboardList, Users } from 'lucide-react'
import { fetchDashboard } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { Badge, ErrorState, Skeletons } from '@/components/admin/ui'
import { AdminPageHeader } from './AdminLayout'
import { formatShortDate, useAdminSeason } from './adminUtils'

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="panel panel-accent p-5">
      <p className="font-display text-5xl text-white">{value}</p>
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
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile label="Partidos jugados" value={played.length} hint={`${data.matches.length} en el calendario`} />
            <Tile label="Jugadores en plantilla" value={data.rosterCount} />
            <Tile label="Goles del equipo" value={data.goals} />
            <Tile label="Asistencias" value={data.assists} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="panel">
              <h2 className="section-title p-5 pb-3 text-2xl"><ClipboardList className="size-5 text-teamOrange" aria-hidden /> Actas pendientes</h2>
              {!data.usesActas ? (
                <p className="px-5 pb-5 text-sm text-muted-foreground">Esta temporada usa estadísticas históricas: no lleva actas.</p>
              ) : pending.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-muted-foreground">Todos los partidos jugados tienen acta. 👌</p>
              ) : (
                <ul className="divide-y divide-border">
                  {pending.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <span className="min-w-0 truncate font-display text-lg text-white">{m.home} <span className="text-muted-foreground">{m.homeGoals}-{m.awayGoals}</span> {m.away}</span>
                      <Link to={`/admin/partidos/${m.id}/acta`} className="shrink-0 text-xs font-extrabold uppercase tracking-widest text-teamOrange hover:underline">Rellenar acta →</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel">
              <h2 className="section-title p-5 pb-3 text-2xl"><CalendarDays className="size-5 text-teamOrange" aria-hidden /> Próximos partidos</h2>
              {upcoming.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-muted-foreground">No hay partidos futuros en el calendario. Añádelos desde Partidos.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {upcoming.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <span className="font-display text-lg text-white">{m.home} <span className="text-muted-foreground">vs</span> {m.away}</span>
                      <Badge>{m.date ? formatShortDate(m.date) : 'Sin fecha'}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admin/partidos" className="btn-club">Gestionar partidos</Link>
            <Link to="/admin/plantilla" className="btn-ghost"><Users className="size-4" aria-hidden /> Plantilla</Link>
          </div>
        </>
      )}
    </>
  )
}
