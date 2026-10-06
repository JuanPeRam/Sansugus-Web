import PlayerStats from './PlayerStats'
import { playerData } from '../types'
import nullPlayer from '../../img/player.png'
import { getImage } from '../../rendering/players_img';
import { ReactNode, useState } from 'react';

const Player: React.FC<{ stats: playerData, totalStats: playerData, children: ReactNode }> = ({ stats, totalStats, children }) => {

    // Foto grande; si no existe o no carga, se muestra la silueta
    const [failed, setFailed] = useState(false)
    const playerImage = (!failed && getImage(stats.Jugador, 'lg')) || nullPlayer
    const isNull = playerImage === nullPlayer

    return (
        <>
            <header className='page-hero'>
                <div className='page-hero-inner'>
                    <div className='mb-4'>{children}</div>
                    <span className='eyebrow'>Dorsal {stats.Dorsal != '' ? stats.Dorsal : '?'}</span>
                    <h1 className='page-title'>{stats.Jugador}</h1>
                </div>
            </header>
            <div className='page-container'>
                <div className='grid gap-8 lg:grid-cols-2'>
                    <div className='panel panel-accent relative flex min-h-[28rem] items-end justify-center overflow-hidden bg-gradient-to-b from-secondary to-card'>
                        <span className='absolute right-4 top-0 select-none font-display text-[16rem] leading-none text-white/[0.05]'>
                            {stats.Dorsal != '' ? stats.Dorsal : '?'}
                        </span>
                        <img
                            src={playerImage}
                            alt={stats.Jugador + " Image"}
                            decoding='async'
                            onError={() => setFailed(true)}
                            className={`relative max-h-[34rem] max-w-[80%] object-contain ${isNull ? 'opacity-40 invert' : ''}`}
                            style={{ maskImage: 'linear-gradient(black 85%, transparent)', animation: 'faderight var(--fade-entry-time)' }}
                        />
                    </div>
                    <PlayerStats stats={stats} totalStats={totalStats} />
                </div>
            </div>
        </>
    )
};

export default Player
