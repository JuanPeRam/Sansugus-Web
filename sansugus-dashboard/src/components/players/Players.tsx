import { seasonsEndPoint } from "@/constants/api"
import { useState } from "react";
import { SeasonsSelect } from "../SeasonsSelect";
import { PlayersTable } from "./PlayersTable";
import { Separator } from "../ui/separator";
import { DialogSave } from "../DialogSave";


export const Players = () => {
  const [season, setSeason] = useState<string | undefined>()
  
  const handleSeasonChanged = (season:string) => {
    setSeason(season)
  }

  return (
    <section className="p-7 px-5 flex flex-col gap-2 w-3/5 m-auto">
      <article className="flex justify-between">
        <SeasonsSelect onSeasonChange={handleSeasonChanged} apiEndPoint={seasonsEndPoint}></SeasonsSelect>
        <DialogSave buttonText="Guardar cambios" confirmTrigger={()=>{}}/>
      </article>
      <Separator/>
      <article className="flex justify-center items-center">
      {
        season && <PlayersTable season={season}/>
      }
      </article>
    </section>
    
  )
}
