import { TeamProps } from "@/interfaces/teamInterface"
import { LastMatchSkeleton } from "./LastMatchSkeleton"
import { getShieldImage } from "@/rendering/teams_img"
import { dateToString } from "@/functions/dates"
import { gameStatus } from "@/components/types"
import { getGameStatus } from "@/functions/games"
import {ConfettiButton} from "@/components/ui/ConfettiButton"


export const LastMatch: React.FC<TeamProps> = ({loading, error, result}) => {
  let game_status:gameStatus = "Drawn"
  if(result) game_status = getGameStatus(result);

  return (
    <>
      {loading && <LastMatchSkeleton/>}
      {!loading && error && <div>Ha ocurrido un error</div>}
      {
        !loading && result && 
        <article className="flex flex-col justify-center items-center h-full p-6">
          <section className="flex-1 flex items-center justify-center flex-col">
            <section className="grid sm:grid-cols-5 gap-2 w-full text-sm grid-cols-2 justify-center place-content-center">
              <div className="flex justify-center items-center gap-2 col-span-2">
                <img src={getShieldImage(result.home_team)} className="h-20 min-w-fit"/>
                <div>{result.home_team}</div>
              </div>
              <div className="border bg-[#2c2c2c] flex gap-2 col-span-2 sm:col-span-1 items-center justify-center rounded-xl m-auto p-5 border-white/20">
                <div>{result.goals_home}</div>
                <div>-</div>
                <div>{result.goals_away}</div>
              </div>
              <div className="flex justify-center items-center gap-2 col-span-2">
                <div>{result.away_team}</div>
                <img src={getShieldImage(result.away_team)} className="h-20"/>
              </div>
            </section>
            <section className="text-gray-300 text-sm h-fit">
              <div>{result.stadium}</div>
              <div>{result.competition +" - "+result.field}</div>
              <div>{dateToString(result.date)}</div>
            </section>
          </section>
          
          <section className="h-fit items-center flex justify-center">
            {
              game_status == 'Won' && 
              <>
                <ConfettiButton text={"Victoria !!!! 🎉🎉🎉"}></ConfettiButton>
              </>
            }
            {
              game_status == "Lost" && <h3 className="text-xl hover:cursor-pointer" onClick={()=>undefined}>Derrota 😢😢😢</h3>
            }
            {
              game_status == "Drawn" && <h3 className="text-xl hover:cursor-pointer" onClick={()=>undefined}>Empate 😶😶😶</h3>
            }
          </section>
        </article>
      }
      {
        !loading && !error && !result && <div className="min-h-[45vh] flex justify-center items-center">Por determinar...</div>
      }
    </>
  )
}
