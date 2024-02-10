import { seasonsEndPoint } from "@/constants/api"
import { useState } from "react";
import { SeasonsSelect } from "../SeasonsSelect";
import { PlayersTable } from "./PlayersTable";


export const Players = () => {
  const [season, setSeason] = useState<string | undefined>()
  
  const handleSeasonChanged = (season:string) => {
    setSeason(season)
  }

  return (
    <section className="p-7 px-5 flex flex-col gap-2">
      <SeasonsSelect onSeasonChange={handleSeasonChanged} apiEndPoint={seasonsEndPoint}></SeasonsSelect>
      <article className="flex border w-fit">
      {
        season && <PlayersTable season={season}/>
      }
      </article>
    </section>
    
  )
}
