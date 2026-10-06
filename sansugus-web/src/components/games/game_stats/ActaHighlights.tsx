import { Star } from 'lucide-react'
import { matchPlayerInfo } from '../../types'
import { PlayerShirt } from './PlayerShirt'
import { CardIcon, AssistIcon, GoalIcon } from './EventChips'
import { Highlights, shortName } from './actaUtils'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center border border-white/10 bg-black/40 px-4 py-2">
      <span className="font-display text-3xl leading-none text-white">{value}</span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  )
}

/** Tarjeta destacada del MVP del partido */
export function MvpCard({ player }: { player: matchPlayerInfo }) {
  return (
    <section aria-label="MVP del partido" className="panel panel-accent relative overflow-hidden">
      <div className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[11rem] leading-none text-teamOrange/10">★</div>
      <div className="relative flex items-center gap-4 p-4 sm:gap-6 sm:p-6">
        <PlayerShirt player={player.Jugador} alias={shortName(player)} number={player.Dorsal} className="w-20 shrink-0 drop-shadow-[0_8px_14px_rgba(0,0,0,.6)] sm:w-28" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.3em] text-teamOrange"><Star className="size-4 fill-teamOrange" aria-hidden /> MVP del partido</p>
          <h3 className="mt-1 text-3xl leading-none text-white sm:text-5xl">{player.Jugador}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{player.Posición || 'Jugador'}{player.Dorsal > 0 ? ` · #${player.Dorsal}` : ''}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Stat label="Goles" value={player.Goles} />
            <Stat label="Asist." value={player.Asistencias} />
          </div>
        </div>
      </div>
    </section>
  )
}

function List({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <section className="panel">
      <h3 className="border-b border-border px-4 py-3 text-lg text-white sm:text-xl">{title}</h3>
      {items.filter(Boolean).length === 0 ? <p className="px-4 py-4 text-sm text-muted-foreground">{empty}</p> : <ul className="divide-y divide-border">{children}</ul>}
    </section>
  )
}

const Row = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <li className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
    <span className="min-w-0 truncate font-semibold text-white">{name}</span>
    <span className="flex shrink-0 items-center gap-1 text-base">{children}</span>
  </li>
)

/** Goles, asistencias y tarjetas del partido */
export function ActaHighlights({ h }: { h: Highlights }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <List title="Goles" empty="Sin goles de Sansugus.">
        {[
          ...h.scorers.map((s) => <Row key={s.name} name={s.name}><GoalIcon n={s.n} /></Row>),
          h.ownGoals > 0 ? <Row key="pp" name="Propia puerta (rival)"><GoalIcon n={h.ownGoals} /></Row> : null,
        ]}
      </List>
      <List title="Asistencias" empty="Sin asistencias.">
        {h.assists.map((s) => <Row key={s.name} name={s.name}><AssistIcon n={s.n} /></Row>)}
      </List>
      <List title="Tarjetas" empty="Partido limpio, sin tarjetas.">
        {[
          ...h.yellows.map((s) => <Row key={`y${s.name}`} name={s.name}><CardIcon color="yellow" n={s.n} /></Row>),
          ...h.reds.map((s) => <Row key={`r${s.name}`} name={s.name}><CardIcon color="red" n={s.n} /></Row>),
        ]}
      </List>
    </div>
  )
}
