import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { fetchSeasons } from "@/data/api";
import { useSearchParams } from "react-router-dom";

interface SeasonProps {
  onSeasonChange: (season: string) => void;
}
/** Temporada activa o, si ninguna está marcada, la más reciente */
const currentSeason = (seasons: any[]): string =>
  (seasons.find(s => s.activa) ?? seasons[seasons.length - 1]).Temporada

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
    fetchSeasons()
      .then(data => {
        setSeasons(data.map(obj => ({ Temporada: obj.name, activa: obj.active })))
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
      handleSeasonChanged(currentSeason(seasons));
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
          value={season ?? currentSeason(seasons)}
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
