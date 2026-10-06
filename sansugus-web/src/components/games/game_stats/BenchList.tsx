import { Star } from 'lucide-react'
import { matchPlayerInfo } from '../../types'
import { PlayerShirt } from './PlayerShirt'
import { EventChips } from './EventChips'
import { shortName } from './actaUtils'

/** Suplentes del partido */
export function BenchList({ players }: { players: matchPlayerInfo[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {players.map((p) => (
        <li key={p.Jugador} className="panel flex items-center gap-3 p-3">
          <PlayerShirt player={p.Jugador} alias={shortName(p)} number={p.Dorsal} className="w-12 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate font-display text-xl leading-tight text-white">
              {p.Dorsal > 0 && <span className="text-teamOrange">{p.Dorsal}</span>}
              <span className="truncate">{p.Jugador}</span>
              {p.MVP && <Star className="size-4 shrink-0 fill-teamOrange text-teamOrange" aria-label="MVP" />}
            </p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.Posición || 'Suplente'}</p>
          </div>
          <EventChips p={p} className="shrink-0 !justify-end" />
        </li>
      ))}
    </ul>
  )
}
