import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { matchPlayerInfo } from '../../types'
import { byPosition } from './actaUtils'

const Cell = ({ n, className }: { n: number; className?: string }) => (
  <td className={cn('px-1 py-2.5 text-center tabular-nums sm:px-3', n > 0 ? 'font-bold text-white' : 'text-white/25', className)}>{n}</td>
)

function Group({ title, players }: { title: string; players: matchPlayerInfo[] }) {
  if (players.length === 0) return null
  return (
    <>
      <tr className="bg-black/50">
        <th colSpan={6} className="px-3 py-1.5 text-left text-[10px] font-extrabold uppercase tracking-[0.25em] text-teamOrange">{title}</th>
      </tr>
      {players.map((p) => (
        <tr key={p.Jugador} className={cn('border-t border-border', p.MVP && 'bg-teamOrange/10')}>
          <td className="w-9 px-2 py-2.5 text-center font-display text-lg text-teamOrange sm:w-12">{p.Dorsal > 0 ? p.Dorsal : '–'}</td>
          <td className="max-w-0 px-1 py-2 sm:px-3">
            <span className="flex items-center gap-1.5 font-semibold leading-tight text-white">
              <span className="truncate">{p.Jugador}</span>
              {p.MVP && <Star className="size-3.5 shrink-0 fill-teamOrange text-teamOrange" aria-label="MVP" />}
            </span>
            <span className="block truncate text-[10px] uppercase tracking-wider text-muted-foreground">{p.Posición || 'Sin posición'}</span>
          </td>
          <Cell n={p.Goles} />
          <Cell n={p.Asistencias} />
          <Cell n={p.Amarillas} />
          <Cell n={p.Rojas} />
        </tr>
      ))}
    </>
  )
}

/** Estadísticas de todos los jugadores del partido */
export function StatsTable({ starters, bench }: { starters: matchPlayerInfo[]; bench: matchPlayerInfo[] }) {
  return (
    <div className="panel overflow-hidden">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-black font-display text-xs uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="w-9 px-2 py-3 sm:w-12">#</th>
            <th className="px-1 py-3 text-left sm:px-3">Jugador</th>
            <th className="w-9 px-1 py-3 sm:w-16" title="Goles">G</th>
            <th className="w-9 px-1 py-3 sm:w-16" title="Asistencias">A</th>
            <th className="w-9 px-1 py-3 sm:w-16"><span className="inline-block h-3.5 w-2.5 rounded-[2px] bg-yellow-400 align-middle" title="Amarillas" /></th>
            <th className="w-9 px-1 py-3 sm:w-16"><span className="inline-block h-3.5 w-2.5 rounded-[2px] bg-red-600 align-middle" title="Rojas" /></th>
          </tr>
        </thead>
        <tbody>
          <Group title="Titulares" players={[...starters].sort(byPosition)} />
          <Group title="Suplentes" players={[...bench].sort(byPosition)} />
        </tbody>
      </table>
    </div>
  )
}
