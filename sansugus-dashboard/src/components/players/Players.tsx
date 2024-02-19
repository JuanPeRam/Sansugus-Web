import { playersEndPoint, seasonsEndPoint } from "@/constants/api"
import { useEffect, useState } from "react";
import { playerData } from "@/types/players";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { TableDashboard } from "../templates/TableDashboard";


function getEditedRows(editedData: playerData[], originalData: playerData[]): playerData[] {
  const editedRows: playerData[] = [];
  // Iterar sobre cada objeto en editedData
  editedData.forEach(editedPlayer => {
    // Encontrar el jugador correspondiente en originalData
    const originalPlayer = originalData.find(player => player.ID === editedPlayer.ID);
    
    // Si no se encuentra el jugador en originalData o si algún campo es diferente, agregarlo a editedRows
    if (!originalPlayer || !comparePlayers(originalPlayer, editedPlayer)) {
      editedRows.push(editedPlayer);
    }
  });

  return editedRows;
}

function comparePlayers(playerA: playerData, playerB: playerData): boolean {
  return (
    playerA.Jugador === playerB.Jugador &&
    playerA.Dorsal === playerB.Dorsal &&
    playerA.Goles === playerB.Goles &&
    playerA.Asistencias === playerB.Asistencias &&
    playerA.Partidos === playerB.Partidos &&
    playerA.Amarillas === playerB.Amarillas &&
    playerA.Rojas === playerB.Rojas &&
    playerA.Temporada === playerB.Temporada &&
    playerA.MVP === playerB.MVP
  );
}

export const Players = () => {
  const [season, setSeason] = useState<string | undefined>()
  const {toast} = useToast();
  const [playersData, setPlayersData] = useState<playerData[]>([]);
  const [rawData, setRawData] = useState<playerData[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(()=>{
    if(season)
    {
      setIsLoading(true)
      fetch(playersEndPoint(season)).then((res)=>res.json()).then((data)=>{setRawData(data) 
        setPlayersData(JSON.parse(JSON.stringify(data)))}).catch((error)=>setError(error)).finally(()=>setIsLoading(false))
    }
  },[season])
  
  const handleSeasonChanged = (season:string) => {
    setSeason(season)
  }

  const handleConfirm = () => {
    const editedRows : any[] = getEditedRows(playersData,rawData)
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
    <>
      <TableDashboard data={playersData} excludedRows={['ID','Temporada']} handleConfirm={handleConfirm} season={season} handleSeasonChanged={handleSeasonChanged}
      onDataChanged={onDataChanged} seasonsEndPoint={seasonsEndPoint} isLoading={loading}/>
    </>
  )
}
