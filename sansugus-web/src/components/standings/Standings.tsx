import { useEffect, useState } from 'react'
import { fetchStandings, type Standing } from '@/data/api'
import { TeamCrest } from '@/components/TeamCrest'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const CLUB = 'Sansugus FC'

const updatedFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' })
const diff = (s: Standing) => s.goalsFor - s.goalsAgainst
const signed = (n: number) => (n > 0 ? `+${n}` : String(n))
const pts = (n: number) => `${n} ${n === 1 ? 'punto' : 'puntos'}`

/** Mejor equipo según un criterio (a igualdad, el mejor clasificado) */
function best(rows: Standing[], score: (s: Standing) => number) {
  return rows.reduce<Standing | undefined>((top, s) => (!top || score(s) > score(top) ? s : top), undefined)
}

export default function Standings() {
  const [rows, setRows] = useState<Standing[]>([])
  const [updatedAt, setUpdatedAt] = useState<Date>()
  const [season, setSeason] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchStandings()
      .then((d) => { setRows(d.rows); setUpdatedAt(d.updatedAt); setSeason(d.season) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const played = rows.filter((s) => s.played > 0)
  const leader = rows[0]
  const club = rows.find((s) => s.team === CLUB)
  const round = Math.max(0, ...rows.map((s) => s.played))
  const attack = best(played, (s) => s.goalsFor)
  const defense = best(played, (s) => -s.goalsAgainst)

  return (
    <>
      <header className='page-hero'>
        <div className='page-hero-inner'>
          <span className='eyebrow'>Liga{season ? ` · Temporada ${season}` : ''}</span>
          <h1 className='page-title'>Clasifi<em>cación</em></h1>
          <p className='mt-4 max-w-xl text-white/60'>
            {round > 0 ? `Así está la tabla tras la jornada ${round}.` : 'La tabla de la liga, jornada a jornada.'}
            {updatedAt && <span className='text-white/40'> Actualizada el {updatedFormat.format(updatedAt)}.</span>}
          </p>
        </div>
      </header>

      <div className='page-container flex flex-col gap-6 md:gap-10'>
        {loading ? (
          <>
            <Skeleton className='h-48 w-full' />
            <Skeleton className='h-[28rem] w-full' />
          </>
        ) : error ? (
          <p className='panel py-14 text-center text-muted-foreground'>No se ha podido cargar la clasificación.</p>
        ) : rows.length === 0 ? (
          <p className='panel py-14 text-center text-muted-foreground'>La clasificación aún no está disponible.</p>
        ) : (
          <>
            {club && <ClubCard club={club} rows={rows} />}

            <section className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
              <Highlight label='Líder' team={leader} value={pts(leader.points)} />
              {attack && <Highlight label='Mejor ataque' team={attack} value={`${attack.goalsFor} goles a favor`} />}
              {defense && <Highlight label='Mejor defensa' team={defense} value={`${defense.goalsAgainst} goles en contra`} />}
              <div className='panel flex flex-col justify-between gap-3 p-4 md:p-5'>
                <span className='text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>Jornada</span>
                <p className='font-display text-4xl leading-none text-white md:text-5xl'>
                  {round}<span className='text-xl text-white/40 md:text-2xl'> / {Math.max(0, ...rows.map((s) => s.played + s.remaining))}</span>
                </p>
                <span className='text-xs text-white/50'>{rows.length} equipos</span>
              </div>
            </section>

            <StandingsTable rows={rows} />
          </>
        )}
      </div>
    </>
  )
}

/** Tarjeta destacada del Sansugus: posición, puntos y distancias */
function ClubCard({ club, rows }: { club: Standing; rows: Standing[] }) {
  const leader = rows[0]
  const above = rows[club.position - 2]
  const maxPoints = club.points + club.remaining * 3
  const facts = [
    { label: 'Jugados', value: club.played },
    { label: 'Balance', value: `${club.won}-${club.drawn}-${club.lost}`, hint: 'G-E-P' },
    { label: 'Goles', value: `${club.goalsFor}:${club.goalsAgainst}`, hint: `DG ${signed(diff(club))}` },
    { label: 'Por jugar', value: club.remaining, hint: `hasta ${maxPoints} pts` },
  ]
  return (
    <section className='panel panel-accent relative isolate overflow-hidden'>
      <div className='absolute inset-y-0 right-0 -z-10 hidden w-1/2 md:block'
        style={{ background: 'repeating-linear-gradient(115deg, rgba(227,127,12,.10) 0 14px, transparent 14px 40px)' }} />
      <div className='flex flex-col gap-6 p-5 md:flex-row md:items-center md:gap-10 md:p-8'>
        <div className='flex items-center gap-4 md:gap-6'>
          <div className='flex flex-col items-center'>
            <span className='font-display text-7xl leading-none text-teamOrange md:text-8xl'>{club.position}º</span>
            <span className='mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>de {rows.length}</span>
          </div>
          <TeamCrest name={club.team} className='h-16 w-16 md:h-20 md:w-20' />
          <div className='min-w-0'>
            <h2 className='font-display text-3xl leading-none text-white md:text-4xl'>{club.team}</h2>
            <p className='mt-2 text-sm text-white/60'>
              {club.position === 1
                ? 'Líder de la liga'
                : `A ${pts(leader.points - club.points)} del líder`}
              {above && club.position > 1 && above !== leader &&
                (above.points === club.points ? ` · empatado a puntos con el ${above.position}º` : ` · a ${pts(above.points - club.points)} del ${above.position}º`)}
            </p>
          </div>
        </div>

        <div className='grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4 md:ml-auto'>
          {facts.map((f) => (
            <div key={f.label} className='flex flex-col gap-1 bg-card px-4 py-3'>
              <span className='text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>{f.label}</span>
              <span className='font-display text-2xl tabular-nums text-white md:text-3xl'>{f.value}</span>
              {f.hint && <span className='text-xs text-white/40'>{f.hint}</span>}
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between gap-4 rounded-sm bg-teamOrange px-5 py-4 text-black md:flex-col md:justify-center md:px-7'>
          <span className='text-xs font-extrabold uppercase tracking-widest'>Puntos</span>
          <span className='font-display text-5xl leading-none md:text-6xl'>{club.points}</span>
        </div>
      </div>
    </section>
  )
}

function Highlight({ label, team, value }: { label: string; team: Standing; value: string }) {
  return (
    <div className='panel flex flex-col justify-between gap-3 p-4 md:p-5'>
      <span className='text-[11px] font-bold uppercase tracking-widest text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-3'>
        <TeamCrest name={team.team} className='h-10 w-10 shrink-0 text-xs' />
        <p className={cn('font-display text-lg leading-tight md:text-xl', team.team === CLUB ? 'text-teamOrange' : 'text-white')}>{team.team}</p>
      </div>
      <span className='text-xs text-white/50'>{value}</span>
    </div>
  )
}

const COLUMNS: { label: string; title: string; value: (s: Standing) => number | string; wide?: boolean }[] = [
  { label: 'PJ', title: 'Partidos jugados', value: (s) => s.played },
  { label: 'G', title: 'Ganados', value: (s) => s.won },
  { label: 'E', title: 'Empatados', value: (s) => s.drawn },
  { label: 'P', title: 'Perdidos', value: (s) => s.lost },
  { label: 'GF', title: 'Goles a favor', value: (s) => s.goalsFor, wide: true },
  { label: 'GC', title: 'Goles en contra', value: (s) => s.goalsAgainst, wide: true },
  { label: 'DG', title: 'Diferencia de goles', value: (s) => signed(diff(s)) },
]

function StandingsTable({ rows }: { rows: Standing[] }) {
  return (
    <section className='panel overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-sm md:text-base'>
          <thead className='bg-black font-display text-xs uppercase tracking-widest text-muted-foreground md:text-sm [&_th]:px-1 [&_th]:py-3 sm:[&_th]:px-3'>
            <tr>
              <th className='w-10 sm:w-14'>Pos</th>
              <th className='text-left'>Equipo</th>
              {COLUMNS.map((c) => <th key={c.label} title={c.title} className={cn(c.wide && 'hidden md:table-cell')}>{c.label}</th>)}
              <th title='Porcentaje de puntos conseguidos' className='hidden w-40 lg:table-cell'>Rendimiento</th>
              <th title='Puntos'>Pts</th>
            </tr>
          </thead>
          <tbody className='[&_td]:px-1 [&_td]:py-3 [&_td]:text-center sm:[&_td]:px-3 [&_tr]:border-t [&_tr]:border-border'>
            {rows.map((s) => {
              const club = s.team === CLUB
              const ratio = s.played ? s.points / (s.played * 3) : 0
              return (
                <tr key={s.team} className={cn('transition-colors', club ? 'bg-teamOrange/10 font-bold text-teamOrange' : 'hover:bg-white/5')}>
                  <td className={cn('relative font-display text-lg md:text-xl', club && 'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-teamOrange')}>{s.position}</td>
                  <td className='!text-left'>
                    <span className='flex min-w-[7rem] items-center gap-2 md:gap-3'>
                      <TeamCrest name={s.team} className='h-7 w-7 shrink-0 text-[10px] md:h-8 md:w-8' />
                      <span className='truncate'>{s.team}</span>
                    </span>
                  </td>
                  {COLUMNS.map((c) => <td key={c.label} className={cn('tabular-nums', c.wide && 'hidden md:table-cell', !club && c.label !== 'DG' && 'text-white/80')}>{c.value(s)}</td>)}
                  <td className='hidden lg:table-cell'>
                    <span className='flex items-center gap-2'>
                      <span className='h-1.5 flex-1 overflow-hidden rounded-full bg-white/10'>
                        <span className='block h-full rounded-full bg-teamOrange' style={{ width: `${Math.round(ratio * 100)}%` }} />
                      </span>
                      <span className='w-9 text-right text-xs tabular-nums text-white/50'>{Math.round(ratio * 100)}%</span>
                    </span>
                  </td>
                  <td className={cn('font-display text-lg tabular-nums md:text-xl', club ? 'bg-teamOrange text-black' : 'text-white')}>{s.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className='border-t border-border px-4 py-3 text-xs text-muted-foreground'>
        PJ jugados · G ganados · E empatados · P perdidos · GF/GC goles a favor y en contra · DG diferencia · Rendimiento: % de los puntos posibles
      </p>
    </section>
  )
}
