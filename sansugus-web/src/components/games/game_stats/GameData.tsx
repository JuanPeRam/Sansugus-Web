import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Field from "./Field";
import { link, matchData } from '../../types'
import { sheetResponseToObjects } from "../../../functions/sheets";
import BenchPlayers from "./BenchPlayers";

const sheetName = 'Actas'

const GameData: React.FC<{}> = ({ }) => {

    const queryParameters = new URLSearchParams(window.location.search)
    const game = queryParameters.get("game")
    const [isLoading, setIsLoading] = useState(false)
    const [gameDataLoading, setGameDataLoading] = useState(false)
    const [gameData, setGameData] = useState<matchData[] | undefined>()
    const [playersInfo, setPlayersInfo]: any = useState(null)
    const [startingSeven, setStartingSeven]: any = useState(null)
    const [benchPlayers, setBenchPlayers]: any = useState(null)

    function getOpponentName(): string {
        if (!gameData) return '';
        if (!(gameData[0].Local === 'Sansugus FC')) return gameData[0].Local
        else return gameData[0].Visitante
    }

    useEffect(() => {
        setIsLoading(true)
        const query = `SELECT * WHERE A = '${game}'`
        fetchGame(query)
        fetch(`${link}&sheet=${sheetName}&tq=${query}`)
            .then(res => res.text())
            .then(rep => {
                const data = sheetResponseToObjects(rep)
                setPlayersInfo(data);
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            }
            )
    }, [])

    function fetchGame(query: string) {
        const sheet = 'Partidos'
        setGameDataLoading(true)
        fetch(`${link}&sheet=${sheet}&tq=${query}`)
            .then(res => res.text())
            .then(rep => {
                const data = sheetResponseToObjects(rep)
                setGameData(data);
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setGameDataLoading(false)
            }
            )
    }


    useEffect(() => {
        if (playersInfo != null) {
            var players: Array<any> = new Array<any>
            var bench: Array<any> = new Array<any>
            playersInfo.map((player: any) => {
                if (player.Titular) {
                    players.push(player)
                }
                else bench.push(player)
            })
            setBenchPlayers(bench)
            setStartingSeven(players)
        }
    }, [playersInfo])



    return (
        <>
            <header className="page-hero">
                <div className="page-hero-inner">
                    <Link to="/Games" className="eyebrow hover:underline">← Volver a partidos</Link>
                    <h1 className="page-title">Acta del <em>partido</em></h1>
                    {!gameDataLoading && gameData && gameData[0] &&
                        <div className="mt-6 flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                                {gameData[0].Jornada + ' ' + gameData[0].Competición + ' · ' + gameData[0].Temporada}
                            </span>
                            <h2 className="flex flex-wrap items-center gap-4 text-4xl text-white md:text-6xl">
                                <span>{gameData[0]["Goles Local"] + " - " + gameData[0]["Goles Visitante"]}</span>
                                <span className="text-white/40">vs</span>
                                <span className="text-teamOrange">{getOpponentName()}</span>
                            </h2>
                            <p className="text-sm text-white/60">{String(gameData[0].Fecha)}</p>
                        </div>
                    }
                </div>
            </header>
            <div className="page-container">
                <section className="flex flex-wrap items-start justify-center gap-8">
                    {
                        startingSeven && startingSeven.length > 0 &&
                        <Field playersInfo={startingSeven} isLoading={isLoading} />
                    }
                    {
                        benchPlayers && benchPlayers.length > 0 &&
                        <BenchPlayers playersInfo={benchPlayers} isLoading={isLoading} />
                    }
                </section>
            </div>
        </>
    )
}

export default GameData;
