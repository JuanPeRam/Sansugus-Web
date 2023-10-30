import PlayerStats from './PlayerStats'
import {playerData} from '../types'
import '../../styles/Player.css'
import nullPlayer from '../../img/player.png'
import { getImage } from '../../rendering/players_img';
import { ReactNode } from 'react';
import { Card } from '../ui/card';

const Player: React.FC<{stats: playerData, totalStats: playerData, children: ReactNode }> = ({ stats, totalStats, children }) => {

    const playerImage = getImage(stats.Jugador)??nullPlayer;

    const isNull = playerImage===nullPlayer

    return (
        <Card className='player-card'>
            <div className='player-controls'>
                {children}
            </div>
            <div className='player-card-content'>
                <div className='player-info'>
                    <img src={getImage(stats.Jugador)??nullPlayer} alt={stats.Jugador+" Image"} className={isNull?'empty-photo':''}/>
                </div>
                <PlayerStats stats={stats} totalStats={totalStats}/>
            </div>
        </Card>

        
    )
};

export default Player