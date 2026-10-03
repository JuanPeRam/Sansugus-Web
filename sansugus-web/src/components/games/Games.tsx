import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from '../types'
import { sheetResponseToObjects } from '../../functions/sheets'
import {setNewDate} from '../../functions/dates'
import { link } from '../types'
import Game from './Game'
import LoadingGame from './LoadingGame'
import { SeasonsSelect } from '../SeasonsSelect'

const sheetName = "Partidos"

function setDates(games:any){
    games.map((game:matchData) => {
        game.Fecha = setNewDate(game.Fecha)
    })
}

export default function Games(){
    const [isLoading, setIsLoading]: [boolean, Dispatch<SetStateAction<boolean>>]= useState(false)
    const [games, setGames]:[matchData |any, Dispatch<SetStateAction<matchData | any>>] = useState()
    const [season, setSeason]:any = useState();

    useEffect(() => {
        if(!season) return
        setIsLoading(true)
        const query = `SELECT * WHERE H = '${season}' ORDER BY D desc`
        fetch(`${link}&sheet=${sheetName}&tq=${query}`)
        .then(res => res.text())
            .then(rep => {
                const data = sheetResponseToObjects(rep)
                setDates(data)
                setGames(data)
            })
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
