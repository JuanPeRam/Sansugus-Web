import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { matchData } from '../types'
import { sheetResponseToObjects } from '../../functions/sheets'
import {setNewDate} from '../../functions/dates'
import sansugusLogo from '../../img/sansugus-logo.svg'
import Date from './Date'
import '../../styles/Games.css'

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
        <section className='filters-list'>
            
        </section>
        <section className='games-list'>
            {
                isLoading && <p>Cargando datos...</p>
            }
            {!isLoading && games && 
                <>
                {games.map((game:matchData)=>(
                    <div key={game.ID_Partido} className='game-data'>
                        <div className='game-name'>
                            {game.Local==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:<span>{game.Local}</span>}
                        </div>
                        <div>
                            <div className='game-result'>
                                {game['Goles Local']} - {game['Goles Visitante']}
                            </div>
                            <div className='game-date'>
                                {game.Fecha && <Date date={game.Fecha}></Date>}
                            </div>
                            <div className='game-props'>
                                <div className='game-comp'>
                                    {game.Competición} {game.Jornada}
                                </div>
                                {game.Campo && 
                                <div className='game-field'>
                                    Campo {game.Campo}
                                </div>}
                            </div>
                        </div>
                        <div className='game-name'>
                            {game.Visitante==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:<span>{game.Visitante}</span>}
                        </div>
                </div>
                ))}</>
            }
        </section>
        </>
    )
}