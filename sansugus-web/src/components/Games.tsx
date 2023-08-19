import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from './types'
import { sheetResponseToObjects } from '../functions/sheets'

const sheetName = "Partidos"
const link = "https://docs.google.com/spreadsheets/d/1oC9Iaba_OL_2BWSR0d-IZtrY0MSAynJRAW8jXixc70M/gviz/tq?"

export default function Games(){
    const [isLoading, setIsLoading]: [boolean, Dispatch<SetStateAction<boolean>>]= useState(false)
    const [games, setGames]:[matchData |any, Dispatch<SetStateAction<matchData | any>>] = useState()

    useEffect(() => {
      setIsLoading(true)
      const query = 'SELECT *'
      fetch(`${link}&sheet=${sheetName}&tq=${query}`)
      .then(res => res.text())
            .then(rep => {
                const data = sheetResponseToObjects(rep)
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
        {
            !isLoading && games && 
            games.map((game:matchData)=>(
                <div key={game.ID_Partido}>
                    <div className='game-date'>
                        {game.Fecha.toString()}
                    </div>
                </div>
            ))
        }
        </>
    )
}