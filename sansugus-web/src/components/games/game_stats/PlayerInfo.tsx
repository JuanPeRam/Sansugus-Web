import { getShirtImage } from "../../../rendering/shirts_img";
import { emojis, matchPlayerInfo } from "../../types";
import LoadingPlayer from "./LoadingPlayer";
import StatsList from "./StatsList";
import { useState } from "react";



const PlayerInfo: React.FC<{playerData:matchPlayerInfo}> = ({playerData}) => {
    const isMVP = playerData?.MVP
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const img = new Image();
    img.src = getShirtImage(playerData.Jugador);
    img.onload = () => {
        setIsImageLoaded(true);
    };

    return (
        <div className="player">
            {
                isImageLoaded ? (
                <img src={getShirtImage(playerData.Jugador)} alt={playerData.Alias} loading='lazy'/>
                ):<LoadingPlayer/>
            }
            
            
            <div className="field-stats">
                <StatsList stats={playerData}/>
            </div>
            {isMVP && <div className="MVP">{emojis["MVP"]}</div>}
        </div>
        
    )
}

export default PlayerInfo;