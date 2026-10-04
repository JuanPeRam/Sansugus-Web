import { TeamProps } from "@/interfaces/teamInterface"
import { LastMatchSkeleton } from "./LastMatchSkeleton"
import { dateToString } from "@/functions/dates"
import { gameStatus } from "@/components/types"
import { getGameStatus } from "@/functions/games"
import { ConfettiButton } from "@/components/ui/ConfettiButton"
import { TeamBadge } from "./MatchBoard"

export const LastMatch: React.FC<TeamProps> = ({ loading, error, result }) => {
  let game_status: gameStatus = "Drawn"
  if (result) game_status = getGameStatus(result);

  return (
    <>
      {loading && <LastMatchSkeleton />}
      {!loading && error && <div className="p-8 text-center text-muted-foreground">Ha ocurrido un error</div>}
      {
        !loading && result &&
        <article className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <section className="flex w-full items-center justify-between gap-2">
            <TeamBadge name={result.home_team} />
            <div className="flex items-center gap-2 bg-black px-4 py-3 font-display text-5xl text-white md:text-6xl border border-border">
              <span>{result.goals_home}</span>
              <span className="text-teamOrange">-</span>
              <span>{result.goals_away}</span>
            </div>
            <TeamBadge name={result.away_team} />
          </section>
          <section className="text-center text-sm text-muted-foreground">
            <div className="font-bold uppercase tracking-widest text-teamOrange">{[result.competition, result.field].filter(Boolean).join(" · ")}</div>
            {result.stadium && <div>{result.stadium}</div>}
            <div className="first-letter:uppercase">{dateToString(result.date)}</div>
          </section>
          <section className="flex items-center justify-center">
            {game_status == 'Won' && <ConfettiButton text={"¡Victoria! 🎉"} />}
            {game_status == "Lost" && <h3 className="text-2xl text-red-500">Derrota</h3>}
            {game_status == "Drawn" && <h3 className="text-2xl text-white/70">Empate</h3>}
          </section>
        </article>
      }
      {
        !loading && !error && !result && <div className="flex min-h-[20rem] items-center justify-center text-muted-foreground">Por determinar...</div>
      }
    </>
  )
}
