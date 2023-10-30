import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from '../types'
import { sheetResponseToObjects } from '../../functions/sheets'
import {setNewDate} from '../../functions/dates'

import '../../styles/Games.css'
import Game from './Game'
import { Card } from '../ui/card'
import { Select, SelectContent, SelectTrigger,SelectItem, SelectValue } from '../ui/select'
import LoadingGame from './LoadingGame'

const sheetName = "Partidos"
const link = "https://docs.google.com/spreadsheets/d/1oC9Iaba_OL_2BWSR0d-IZtrY0MSAynJRAW8jXixc70M/gviz/tq?"

function setDates(games:any){
    games.map((game:matchData) => {
        game.Fecha = setNewDate(game.Fecha)
    })
}

export default function Games(){
    const [isLoading, setIsLoading]: [boolean, Dispatch<SetStateAction<boolean>>]= useState(false)
    const [games, setGames]:[matchData |any, Dispatch<SetStateAction<matchData | any>>] = useState()
    const [seasons, setSeasons]:any = useState();
    const [season, setSeason]:any = useState();


    function setSeasonsData(data:any[]){
        const uniqueSeasons = new Set(data.map(obj => obj.Temporada));
        const uniqueSeasonsArray = Array.from(uniqueSeasons);
        setSeasons(uniqueSeasonsArray.map(temporada => ({ Temporada: temporada })));
    }

    useEffect(() => {
      setIsLoading(true)
      const query = 'SELECT * ORDER BY D desc'
      fetch(`${link}&sheet=${sheetName}&tq=${query}`)
      .then(res => res.text())
            .then(rep => {
                const data = sheetResponseToObjects(rep)
                setDates(data)
                setGames(data)
                setSeasonsData(data)
            })
        .catch((err)=>{
            console.error(err)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }, [])

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
                <Select onValueChange={(e)=> setSeason(e)}>
                    <SelectTrigger >
                        <SelectValue placeholder='Temporada'/>
                    </SelectTrigger>
                    <SelectContent>
                        { seasons &&
                            seasons.map((season:any)=>(
                                <SelectItem key={season.Temporada} value={season.Temporada}>{season.Temporada}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>

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