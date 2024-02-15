import { playersEndPoint, seasonsEndPoint } from "@/constants/api"
import { useEffect, useRef, useState } from "react";
import { SeasonsSelect } from "../SeasonsSelect";
import { PlayersTable } from "./PlayersTable";
import { Separator } from "../ui/separator";
import { DialogSave } from "../DialogSave";
import { playerData } from "@/types/players";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { DataTable } from "../templates/DataTable";


export const Players = () => {
  const [season, setSeason] = useState<string | undefined>()
  const playersTableRef:any = useRef()
  const {toast} = useToast();
  const [playersData, setPlayersData] = useState<playerData[]>();

  useEffect(()=>{
    if(season)
    {fetch(playersEndPoint(season)).then((res)=>res.json()).then((data)=>{ 
      setPlayersData(JSON.parse(JSON.stringify(data)))}).catch().finally()}
  },[season])
  
  const handleSeasonChanged = (season:string) => {
    setSeason(season)
  }

  const handleConfirm = () => {
    const editedRows : playerData[] = playersTableRef.current.getEditedRows()
    if(editedRows && editedRows.length>0){
      toast({
        title: "Actualizando los datos",
        description: "Espere por favor...",
        action: (
          <Loader2 className="animate-spin"></Loader2>
        )
      })
    }
    else {
      toast({
        title: "No hay cambios para guardar.",
        description: "Modifique los datos de la tabla para poder guardarlos.",
      })
      

    }
  }

  const onDataChanged = (newData:any)=>{
    setPlayersData(newData)
  }

  return (
    <section className="p-7 px-5 flex flex-col gap-2 w-11/12 m-auto">
      <article className="flex justify-between w-full">
        <SeasonsSelect onSeasonChange={handleSeasonChanged} apiEndPoint={seasonsEndPoint}></SeasonsSelect>
        {
          season && <DialogSave buttonText="Guardar cambios" confirmTrigger={handleConfirm}/>
        }
        
      </article>
      <Separator/>
      <article className="flex justify-center items-center flex-col">
      {
        season && <PlayersTable season={season} ref={playersTableRef} />
      }
      {
        playersData && <DataTable data={playersData} excludedRows={['ID','Temporada']} onDataChanged={onDataChanged}></DataTable>
      }
      {
        !season && <div>Selecciona una temporada</div>
      }
      </article>
    </section>
    
  )
}
