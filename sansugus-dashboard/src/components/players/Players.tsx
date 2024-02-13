import { seasonsEndPoint } from "@/constants/api"
import { useRef, useState } from "react";
import { SeasonsSelect } from "../SeasonsSelect";
import { PlayersTable } from "./PlayersTable";
import { Separator } from "../ui/separator";
import { DialogSave } from "../DialogSave";
import { playerData } from "@/types/players";


export const Players = () => {
  const [season, setSeason] = useState<string | undefined>()
  const playersTableRef:any = useRef()
  
  const handleSeasonChanged = (season:string) => {
    setSeason(season)
  }

  const handleConfirm = () => {
    const editedRows : playerData[] = playersTableRef.current.getEditedRows()
    if(editedRows && editedRows.length>0){
      console.log('Updating rows to do')
      console.log(editedRows)
    }
    else {
      console.log('No rows to update')
    }
  }

  return (
    <section className="p-7 px-5 flex flex-col gap-2 w-3/5 m-auto">
      <article className="flex justify-between">
        <SeasonsSelect onSeasonChange={handleSeasonChanged} apiEndPoint={seasonsEndPoint}></SeasonsSelect>
        <DialogSave buttonText="Guardar cambios" confirmTrigger={handleConfirm}/>
      </article>
      <Separator/>
      <article className="flex justify-center items-center">
      {
        season && <PlayersTable season={season} ref={playersTableRef} />
      }
      {
        !season && <div>Selecciona una temporada</div>
      }
      </article>
    </section>
    
  )
}
