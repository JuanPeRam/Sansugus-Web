import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";

const componentWidth = 'w-[140px]'

interface SeasonsSelectProps {
    onSeasonChange: (season: string) => void;
    apiEndPoint: string
}

type SeasonType = {
    Season: string
}

export const SeasonsSelect: React.FC<SeasonsSelectProps> = ({ onSeasonChange,apiEndPoint }) => {
    const [seasons, setSeasons] = useState<SeasonType[]>([]);
    const [error,setError] = useState<string | undefined>();
    const [loading,setLoading] = useState<boolean>(false);

    useEffect(()=>{
        setLoading(true)
        fetch(apiEndPoint).then((res)=>res.json()).then((data)=>setSeasons(data)).catch(err=>setError(err)).finally(()=>setLoading(false))
    },[])
    //const loading = true
    const handleSeasonChanged = (season:string)=>{
        onSeasonChange(season)
    }
  return (
    <>
        {
            loading && 
            <Skeleton className={`${componentWidth} h-10 rounded-sm`}/>
        }
        {
            !loading && seasons &&
            <Select onValueChange={handleSeasonChanged}>
                <SelectTrigger className={`${componentWidth}`}>
                    <SelectValue placeholder='Temporada'/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {seasons.map((season:any)=>(
                            <SelectItem value={season.id} key={season.id}>
                                {season.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        }
        {
            !loading && error && <div>Error...</div>
        }
    </>
  )
}
