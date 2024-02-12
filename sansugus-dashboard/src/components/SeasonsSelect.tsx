import useFetch from "@/hooks/useFetch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";

const componentWidth = 'w-[140px]'

interface SeasonsSelectProps {
    onSeasonChange: (season: string) => void;
    apiEndPoint: string
}

export const SeasonsSelect: React.FC<SeasonsSelectProps> = ({ onSeasonChange,apiEndPoint }) => {
    const {loading,result,error} = useFetch(apiEndPoint);
    //const loading = true
    const handleSeasonChanged = (season:string)=>{
        onSeasonChange(season)
    }
  return (
    <>
        {
            loading && 
            <Skeleton className={`${componentWidth} h-12 rounded-sm`}/>
        }
        {
            !loading && result &&
            <Select onValueChange={handleSeasonChanged}>
                <SelectTrigger className={`${componentWidth}`}>
                    <SelectValue placeholder='Temporada'/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {result.map((season:any)=>(
                            <SelectItem value={season.Season} key={season.Season}>
                                {season.Season}
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
