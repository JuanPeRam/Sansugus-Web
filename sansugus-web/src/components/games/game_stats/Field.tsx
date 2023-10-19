import React from "react"
import { matchPlayerInfo } from "../../types"
import '../../../styles/game_stats/Field.css'
import { getShirtImage } from "../../../rendering/shirts_img"
import NullField from "./NullField"

const Field: React.FC<{playersInfo:Array<any> | null, isLoading:any}> = ({playersInfo,isLoading}) => {
    
    var attackers = new Array<any>
    var midfielders = new Array<any>
    var defenders = new Array<any>
    var goalkeeper: any= null
    playersInfo?.forEach((playerInfo:matchPlayerInfo)=>{
        
        switch(playerInfo.Posición){
            case 'Delantero':
                attackers.push(playerInfo)
                break
            case 'Medio':
                midfielders.push(playerInfo)
                break
            case 'Defensa':
                defenders.push(playerInfo)
                break
            case 'Portero':
                goalkeeper = playerInfo
                break
        }
        
    })
    

    return (
        <>
            <section className="field">
                {   !isLoading &&
                    <>
                    <div className="attackers row">
                        {
                            attackers.map((playerInfo:matchPlayerInfo)=>(
                                <div className="player" key={playerInfo.Jugador}>
                                    <img src={getShirtImage(playerInfo.Jugador)} alt={playerInfo.Alias}/>
                                </div>
                            ))
                        }
                    </div>
                    <div className="midfielders row">
                        {
                            midfielders.map((playerInfo:matchPlayerInfo)=>(
                                <div className="player" key={playerInfo.Jugador}>
                                    <img src={getShirtImage(playerInfo.Jugador)} alt={playerInfo.Alias}/>
                                </div>
                            ))
                        }
                    </div>
                    <div className="defenders row">
                        {
                            defenders.map((playerInfo:matchPlayerInfo)=>(
                                <div className="player" key={playerInfo.Jugador}>
                                    <img src={getShirtImage(playerInfo.Jugador)} alt={playerInfo.Alias}/>
                                </div>
                            ))
                        }
                    </div>
                    <div className="goalkeeper row">
                        <div className="player" key={goalkeeper?.Jugador}>
                            <img src={getShirtImage(goalkeeper?.Jugador)} alt={goalkeeper?.Alias}/>
                        </div>
                    </div>
                    </>
                }

                {isLoading &&
                <>
                    <NullField />
                </>}
                
            </section>
        </>
    )
}

export default Field;