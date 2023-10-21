import React from "react"
import { matchPlayerInfo } from "../../types"
import '../../../styles/game_stats/Field.css'
import NullField from "./NullField"
import PlayerInfo from "./PlayerInfo"

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
                {   !isLoading && playersInfo?.length!=0 &&
                    <>
                    <div className="attackers row">
                        {
                            attackers.map((playerInfo:matchPlayerInfo)=>(
                                <PlayerInfo playerData={playerInfo} key={playerInfo.Jugador}/>
                            ))
                        }
                    </div>
                    <div className="midfielders row">
                        {
                            midfielders.map((playerInfo:matchPlayerInfo)=>(
                                <PlayerInfo playerData={playerInfo} key={playerInfo.Jugador}/>
                            ))
                        }
                    </div>
                    <div className="defenders row">
                        {
                            defenders.map((playerInfo:matchPlayerInfo)=>(
                                <PlayerInfo playerData={playerInfo} key={playerInfo.Jugador}/>
                            ))
                        }
                    </div>
                    <div className="goalkeeper row">
                        <PlayerInfo playerData={goalkeeper} key={goalkeeper?.Jugador}/>
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