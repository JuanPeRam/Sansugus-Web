import { TeamProps } from "@/interfaces/teamInterface"
import { NextMatchSkeleton } from "./NextMatchSkeleton"
import { getShieldImage } from "@/rendering/teams_img"


export const NextMatch: React.FC<TeamProps> = ({loading, error, result}) => {

  const nextMatch = result?.next_match
  
  return (
    <>
      {
        loading && <NextMatchSkeleton />
      }

      {
        !loading && error && <div>Ha ocurrido un error</div>
      }

      {
        !loading && nextMatch &&
        <article className="flex flex-col justify-center items-center min-h-[26vh] p-6">
          <section className="flex gap-4 items-center flex-wrap justify-center">
            <div className="flex justify-center items-center gap-2"><img src={getShieldImage(nextMatch.home_team.team_name)} className="h-20 min-w-fit"/>
            {nextMatch.home_team.team_name}</div>
            <div className="max-[1250px]:hidden">-</div>
            <div className="flex justify-center items-center gap-2">{nextMatch.away_team.team_name}
            <img src={getShieldImage(nextMatch.away_team.team_name)} className="h-20"/></div>
          </section>
          <section className="text-gray-300 text-sm">
            <div>{nextMatch.lastResultTitle}</div>
            <div>{nextMatch.last_result_league}</div>
            <div>{nextMatch.lastResultDate}</div>
          </section>
        </article>
      }
      {
        !loading && !error && !nextMatch && <div>Por determinar...</div>
      }
    </>
  )
}
