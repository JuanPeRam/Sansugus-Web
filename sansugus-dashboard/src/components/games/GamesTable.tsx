import { useEffect, useState } from "react"
import { gamesEndPoint, seasonsEndPoint } from "@/constants/api"
import { TableDashboard } from "../templates/TableDashboard"
import { useToast } from "../ui/use-toast"
import { gameData } from "@/types/objects"
import { Loader2 } from "lucide-react"

const excludedRows = ['ID','Temporada','Fecha','Campo']

function getEditedRows(editedData: gameData[], originalData: gameData[]): gameData[] {
    const editedRows: gameData[] = [];
    editedData.forEach(editedGame => {
      const originalGame = originalData.find(game => game.ID === editedGame.ID);
      
      if (!originalGame || !compareGames(originalGame, editedGame)) {
        editedRows.push(editedGame);
      }
    });
  
    return editedRows;
  }
  
  function compareGames(gameA: gameData, gameB: gameData): boolean {
    return (
        gameA.ID === gameB.ID &&
        gameA.Local === gameB.Local &&
        gameA.Visitante === gameB.Visitante &&
        gameA.Fecha === gameB.Fecha &&
        gameA['Goles Local'] === gameB['Goles Local'] &&
        gameA['Goles Visitante'] === gameB['Goles Visitante'] &&
        gameA.Campo === gameB.Campo &&
        gameA.Temporada === gameB.Temporada &&
        gameA['Competición'] === gameB['Competición'] &&
        gameA.Jornada === gameB.Jornada &&
        gameA.Jugado === gameB.Jugado
    );
  }

export const GamesTable = () => {
    const [season, setSeason] = useState<string | undefined>()
    const {toast} = useToast();
    const [gamesData, setGamesData] = useState<gameData[]>([]);
    const [rawData, setRawData] = useState<gameData[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(!season) return
        // Al cambiar de temporada se cancela la petición anterior (no pisa los datos nuevos)
        const controller = new AbortController()
        setIsLoading(true)
        fetch(gamesEndPoint(season), { signal: controller.signal }).then((res)=>res.json()).then((data)=>{setRawData(data) 
            setGamesData(structuredClone(data))})
            .catch((error)=>{ if (!controller.signal.aborted) setError(error) })
            .finally(()=>{ if (!controller.signal.aborted) setIsLoading(false) })
        return () => controller.abort()
    },[season])
    
    const handleSeasonChanged = (season:string) => {
        setSeason(season)
    }

    const handleConfirm = () => {
        const editedRows : any[] = getEditedRows(gamesData,rawData)
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
        setGamesData(newData)
    }
    return (
        <>
        {error && <div>Ha ocurrido un error</div>}
        <TableDashboard season={season} handleSeasonChanged={handleSeasonChanged} handleConfirm={handleConfirm} seasonsEndPoint={seasonsEndPoint}
        tableProps={{data: gamesData,isLoading: loading,onDataChanged: onDataChanged,excludedRows: excludedRows, moreDetailsDir: '/game'}}/>
        </>
    )
}
