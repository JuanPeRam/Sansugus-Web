import { TeamProps } from "@/interfaces/teamInterface"
import { LastMatchSkeleton } from "./LastMatchSkeleton"
import { getShieldImage } from "@/rendering/teams_img"

export const LastMatch: React.FC<TeamProps> = ({loading, error, result}) => {

  const last_result = result?.last_result
  return (
    <>
      {loading && <LastMatchSkeleton/>}
      {!loading && error && <div>Ha ocurrido un error</div>}
      {
        !loading && last_result && 
        <article className="flex flex-col justify-center items-center min-h-[45vh] p-6">
          <section className="flex gap-4 items-center flex-wrap justify-center">
            <div className="flex justify-center items-center gap-2">
              <img src={getShieldImage(last_result.home_team.team_name)} className="h-20 min-w-fit"/>
              <div>{last_result.home_team.team_name}</div>
            </div>
            <div className="p-5 border bg-[#2c2c2c] flex gap-2">
              <div>{last_result.result.goals_home}</div>
              <div>-</div>
              <div>{last_result.result.goals_away}</div>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div>{last_result.away_team.team_name}</div>
              <img src={getShieldImage(last_result.away_team.team_name)} className="h-20"/>
            </div>
          </section>
          <section className="text-gray-300 text-sm">
            <div>{last_result.lastResultTitle}</div>
            <div>{last_result.last_result_league}</div>
            <div>{last_result.lastResultDate}</div>
          </section>
        </article>
      }
    </>
  )
}
