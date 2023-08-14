import PlayerStats from './PlayerStats'
import {playerData} from './types'
import '../styles/Player.css'
import nullPlayer from '../img/player.png'
import { getImage } from '../rendering/players_img';
import { ReactNode } from 'react';

const Player: React.FC<{stats: playerData, totalStats: playerData, children: ReactNode }> = ({ stats, totalStats, children }) => {

    return (
        <div className='player-card'>
            <div className='player-controls'>
                {children}
            </div>
            <div className='player-card-content'>
                <div className='player-info' style={{backgroundImage: `url(${getImage(stats.Jugador)??nullPlayer})`, backgroundPosition: 'top', backgroundSize: "cover"}}>
                </div>
                <PlayerStats stats={stats} totalStats={totalStats}/>
            </div>
        </div>

        
    )
};

export default Player