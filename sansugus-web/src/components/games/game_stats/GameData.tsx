import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Field from "./Field";
import { matchData, matchPlayerInfo } from '../../types'
import { fetchActa, fetchMatch, parseMatchId } from "@/data/api";
import BenchPlayers from "./BenchPlayers";
import { dateToString } from "@/functions/dates";

const GameData: React.FC<{}> = ({ }) => {

    const queryParameters = new URLSearchParams(window.location.search)
    const gameId = parseMatchId(queryParameters.get("game"))
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [game, setGame] = useState<matchData | undefined>()
    const [playersInfo, setPlayersInfo] = useState<matchPlayerInfo[] | null>(null)

    function getOpponentName(): string {
        if (!game) return '';
        return game.Local === 'Sansugus FC' ? game.Visitante : game.Local
    }

    useEffect(() => {
        if (gameId === undefined) {
            setIsLoading(false)
            setError(true)
            return
        }
        Promise.all([fetchMatch(gameId), fetchActa(gameId)])
            .then(([match, acta]) => {
                setGame(match)
                setPlayersInfo(acta)
            })
            .catch(err => {
                console.error(err)
                setError(true)
            })
            .finally(() => setIsLoading(false))
    }, [])

    const startingSeven = playersInfo?.filter(p => p.Titular) ?? []
    const benchPlayers = playersInfo?.filter(p => !p.Titular) ?? []

    return (
        <>
            <header className="page-hero">
                <div className="page-hero-inner">
                    <Link to="/Games" className="eyebrow hover:underline">← Volver a partidos</Link>
                    <h1 className="page-title">Acta del <em>partido</em></h1>
                    {game &&
                        <div className="mt-6 flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                                {game.Jornada + ' ' + game.Competición + ' · ' + game.Temporada}
                            </span>
                            <h2 className="flex flex-wrap items-center gap-4 text-4xl text-white md:text-6xl">
                                <span>{game["Goles Local"] + " - " + game["Goles Visitante"]}</span>
                                <span className="text-white/40">vs</span>
                                <span className="text-teamOrange">{getOpponentName()}</span>
                            </h2>
                            {game.Fecha && <p className="text-sm text-white/60 first-letter:uppercase">{dateToString(game.Fecha)}</p>}
                        </div>
                    }
                </div>
            </header>
            <div className="page-container">
                {error && <p className="py-10 text-center text-muted-foreground">No se ha encontrado el partido.</p>}
                <section className="flex flex-wrap items-start justify-center gap-8">
                    {
                        startingSeven.length > 0 &&
                        <Field playersInfo={startingSeven} isLoading={isLoading} />
                    }
                    {
                        benchPlayers.length > 0 &&
                        <BenchPlayers playersInfo={benchPlayers} isLoading={isLoading} />
                    }
                </section>
            </div>
        </>
    )
}

export default GameData;
