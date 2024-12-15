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
import { useSearchParams } from "react-router-dom";

interface SeasonProps {
  onSeasonChange: (season: string) => void;
}
export const SeasonsSelect: React.FC<SeasonProps> = ({ onSeasonChange }) => {

  const [seasons, setSeasons]: any = useState()
  const [season, setSeason] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const setSeasonAsQueryParam = () => {
    setSeason(searchParams.get("season"));
  }

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
      .catch(err => {
        console.error(err)
      })
      .finally(() => setIsLoading(false))
    setSeasonAsQueryParam()
  }, [])

  useEffect(() => {
    if (!seasons) return
    if (seasons.length > 0 && !season) {
      handleSeasonChanged(seasons[seasons.length - 1].Temporada);
    }
  }, [seasons]);

  useEffect(() => {
    handleSeasonChanged(season);
  }, [season])

  useEffect(() => {
    if (searchParams.get("season") !== season) {
      setSeasonAsQueryParam();
    }
  }, [searchParams])

  const handleSeasonChanged = (season?: any) => {
    if (season) {
      onSeasonChange(season);
      setSearchParams({ season: season });
    }
  }


  return (
    <>
      {
        isLoading && <div>Cargando...</div>
      }
      {
        !isLoading && seasons && <Select
          onValueChange={setSeason}
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
