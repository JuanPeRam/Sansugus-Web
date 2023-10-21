import { getShirtImage } from "../../../rendering/shirts_img";
import { emojis, matchPlayerInfo } from "../../types";
import StatsList from "./StatsList";



const PlayerInfo: React.FC<{playerData:matchPlayerInfo}> = ({playerData}) => {
    const isMVP = playerData?.MVP

    return (
        <div className="player">
            <img src={getShirtImage(playerData.Jugador)} alt={playerData.Alias}/>
            
            <div className="field-stats">
                <StatsList stats={playerData}/>
            </div>
            {isMVP && <div className="MVP">{emojis["MVP"]}</div>}
        </div>
        
    )
}

export default PlayerInfo;