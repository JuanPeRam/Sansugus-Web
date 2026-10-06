import { cn } from '@/lib/utils'
import { matchPlayerInfo } from '../../types'

const Count = ({ n }: { n: number }) => (n > 1 ? <b className="ml-px text-[0.8em] font-extrabold">×{n}</b> : null)

export const GoalIcon = ({ n = 1 }: { n?: number }) => <span className="inline-flex items-center" title={`${n} gol${n > 1 ? 'es' : ''}`}>⚽<Count n={n} /></span>

export const AssistIcon = ({ n = 1 }: { n?: number }) => (
  <span className="inline-flex items-center gap-px" title={`${n} asistencia${n > 1 ? 's' : ''}`}>
    <span className="grid size-4 place-items-center rounded-full bg-white/15 text-[9px] font-extrabold text-white ring-1 ring-white/25">A</span>
    <Count n={n} />
  </span>
)

export const CardIcon = ({ color, n = 1 }: { color: 'yellow' | 'red'; n?: number }) => (
  <span className="inline-flex items-center" title={color === 'yellow' ? 'Tarjeta amarilla' : 'Tarjeta roja'}>
    <span className={cn('inline-block h-3.5 w-2.5 rounded-[2px] shadow-sm', color === 'yellow' ? 'bg-yellow-400' : 'bg-red-600')} />
    <Count n={n} />
  </span>
)

/** Eventos de un jugador en el partido (goles, asistencias y tarjetas) */
export function EventChips({ p, className }: { p: matchPlayerInfo; className?: string }) {
  if (!p.Goles && !p.Asistencias && !p.Amarillas && !p.Rojas) return null
  return (
    <span className={cn('inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] leading-none text-white', className)}>
      {p.Goles > 0 && <GoalIcon n={p.Goles} />}
      {p.Asistencias > 0 && <AssistIcon n={p.Asistencias} />}
      {p.Amarillas > 0 && <CardIcon color="yellow" n={p.Amarillas} />}
      {p.Rojas > 0 && <CardIcon color="red" n={p.Rojas} />}
    </span>
  )
}
