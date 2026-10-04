import React from 'react'
import { playerData } from '../types'
import { getImage } from '@/rendering/players_img'
import nullPlayer from '../../img/player.png'

const Stat: React.FC<{ label: string, value: number | string }> = ({ label, value }) => (
  <div className='flex flex-col items-center border border-white/10 bg-black/40 px-1 py-2'>
    <span className='font-display text-2xl leading-none text-white'>{value}</span>
    <span className='mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>{label}</span>
  </div>
)

const PlayerCard: React.FC<{ player: playerData, onclick: () => void, key: number }> = ({ player, onclick }) => {

  const playerImage = getImage(player.Jugador) ?? nullPlayer
  const isNull = playerImage === nullPlayer
  const number = player.Dorsal != '' ? player.Dorsal : '?'

  return (
    <article
      className='player-card group'
      role='button'
      tabIndex={0}
      aria-label={`Ver ficha de ${player.Jugador}`}
      onClick={onclick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onclick() } }}
    >
      <span className='player-card-frame' aria-hidden />
      <div className='player-card-face'>
        <div className='relative h-64 overflow-hidden'>
          <span className='absolute -right-1 -top-3 select-none font-display text-[9.5rem] leading-none text-teamOrange/[0.13]'>{number}</span>
          <div className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c0c0c] to-transparent' aria-hidden />
          <img
            src={playerImage}
            alt={player.Jugador + ' Image'}
            loading='lazy'
            className={`relative mx-auto h-full object-contain object-bottom transition duration-500 group-hover:scale-105 ${isNull ? 'opacity-40 invert' : ''}`}
            style={{ maskImage: 'linear-gradient(black 78%, transparent)' }}
          />
          {player.MVP > 0 &&
            <div className='absolute left-5 top-5 z-[2] bg-teamOrange px-2 py-1 font-display text-sm text-black'>
              ★ MVP {player.MVP}
            </div>}
        </div>
        <div className='relative flex flex-1 flex-col px-5 pb-6 pt-1'>
          <div className='mb-3 flex min-h-[3.9rem] flex-1 items-start justify-between gap-2'>
            <h3 className='text-2xl leading-tight text-white'>{player.Jugador}</h3>
            <span className='mt-0.5 shrink-0 font-display text-xl text-teamOrange'>#{number}</span>
          </div>
          <span aria-hidden className='mb-3 block h-px w-full bg-gradient-to-r from-teamOrange/70 via-teamOrange/20 to-transparent' />
          <section className='grid grid-cols-5 gap-1.5'>
            <Stat label='PJ' value={player.Partidos} />
            <Stat label='Gol' value={player.Goles} />
            <Stat label='Asi' value={player.Asistencias} />
            <Stat label='Am' value={player.Amarillas} />
            <Stat label='Roj' value={player.Rojas} />
          </section>
        </div>
      </div>
    </article>
  )
}

export default PlayerCard
