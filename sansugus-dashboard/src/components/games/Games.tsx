import { useState } from "react"
import { SeasonsSelect } from "../SeasonsSelect"
import { seasonsEndPoint } from "@/constants/api"

export const Games = () => {
    const [season, setSeason] = useState<string | undefined>()
  
    const handleSeasonChanged = (season:string) => {
        setSeason(season)
    }
  return (
    <section className="p-7 px-5">
        <SeasonsSelect apiEndPoint={seasonsEndPoint} onSeasonChange={handleSeasonChanged}/>
    </section>
  )
}
