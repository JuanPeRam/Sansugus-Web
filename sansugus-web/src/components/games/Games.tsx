import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from '../types'
import { fetchMatches } from '@/data/api'
import Game from './Game'
import LoadingGame from './LoadingGame'
import { SeasonsSelect } from '../SeasonsSelect'

export default function Games(){
    const [isLoading, setIsLoading]: [boolean, Dispatch<SetStateAction<boolean>>]= useState(false)
    const [games, setGames]:[matchData |any, Dispatch<SetStateAction<matchData | any>>] = useState()
    const [season, setSeason]:any = useState();

    useEffect(() => {
        if(!season) return
        setIsLoading(true)
        fetchMatches(season)
            .then(setGames)
            .catch((err)=>{
                console.error(err)
            })
            .finally(()=>{
                setIsLoading(false)
            })
    }, [season])

    return(
        <>
        <header className="page-hero">
            <div className="page-hero-inner">
                <span className="eyebrow">Calendario y resultados</span>
                <h1 className="page-title">Par<em>tidos</em></h1>
            </div>
        </header>
        <div className="page-container">
            <div className='panel mb-8 flex flex-wrap items-center justify-between gap-4 p-4'>
                <span className='font-display text-xl text-white'>Temporada</span>
                <div className='w-40'><SeasonsSelect onSeasonChange={setSeason}/></div>
            </div>
            <section className='flex flex-col gap-4'>
                {isLoading && <>
                    <LoadingGame /><LoadingGame /><LoadingGame /><LoadingGame />
                </>}
                {!isLoading && games &&
                    games.map((game:matchData)=>(
                        <Game game={game} key={game.ID_Partido}/>
                    ))
                }
            </section>
        </div>
        </>
    )
}
