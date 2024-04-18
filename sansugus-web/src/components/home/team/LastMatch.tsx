import { TeamProps } from "@/interfaces/teamInterface"
import { LastMatchSkeleton } from "./LastMatchSkeleton"
import { getShieldImage } from "@/rendering/teams_img"
import { dateToString } from "@/functions/dates"

export const LastMatch: React.FC<TeamProps> = ({loading, error, result}) => {

  return (
    <>
      {loading && <LastMatchSkeleton/>}
      {!loading && error && <div>Ha ocurrido un error</div>}
      {
        !loading && result && 
        <article className="flex flex-col justify-center items-center h-full p-6">
          <section className="flex gap-4 items-center flex-wrap justify-center">
            <div className="flex justify-center items-center gap-2">
              <img src={getShieldImage(result.home_team)} className="h-20 min-w-fit"/>
              <div>{result.home_team}</div>
            </div>
            <div className="p-5 border bg-[#2c2c2c] flex gap-2">
              <div>{result.goals_home}</div>
              <div>-</div>
              <div>{result.goals_away}</div>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div>{result.away_team}</div>
              <img src={getShieldImage(result.away_team)} className="h-20"/>
            </div>
          </section>
          <section className="text-gray-300 text-sm">
            <div>{result.stadium}</div>
            <div>{result.competition +" - "+result.field}</div>
            <div>{dateToString(result.date)}</div>
          </section>
        </article>
      }
      {
        !loading && !error && !result && <div className="min-h-[45vh] flex justify-center items-center">Por determinar...</div>
      }
    </>
  )
}
