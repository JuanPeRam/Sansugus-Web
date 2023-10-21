import { getShirtImage } from "../../../rendering/shirts_img";
import { matchPlayerInfo } from "../../types";

const emojis = {
    "Goals":"⚽",
    "Assists":"🅰",
    "Yellow":"🟨",
    "Red":"🟥",
    "MVP":"⭐"
}


const PlayerInfo: React.FC<{playerData:matchPlayerInfo}> = ({playerData}) => {
    
    const goals = playerData?.Goles
    const assists = playerData?.Asistencias
    const yellowCards = playerData?.Amarillas
    const redCards = playerData?.Rojas
    const isMVP = playerData?.MVP

    return (
        <div className="player">
            <img src={getShirtImage(playerData.Jugador)} alt={playerData.Alias}/>
            
            <div className="field-stats">
                <div className="stat-info">
                    {goals>0 && <div>{emojis["Goals"]}</div>}
                    {goals>1 && <div className="number">{goals}</div>}
                </div>
                <div className="stat-info">
                    {assists>0 && <div>{emojis["Assists"]}</div>}
                    {assists>1 && <div className="number">{assists}</div>}
                </div>
                
                
                {yellowCards>0 && <div>{emojis["Yellow"]}</div>}
                {redCards>0 && <div>{emojis["Red"]}</div>}
            </div>
            {isMVP && <div className="MVP">{emojis["MVP"]}</div>}
        </div>
        
    )
}

export default PlayerInfo;