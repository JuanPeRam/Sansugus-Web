import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { matchData } from '../../types'
import { TeamCrest } from '@/components/TeamCrest'
import { dateToString } from '@/functions/dates'

const CLUB = 'Sansugus FC'
const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' })

const num = (v: unknown) => Number(v) || 0

/** Resultado desde el punto de vista de Sansugus (los penaltis desempatan) */
export function resultOf(m: matchData): 'won' | 'lost' | 'draw' | null {
  if (!m.Jugado) return null
  const home = m.Local === CLUB
  let own = num(home ? m['Goles Local'] : m['Goles Visitante'])
  let rival = num(home ? m['Goles Visitante'] : m['Goles Local'])
  if (own === rival) {
    own = num(home ? m['Penaltis Local'] : m['Penaltis Visitante'])
    rival = num(home ? m['Penaltis Visitante'] : m['Penaltis Local'])
  }
  return own > rival ? 'won' : own < rival ? 'lost' : 'draw'
}

const RESULT = {
  won: { label: 'Victoria', cls: 'bg-emerald-500 text-black' },
  lost: { label: 'Derrota', cls: 'bg-red-600 text-white' },
  draw: { label: 'Empate', cls: 'bg-zinc-500 text-white' },
}

function Team({ name }: { name: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
      <TeamCrest name={name} className="h-16 w-16 drop-shadow-[0_6px_14px_rgba(0,0,0,.6)] sm:h-28 sm:w-28" />
      <h2 className="hidden max-w-full text-balance leading-tight text-white sm:block sm:text-3xl">{name}</h2>
    </div>
  )
}

export function MatchScoreboard({ match }: { match: matchData }) {
  const result = resultOf(match)
  const pens = match['Penaltis Local'] != null || match['Penaltis Visitante'] != null
  const date: Date | undefined = match.Fecha
  return (
    <header className="page-hero">
      <div className="page-hero-inner">
        <Link to={`/Games?season=${encodeURIComponent(match.Temporada)}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-teamOrange hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> Partidos
        </Link>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="chip !bg-teamOrange !text-black">{match.Competición}</span>
          <span className="chip">{match.Jornada}</span>
          <span className="chip">Temporada {match.Temporada}</span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2 sm:gap-6">
          <Team name={match.Local} />
          <div className="flex shrink-0 flex-col items-center gap-2">
            {result && <span className={cn('px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em]', RESULT[result].cls)} style={{ clipPath: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)' }}>{RESULT[result].label}</span>}
            <div className="font-display text-5xl leading-none text-white sm:text-8xl">
              {match.Jugado ? <>{match['Goles Local']}<span className="mx-1 text-teamOrange sm:mx-3">-</span>{match['Goles Visitante']}</> : <span className="text-white/40">VS</span>}
            </div>
            {pens && <span className="text-xs font-bold uppercase tracking-widest text-white/60">Penaltis {match['Penaltis Local'] ?? 0} - {match['Penaltis Visitante'] ?? 0}</span>}
          </div>
          <Team name={match.Visitante} />
        </div>
        {/* En móvil los nombres van debajo, con todo el ancho disponible */}
        <div className="mt-3 grid grid-cols-2 gap-4 text-center sm:hidden">
          <h2 className="text-balance text-lg leading-tight text-white">{match.Local}</h2>
          <h2 className="text-balance text-lg leading-tight text-white">{match.Visitante}</h2>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70 sm:justify-start">
          {date && <li className="flex items-center gap-2"><CalendarDays className="size-4 text-teamOrange" aria-hidden /> <span className="first-letter:uppercase">{dateToString(date)}</span></li>}
          {date && <li className="flex items-center gap-2"><Clock className="size-4 text-teamOrange" aria-hidden /> {time.format(date)} h</li>}
          {match.Campo > 0 && <li className="flex items-center gap-2"><Flag className="size-4 text-teamOrange" aria-hidden /> Campo {match.Campo}</li>}
        </ul>
      </div>
    </header>
  )
}
