import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from '../types'
import { sheetResponseToObjects } from '../../functions/sheets'
import {setNewDate} from '../../functions/dates'

import '../../styles/Games.css'
import Game from './Game'

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

    useEffect(() => {
      setIsLoading(true)
      const query = 'SELECT * ORDER BY D desc'
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
    }, [])

    

    return(
        <>
        <header>
            <h1>Partidos</h1>
        </header>
        <section className='filters-list'>
            
        </section>
        <section className='games-list'>
            {
                isLoading && <p>Cargando datos...</p>
            }
            {!isLoading && games && 
                <>
                {games.map((game:matchData)=>(
                    <Game game={game}/>
                ))}</>
            }
        </section>
        </>
    )
}