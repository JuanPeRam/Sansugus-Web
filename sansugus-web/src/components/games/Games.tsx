import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from '../types'
import { sheetResponseToObjects } from '../../functions/sheets'
import {setNewDate} from '../../functions/dates'
import { link } from '../types'
import '../../styles/Games.css'
import Game from './Game'
import { Card } from '../ui/card'
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
        <header>
            <h1>Partidos</h1>
        </header>
        <Card className='filters-list w-full flex justify-center'>
            <Card className='p-5 flex justify-center border-none'>
                <SeasonsSelect onSeasonChange={setSeason}/>
            </Card>
        </Card>
        <section className='games-list'>
            {
                isLoading && <>
                <LoadingGame></LoadingGame>
                <LoadingGame></LoadingGame>
                <LoadingGame></LoadingGame>
                <LoadingGame></LoadingGame>
                </>
            }
            {!isLoading && games && 
                <>
                {games.map((game:matchData)=>(
                    <Game game={game} key={game.ID_Partido}/>
                ))}</>
            }
        </section>
        </>
    )
}