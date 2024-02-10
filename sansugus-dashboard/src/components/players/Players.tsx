import { seasonsEndPoint, playersEndPoint } from "@/constants/api"
import { useEffect, useState } from "react";
import { SeasonsSelect } from "../SeasonsSelect";
import { playerData } from "@/types/players";
import useFetch from "@/hooks/useFetch";


export const Players = () => {
  const [season, setSeason] = useState<string | undefined>()
  const [players, setPlayers] = useState< playerData[] | undefined>()

  

  useEffect(()=>{
    if(season){
      fetch(playersEndPoint(season)).then((data) => data.json()).then((data)=>setPlayers(data))
    }
  },[season])
  
  const handleSeasonChanged = (season:string) => {
    setSeason(season)
  }

  return (
    <section className="p-7 px-5">
      <SeasonsSelect onSeasonChange={handleSeasonChanged} apiEndPoint={seasonsEndPoint}></SeasonsSelect>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Goles</th>
            <th>Asistencias</th>
            <th>Partidos</th>
            <th>Amarillas</th>
            <th>Rojas</th>
            <th>MVP</th>
          </tr>
        </thead>
        <tbody>
          {
            players && players.map((player:playerData) => (
              <tr key={player.Jugador}>
                <td>{player.Jugador}</td>
                <td>{player.Goles}</td>
                <td>{player.Asistencias}</td>
                <td>{player.Partidos}</td>
                <td>{player.Amarillas}</td>
                <td>{player.Rojas}</td>
                <td>{player.MVP}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </section>
    
  )
}
