import { matchPlayerInfo } from "../../types"
import StatsList from "./StatsList"
import '../../../styles/game_stats/Bench.css'


const BenchPlayers: React.FC<{playersInfo:Array<any> | null, isLoading:any}> = ({playersInfo,isLoading}) => {

    return (
        <>
            {!isLoading && 
                <section className="bench-players">
                    <h3>Banquillo</h3>
                    <article className="bench-list">
                        {
                            playersInfo?.map((player:matchPlayerInfo)=>(
                                <article key={player.Jugador} className="bench-player">
                                    <div className="bench-number">{player.Dorsal}</div>
                                    <div className="bench-data">
                                        <div>{player.Alias}</div>
                                        <div className="bench-stats">
                                            <StatsList stats={player}/>
                                        </div>
                                    </div>
                                </article>    
                            ))
                        }
                    </article>
                </section>
            }
        </>
    )
}

export default BenchPlayers