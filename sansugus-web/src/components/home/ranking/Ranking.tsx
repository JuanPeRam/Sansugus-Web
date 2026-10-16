import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fetchStandings, type Standing } from '@/data/api'
import { TeamCrest } from '@/components/TeamCrest'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const CLUB = 'Sansugus FC'
const TOP = 5

const updatedFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' })

/** Columnas numéricas; las marcadas como `wide` solo se ven en pantallas anchas */
const COLUMNS: { label: string, title: string, value: (s: Standing) => number | string, wide?: boolean }[] = [
  { label: 'PJ', title: 'Partidos jugados', value: (s) => s.played },
  { label: 'G', title: 'Ganados', value: (s) => s.won, wide: true },
  { label: 'E', title: 'Empatados', value: (s) => s.drawn, wide: true },
  { label: 'P', title: 'Perdidos', value: (s) => s.lost, wide: true },
  { label: 'DG', title: 'Diferencia de goles', value: (s) => { const d = s.goalsFor - s.goalsAgainst; return d > 0 ? `+${d}` : d } },
]

function Row({ s }: { s: Standing }) {
  const club = s.team === CLUB
  return (
    <tr className={club ? 'bg-teamOrange/10 font-bold text-teamOrange' : 'hover:bg-white/5'}>
      <td className={cn('relative font-display text-lg', club && 'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-teamOrange')}>{s.position}</td>
      <td className='!text-left'>
        <span className='flex min-w-[7rem] items-center gap-2'>
          <TeamCrest name={s.team} className='h-7 w-7 shrink-0 text-[10px]' />
          <span className='truncate'>{s.team}</span>
        </span>
      </td>
      {COLUMNS.map((c) => <td key={c.label} className={cn('tabular-nums', c.wide && 'hidden md:table-cell')}>{c.value(s)}</td>)}
      <td className={cn('font-display text-lg tabular-nums', club ? 'bg-teamOrange text-black' : 'text-white')}>{s.points}</td>
    </tr>
  )
}

/** Resumen de la clasificación en Inicio: los 5 primeros (y Sansugus si va por detrás) */
export function Ranking() {
  const [rows, setRows] = useState<Standing[]>([])
  const [updatedAt, setUpdatedAt] = useState<Date>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchStandings()
      .then((d) => { setRows(d.rows); setUpdatedAt(d.updatedAt) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const top = rows.slice(0, TOP)
  const club = rows.find((s) => s.team === CLUB)
  const clubBelow = club && club.position > TOP ? club : undefined
  const span = COLUMNS.length + 3

  return (
    <div className='panel overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-sm md:text-base'>
          <thead className='bg-black font-display text-xs uppercase tracking-widest text-muted-foreground md:text-sm [&_th]:px-1 [&_th]:py-3 sm:[&_th]:px-3'>
            <tr>
              <th className='w-10 sm:w-14'>Pos</th>
              <th className='text-left'>Equipo</th>
              {COLUMNS.map((c) => <th key={c.label} title={c.title} className={cn(c.wide && 'hidden md:table-cell')}>{c.label}</th>)}
              <th title='Puntos'>Pts</th>
            </tr>
          </thead>
          <tbody className='[&_td]:px-1 [&_td]:py-2.5 [&_td]:text-center sm:[&_td]:px-3 [&_tr]:border-t [&_tr]:border-border'>
            {loading && Array.from({ length: TOP }).map((_, i) => (
              <tr key={i}><td colSpan={span}><Skeleton className='h-5 w-full' /></td></tr>
            ))}
            {!loading && error && <tr><td colSpan={span} className='py-8 text-muted-foreground'>No se ha podido cargar la clasificación</td></tr>}
            {!loading && !error && rows.length === 0 && (
              <tr><td colSpan={span} className='py-8 text-muted-foreground'>Clasificación no disponible todavía</td></tr>
            )}
            {!loading && top.map((s) => <Row key={s.team} s={s} />)}
            {!loading && clubBelow && (
              <>
                <tr aria-hidden><td colSpan={span} className='!py-1 text-muted-foreground'>···</td></tr>
                <Row s={clubBelow} />
              </>
            )}
          </tbody>
        </table>
      </div>
      {!loading && rows.length > 0 && (
        <div className='flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-xs text-muted-foreground'>
            {rows.length} equipos{updatedAt ? ` · actualizada el ${updatedFormat.format(updatedAt)}` : ''}
          </span>
          <Link to='/Standings' className='group inline-flex items-center justify-center gap-2 font-display text-base uppercase tracking-wider text-teamOrange transition hover:text-white'>
            Ver clasificación completa
            <ArrowRight className='size-4 transition group-hover:translate-x-1' aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}
