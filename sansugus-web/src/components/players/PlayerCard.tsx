import React, { useState } from 'react'
import { playerData } from '../types'
import { getImage } from '@/rendering/players_img'
import nullPlayer from '../../img/player.png'

const Stat: React.FC<{ label: string, value: any }> = ({ label, value }) => (
  <div className='flex flex-col items-center bg-black/40 px-2 py-2'>
    <span className='font-display text-2xl leading-none text-white'>{value}</span>
    <span className='mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>{label}</span>
  </div>
)

const PlayerCard: React.FC<{ player: playerData, onclick: () => void, key: number }> = ({ player, onclick }) => {

  // Si la foto no existe o no carga, se muestra la silueta
  const [failed, setFailed] = useState(false)
  const playerImage = (!failed && getImage(player.Jugador)) || nullPlayer
  const isNull = playerImage === nullPlayer
  return (
    <article
      className='group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border border-border bg-card transition hover:-translate-y-1 hover:border-teamOrange'
      onClick={onclick}
    >
      <div className='relative h-64 overflow-hidden bg-gradient-to-b from-secondary to-card'>
        <span className='absolute -right-2 -top-4 select-none font-display text-[9rem] leading-none text-white/[0.06]'>
          {player.Dorsal != '' ? player.Dorsal : '?'}
        </span>
        <img
          src={playerImage}
          alt={player.Jugador + " Image"}
          loading='lazy'
          decoding='async'
          onError={() => setFailed(true)}
          className={`relative mx-auto h-full object-contain object-bottom transition duration-500 group-hover:scale-105 ${isNull ? 'empty-photo opacity-40 invert' : ''}`}
          style={{ maskImage: 'linear-gradient(black 80%, transparent)' }}
        />
        {player.MVP > 0 &&
          <div className='absolute left-3 top-3 bg-teamOrange px-2 py-1 font-display text-sm text-black'>
            ★ MVP {player.MVP}
          </div>}
      </div>
      <div className='border-t-2 border-teamOrange px-4 pb-4 pt-3'>
        <div className='mb-3 flex items-baseline justify-between gap-2'>
          <h3 className='text-2xl text-white'>{player.Jugador}</h3>
          <span className='font-display text-xl text-teamOrange'>#{player.Dorsal != '' ? player.Dorsal : '?'}</span>
        </div>
        <section className='grid grid-cols-5 gap-1'>
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
