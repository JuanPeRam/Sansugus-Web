import React from 'react'
import { playerData } from '../types'
import { getImage } from '@/rendering/players_img'
import nullPlayer from '../../img/player.png'
import '@/styles/Players/PlayerCard.css'

const PlayerCard : React.FC<{player:playerData, onclick: ()=>void}>= ({player, onclick}) => {

    const playerImage = getImage(player.Jugador)??nullPlayer
    const isNull = playerImage===nullPlayer
  return (
    <article className='flex gap-2 border rounded-xl card p-5 md:h-56 h-full group hover:cursor-pointer md:flex-row flex-col items-center' onClick={onclick}>
        <div className='flex gap-2'>
            <div className='card-image rounded-xl shadow-lg group-hover:scale-110 transition'>
                <img src={playerImage} alt={player.Jugador+" Image"} className={`object-center ${isNull?'empty-photo':''}`}/>
            </div>
            <div className='flex-1 flex flex-col justify-between'>
                <div className='flex flex-col justify-between h-full items-center'>
                    <div className='flex justify-between w-full'>
                        <h3 className='md:text-lg text-xs'>{player.Jugador}</h3>
                        <p className='text-xs'>#{player.Dorsal != '' ? player.Dorsal: '?'}</p>
                    </div>
                    <div className='w-full flex items-start py-2'>
                        {
                            player.MVP > 0 && 
                            <div className='p-2 bg-secondary rounded-xl flex gap-2 text-sm'>
                                <span className='text-teamOrange'>MVP</span>{player.MVP}
                            </div>
                        }
                    </div>
                </div>
                <section className='text-sm card-stats gap-2 md:flex hidden'>
                    <div className='p-2 bg-secondary rounded-xl'>
                        <h4 className='text-primary/50'>Partidos</h4>
                        <p>{player.Partidos}</p>
                    </div>
                    <div>
                        <h4>Goles</h4>
                        <p>{player.Goles}</p>
                    </div>
                    <div>
                        <h4>Asist.</h4>
                        <p>{player.Asistencias}</p>
                    </div>
                    <div>
                        <h4>Amarillas</h4>
                        <p>{player.Amarillas}</p>
                    </div>
                    <div>
                        <h4>Rojas</h4>
                        <p>{player.Rojas}</p>
                    </div>
                </section>
            </div>
        </div>
        <section className='text-sm card-stats gap-2 md:hidden flex flex-wrap justify-center'>
                    <div className='p-2 bg-secondary rounded-xl'>
                        <h4 className='text-primary/50'>Partidos</h4>
                        <p>{player.Partidos}</p>
                    </div>
                    <div>
                        <h4>Goles</h4>
                        <p>{player.Goles}</p>
                    </div>
                    <div>
                        <h4>Asist.</h4>
                        <p>{player.Asistencias}</p>
                    </div>
                    <div>
                        <h4>Amarillas</h4>
                        <p>{player.Amarillas}</p>
                    </div>
                    <div>
                        <h4>Rojas</h4>
                        <p>{player.Rojas}</p>
                    </div>
        </section>
        
    </article>
  )
}

export default PlayerCard