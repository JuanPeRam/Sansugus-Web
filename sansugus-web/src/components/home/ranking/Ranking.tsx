import { useEffect, useState } from 'react'
import { fetchStandings, type Standing } from '@/data/api'
import { TeamCrest } from '@/components/TeamCrest'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const CLUB = 'Sansugus FC'

const updatedFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' })

/** Columnas numéricas; las marcadas como `wide` solo se ven en pantallas anchas */
const COLUMNS: { label: string, title: string, value: (s: Standing) => number | string, wide?: boolean }[] = [
  { label: 'PJ', title: 'Partidos jugados', value: (s) => s.played },
  { label: 'PR', title: 'Partidos restantes', value: (s) => s.remaining, wide: true },
  { label: 'G', title: 'Ganados', value: (s) => s.won },
  { label: 'E', title: 'Empatados', value: (s) => s.drawn },
  { label: 'P', title: 'Perdidos', value: (s) => s.lost },
  { label: 'GF', title: 'Goles a favor', value: (s) => s.goalsFor, wide: true },
  { label: 'GC', title: 'Goles en contra', value: (s) => s.goalsAgainst, wide: true },
  { label: 'DG', title: 'Diferencia de goles', value: (s) => { const d = s.goalsFor - s.goalsAgainst; return d > 0 ? `+${d}` : d } },
]

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

  return (
    <div className='panel overflow-x-auto'>
      <table className='w-full border-collapse text-sm md:text-base'>
        <thead className='bg-black font-display text-xs uppercase tracking-widest text-muted-foreground md:text-sm [&_th]:px-1 [&_th]:py-3 sm:[&_th]:px-2'>
          <tr>
            <th className='w-8 sm:w-10'>Pos</th>
            <th className='text-left'>Equipo</th>
            {COLUMNS.map((c) => <th key={c.label} title={c.title} className={cn(c.wide && 'hidden md:table-cell')}>{c.label}</th>)}
            <th title='Puntos'>Pts</th>
          </tr>
        </thead>
        <tbody className='[&_td]:px-1 [&_td]:py-2.5 sm:[&_td]:px-2 [&_td]:text-center [&_tr]:border-t [&_tr]:border-border'>
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <tr key={i}><td colSpan={COLUMNS.length + 3}><Skeleton className='h-5 w-full' /></td></tr>
          ))}
          {!loading && error && <tr><td colSpan={COLUMNS.length + 3} className='py-8 text-muted-foreground'>No se ha podido cargar la clasificación</td></tr>}
          {!loading && !error && rows.length === 0 && (
            <tr><td colSpan={COLUMNS.length + 3} className='py-8 text-muted-foreground'>Clasificación no disponible todavía</td></tr>
          )}
          {!loading && rows.map((s) => {
            const club = s.team === CLUB
            return (
              <tr key={s.team} className={club ? 'bg-teamOrange/10 font-bold text-teamOrange' : 'hover:bg-white/5'}>
                <td className='font-display text-lg'>{s.position}</td>
                <td className='!text-left'>
                  <span className='flex min-w-[7rem] items-center gap-2'>
                    <TeamCrest name={s.team} className='h-7 w-7 shrink-0 text-[10px]' />
                    <span className='truncate'>{s.team}</span>
                  </span>
                </td>
                {COLUMNS.map((c) => <td key={c.label} className={cn('tabular-nums', c.wide && 'hidden md:table-cell')}>{c.value(s)}</td>)}
                <td className={cn('tabular-nums', club ? 'bg-teamOrange font-extrabold text-black' : 'font-bold text-white')}>{s.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {updatedAt && rows.length > 0 && (
        <p className='border-t border-border px-4 py-3 text-right text-xs text-muted-foreground'>Actualizada el {updatedFormat.format(updatedAt)}</p>
      )}
    </div>
  )
}
