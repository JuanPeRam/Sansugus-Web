import React, { useState } from 'react'
import { playerData } from '../types'
import { getPlayerPhotos } from '@/rendering/players_img'
import nullPlayer from '../../img/player.png'

const Stat: React.FC<{ label: string, value: any }> = ({ label, value }) => (
  <div className='flex flex-col items-center bg-black/40 px-0.5 py-1.5 sm:px-2 sm:py-2'>
    <span className='font-display text-lg leading-none text-white sm:text-2xl'>{value}</span>
    <span className='mt-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[10px] sm:tracking-widest'>{label}</span>
  </div>
)

const PlayerCard: React.FC<{ player: playerData, onclick: () => void, key: number }> = ({ player, onclick }) => {

  // Si una foto no existe o no carga se prueba la siguiente; al final, la silueta
  const [attempt, setAttempt] = useState(0)
  const playerImage = getPlayerPhotos(player)[attempt] ?? nullPlayer
  const isNull = playerImage === nullPlayer
  return (
    <article
      className='group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border border-border bg-card transition hover:-translate-y-1 hover:border-teamOrange'
      onClick={onclick}
    >
      <div className='relative h-44 overflow-hidden bg-gradient-to-b from-secondary to-card sm:h-64'>
        <span className='absolute -right-1 -top-2 select-none font-display text-[6rem] leading-none text-white/[0.06] sm:-right-2 sm:-top-4 sm:text-[9rem]'>
          {player.Dorsal != '' ? player.Dorsal : '?'}
        </span>
        <img
          src={playerImage}
          alt={player.Jugador + " Image"}
          loading='lazy'
          decoding='async'
          onError={() => setAttempt((a) => a + 1)}
          className={`relative mx-auto h-full object-contain object-bottom transition duration-500 group-hover:scale-105 ${isNull ? 'empty-photo opacity-40 invert' : ''}`}
          style={{ maskImage: 'linear-gradient(black 80%, transparent)' }}
        />
        {player.MVP > 0 &&
          <div className='absolute left-2 top-2 bg-teamOrange px-1.5 py-0.5 font-display text-xs text-black sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-sm'>
            ★ MVP {player.MVP}
          </div>}
      </div>
      <div className='flex flex-1 flex-col border-t-2 border-teamOrange px-2.5 pb-2.5 pt-2 sm:px-4 sm:pb-4 sm:pt-3'>
        <div className='mb-2 flex flex-1 items-start justify-between gap-2 sm:mb-3 sm:items-baseline'>
          <h3 className='line-clamp-2 text-base leading-tight text-white sm:text-2xl'>{player.Jugador}</h3>
          <span className='shrink-0 font-display text-base text-teamOrange sm:text-xl'>#{player.Dorsal != '' ? player.Dorsal : '?'}</span>
        </div>
        <section className='grid grid-cols-5 gap-0.5 sm:gap-1'>
          <Stat label='PJ' value={player.Partidos} />
          <Stat label='Gol' value={player.Goles} />
          <Stat label='Asi' value={player.Asistencias} />
          <Stat label='Am' value={player.Amarillas} />
          <Stat label='Roj' value={player.Rojas} />
        </section>
      </div>
    </article>
  )
}

export default PlayerCard
