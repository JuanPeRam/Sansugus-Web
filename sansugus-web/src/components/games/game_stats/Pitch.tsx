import { Star } from 'lucide-react'
import { matchPlayerInfo } from '../../types'
import { PlayerShirt } from './PlayerShirt'
import { EventChips } from './EventChips'
import { buildLineup, formation, shortName } from './actaUtils'
import '@/styles/Acta.css'

function PitchPlayer({ p }: { p: matchPlayerInfo }) {
  return (
    <li className="pitch-player">
      <div className="relative w-full">
        <PlayerShirt player={p.Jugador} alias={shortName(p)} number={p.Dorsal} className="w-full drop-shadow-[0_8px_8px_rgba(0,0,0,.55)]" />
        {p.MVP && (
          <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-teamOrange text-black shadow-lg ring-2 ring-black/60" title="MVP del partido">
            <Star className="size-3.5 fill-black" aria-hidden />
          </span>
        )}
      </div>
      <span className="pitch-plate">
        {p.Dorsal > 0 && <b className="text-teamOrange">{p.Dorsal}</b>}
        <span className="truncate">{shortName(p)}</span>
      </span>
      <EventChips p={p} className="pitch-events" />
    </li>
  )
}

/** Alineación titular sobre el campo, de la delantera a la portería */
export function Pitch({ starters }: { starters: matchPlayerInfo[] }) {
  const lineup = buildLineup(starters)
  const rows = [lineup.forwards, lineup.midfielders, lineup.defenders, lineup.keepers].filter((r) => r.length > 0)
  return (
    <div className="mx-auto w-full max-w-[36rem]">
      <div className="pitch" role="group" aria-label="Alineación titular">
        <div className="pitch-line pitch-halfway" aria-hidden />
        <div className="pitch-line pitch-circle" aria-hidden />
        <div className="pitch-line pitch-box" aria-hidden />
        <div className="pitch-line pitch-six" aria-hidden />
        <span className="pitch-formation">{formation(lineup)}</span>
        <div className="pitch-rows">
          {rows.map((row, i) => (
            <ul key={i} className="pitch-row">
              {row.map((p) => <PitchPlayer key={p.Jugador} p={p} />)}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
