import { matchData } from "../types"
import Date from './Date'
import { TeamCrest } from "../TeamCrest"
import { useNavigate } from "react-router-dom"

const sansugusName = "Sansugus FC"
const nonViewableSeasons = ['22/23', '21/22']

const result = {
    won: { label: 'Victoria', bar: 'bg-emerald-500', text: 'text-emerald-400' },
    lost: { label: 'Derrota', bar: 'bg-red-600', text: 'text-red-500' },
    draw: { label: 'Empate', bar: 'bg-zinc-500', text: 'text-zinc-400' },
}

const Team: React.FC<{ name: string }> = ({ name }) => (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
        <TeamCrest name={name} className="h-14 w-14 md:h-16 md:w-16" />
        <span className="font-display text-sm leading-tight text-white md:text-lg">{name}</span>
    </div>
)

const Game: React.FC<{ game: matchData }> = ({ game }) => {
    const navigate = useNavigate()
    const sansugusHome = game.Local === sansugusName
    const num = (v: unknown) => Number(v) || 0
    let own = num(sansugusHome ? game["Goles Local"] : game["Goles Visitante"])
    let rival = num(sansugusHome ? game["Goles Visitante"] : game["Goles Local"])
    if (own === rival) {  // desempate por penaltis
        own = num(sansugusHome ? game["Penaltis Local"] : game["Penaltis Visitante"])
        rival = num(sansugusHome ? game["Penaltis Visitante"] : game["Penaltis Local"])
    }
    const status = own > rival ? result.won : own < rival ? result.lost : result.draw
    const withPens = (goals: string, pens?: number | null) => pens ? `${goals} (${pens})` : goals
    const viewable = !nonViewableSeasons.includes(game['Temporada']) && game.Jugado

    return (
        <article
            className={`panel group relative flex flex-col overflow-hidden transition hover:border-teamOrange/60 ${viewable ? 'cursor-pointer' : ''}`}
            onClick={() => viewable && navigate('/Game?game=' + game.ID_Partido)}
        >
            <span className={`absolute inset-y-0 left-0 w-1.5 ${game.Jugado ? status.bar : 'bg-zinc-700'}`} />
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span className="text-teamOrange">{game.Competición} {game.Jornada}</span>
                <span>{game.Fecha && <Date date={game.Fecha} />}</span>
                <span className="hidden sm:inline">{game.Campo ? `Campo ${game.Campo}` : ''} · {game.Temporada}</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-6 py-5">
                <Team name={game.Local} />
                <div className="flex flex-col items-center gap-1">
                    {game.Jugado ? (
                        <>
                            <div className="font-display text-4xl text-white md:text-6xl">
                                {withPens(game['Goles Local'], game['Penaltis Local'])}<span className="mx-2 text-teamOrange">-</span>{withPens(game['Goles Visitante'], game['Penaltis Visitante'])}
                            </div>
                            <span className={`text-xs font-extrabold uppercase tracking-widest ${status.text}`}>{status.label}</span>
                        </>
                    ) : (
                        <>
                            <div className="font-display text-4xl text-white/40 md:text-5xl">VS</div>
                            <span className="chip">No jugado</span>
                        </>
                    )}
                </div>
                <Team name={game.Visitante} />
            </div>
            {viewable && (
                <div className="border-t border-border px-6 py-2 text-right text-xs font-extrabold uppercase tracking-widest text-teamOrange transition group-hover:bg-teamOrange group-hover:text-black">
                    Ver acta →
                </div>
            )}
        </article>
    )
}

export default Game;
