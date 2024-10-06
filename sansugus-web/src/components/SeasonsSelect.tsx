import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { link } from "./types";
import { sheetResponseToObjects } from "@/functions/sheets";

interface SeasonProps {
    onSeasonChange: (season: string) => void;
}
export const SeasonsSelect : React.FC<SeasonProps> = ({onSeasonChange}) => {

    const [seasons, setSeasons]:any = useState()
    const [season, setSeason] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true)
        const seasonQuery = "SELECT H, MAX(H) GROUP BY H"
        fetch(`${link}&tq=${seasonQuery}`)
        .then(res => res.text())
        .then(rep => {
            const data = sheetResponseToObjects(rep)
            setSeasons(data.map(obj => {
                return {
                Temporada: obj.Temporada
                };
            }))
        })
        .catch(err=>{
            console.error(err)
        })
        .finally(()=> setIsLoading(false))
    }, [])

    useEffect(() => {
      if(!seasons) return
      if (seasons.length > 0) {
        onSeasonChange(seasons[seasons.length-1].Temporada);
        setSeason(seasons[seasons.length - 1].Temporada);
      }
    }, [seasons]);


  return (
    <>
    {
      isLoading && <div>Cargando...</div>
    }
    {
      !isLoading && seasons && <Select
      onValueChange={(e: any) => {
        onSeasonChange(e);
        setSeason(e);
      }}
      value={season ?? seasons[seasons.length - 1].Temporada}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((seasonAux: any, index: number) => (
          <SelectItem key={`season-${index}`} value={seasonAux.Temporada}>
            {seasonAux.Temporada}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    }
    </>
  );
};
