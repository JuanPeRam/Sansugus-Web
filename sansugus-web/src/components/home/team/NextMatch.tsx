import { TeamProps } from "@/interfaces/teamInterface"
import { NextMatchSkeleton } from "./NextMatchSkeleton"
import { dateToString } from "@/functions/dates"
import { TeamBadge } from "./MatchBoard"

export const NextMatch: React.FC<TeamProps> = ({ loading, error, result }) => {
  return (
    <>
      {loading && <NextMatchSkeleton />}
      {!loading && error && <div className="p-8 text-center text-muted-foreground">Ha ocurrido un error</div>}
      {
        !loading && result &&
        <article className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <section className="flex w-full items-center justify-between gap-2">
            <TeamBadge name={result.home_team} />
            <div className="bg-teamOrange px-4 py-3 font-display text-4xl text-black md:text-5xl" style={{ clipPath: 'polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)' }}>
              {result.hour ?? 'VS'}
            </div>
            <TeamBadge name={result.away_team} />
          </section>
          <section className="text-center text-sm text-muted-foreground">
            <div className="font-bold uppercase tracking-widest text-teamOrange">{result.competition + " · " + result.field}</div>
            <div>{result.stadium}</div>
            <div className="capitalize">{dateToString(result.date)}</div>
          </section>
        </article>
      }
      {
        !loading && !error && !result && <div className="flex min-h-[20rem] items-center justify-center text-muted-foreground">Por determinar...</div>
      }
    </>
  )
}
