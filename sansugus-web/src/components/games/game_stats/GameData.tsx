import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardX } from 'lucide-react'
import { matchData, matchPlayerInfo } from '../../types'
import { fetchActa, fetchMatch, parseMatchId } from '@/data/api'
import { MatchScoreboard } from './MatchScoreboard'
import { ActaHighlights, MvpCard } from './ActaHighlights'
import { Pitch } from './Pitch'
import { BenchList } from './BenchList'
import { StatsTable } from './StatsTable'
import { buildHighlights, isOwnGoal } from './actaUtils'

const SECTIONS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'alineacion', label: 'Alineación' },
  { id: 'banquillo', label: 'Banquillo' },
  { id: 'estadisticas', label: 'Estadísticas' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36">
      <h2 className="section-title mb-5 text-2xl sm:text-3xl">{title}</h2>
      {children}
    </section>
  )
}

function Skeleton() {
  return (
    <>
      <div className="page-hero"><div className="page-hero-inner flex flex-col items-center gap-6 sm:items-stretch">
        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
        <div className="flex items-center justify-between gap-6">
          <div className="size-20 animate-pulse rounded-full bg-white/10 sm:size-28" />
          <div className="h-16 w-40 animate-pulse rounded bg-white/10 sm:h-24" />
          <div className="size-20 animate-pulse rounded-full bg-white/10 sm:size-28" />
        </div>
      </div></div>
      <div className="page-container">
        <div className="h-80 animate-pulse rounded-sm bg-card" />
      </div>
    </>
  )
}

const GameData: React.FC = () => {
  const gameId = parseMatchId(new URLSearchParams(window.location.search).get('game'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [game, setGame] = useState<matchData | undefined>()
  const [players, setPlayers] = useState<matchPlayerInfo[]>([])

  useEffect(() => {
    if (gameId === undefined) {
      setLoading(false)
      setError(true)
      return
    }
    Promise.all([fetchMatch(gameId), fetchActa(gameId)])
      .then(([match, acta]) => {
        setGame(match)
        setPlayers(acta)
        if (match) document.title = `${match.Local} ${match['Goles Local']}-${match['Goles Visitante']} ${match.Visitante} · Sansugus FC`
      })
      .catch((err) => {
        console.error(err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [gameId])

  if (loading) return <Skeleton />

  if (error || !game) {
    return (
      <div className="page-container flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <ClipboardX className="size-14 text-teamOrange" aria-hidden />
        <h1 className="text-4xl text-white">Partido no encontrado</h1>
        <p className="max-w-md text-muted-foreground">No hemos podido cargar este partido. Puede que el enlace no sea correcto.</p>
        <Link to="/Games" className="btn-club">Ver todos los partidos</Link>
      </div>
    )
  }

  const squad = players.filter((p) => !isOwnGoal(p))
  const starters = squad.filter((p) => p.Titular)
  const bench = squad.filter((p) => !p.Titular)
  const mvp = squad.find((p) => p.MVP)
  const highlights = buildHighlights(players)

  return (
    <>
      <MatchScoreboard match={game} />

      {players.length === 0 ? (
        <div className="page-container flex flex-col items-center gap-4 py-16 text-center">
          <ClipboardX className="size-12 text-teamOrange" aria-hidden />
          <h2 className="text-3xl text-white">Acta no disponible</h2>
          <p className="max-w-md text-muted-foreground">Todavía no se ha publicado el acta de este partido (alineación, goleadores y MVP).</p>
          <Link to={`/Games?season=${encodeURIComponent(game.Temporada)}`} className="btn-ghost">Volver a los partidos</Link>
        </div>
      ) : (
        <>
          <nav aria-label="Secciones del acta" className="sticky top-[4.25rem] z-30 border-b border-border bg-black/85 backdrop-blur">
            <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 sm:px-5">
              {SECTIONS.filter((s) => s.id !== 'banquillo' || bench.length > 0).map((s) => (
                <li key={s.id} className="shrink-0">
                  <a href={`#${s.id}`} className="block px-4 py-2 font-display text-base text-white/75 transition hover:bg-white/10 hover:text-teamOrange">{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="page-container flex flex-col gap-12">
            <Section id="resumen" title="Resumen del partido">
              <div className="flex flex-col gap-4">
                {mvp && <MvpCard player={mvp} />}
                <ActaHighlights h={highlights} />
              </div>
            </Section>

            <Section id="alineacion" title="Alineación titular">
              <Pitch starters={starters} />
            </Section>

            {bench.length > 0 && (
              <Section id="banquillo" title="Banquillo">
                <BenchList players={bench} />
              </Section>
            )}

            <Section id="estadisticas" title="Estadísticas del partido">
              <StatsTable starters={starters} bench={bench} />
            </Section>
          </div>
        </>
      )}
    </>
  )
}

export default GameData
