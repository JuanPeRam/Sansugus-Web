import { TeamProps } from "@/interfaces/teamInterface"
import { NextMatchSkeleton } from "./NextMatchSkeleton"
import { getShieldImage } from "@/rendering/teams_img"
import { dateToString } from "@/functions/dates"


export const NextMatch: React.FC<TeamProps> = ({loading, error, result}) => {
  
  return (
    <>
      {
        loading && <NextMatchSkeleton />
      }

      {
        !loading && error && <div>Ha ocurrido un error</div>
      }

      {
        !loading && result &&
        <article className="flex flex-col justify-center items-center h-full p-6">
          <section className="grid sm:grid-cols-5 gap-2 w-full text-sm grid-cols-2 justify-center">
            <div className="flex justify-center items-center gap-2 text-sm col-span-2"><img src={getShieldImage(result.home_team)} className="h-20 min-w-fit"/>
            {result.home_team}</div>
            <div className="p-4 bg-primary/10 col-span-2 sm:col-span-1 w-fit m-auto">{result.hour}</div>
            <div className="flex justify-center items-center gap-2 text-sm col-span-2">{result.away_team}
            <img src={getShieldImage(result.away_team)} className="h-20"/></div>
          </section>
          <section className="text-gray-300 text-sm my-0 m-auto">
            <div>{result.stadium}</div>
            <div>{result.competition + " - "+result.field}</div>
            <div>{dateToString(result.date)}</div>
          </section>
        </article>
      }
      {
        !loading && !error && !result && <div className="min-h-[26vh] flex justify-center items-center">Por determinar...</div>
      }
    </>
  )
}
