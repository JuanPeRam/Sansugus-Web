import RankingSkeleton from "./RankingSkeleton"
import { teamData } from "@/types/competitionTypes"
import { getShieldImage } from "@/rendering/teams_img"
import { fetchStandings } from "@/data/api"
import { useEffect, useState } from "react"

export const Ranking = () => {

  const [loading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState()
  const [data, setData] = useState<teamData[]>([])

  useEffect(() => {
    setIsLoading(true)
    fetchStandings()
      .then(setData)
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <table className="w-full border-collapse text-sm md:text-base">
      <thead className="bg-black font-display text-sm uppercase tracking-widest text-muted-foreground [&_th]:px-2 [&_th]:py-3">
        <tr>
          <th>Pos</th>
          <th>Equipo</th>
          <th className="">Partidos</th>
          <th className="max-[1250px]:hidden">PG</th>
          <th className="max-[1250px]:hidden">PE</th>
          <th className="max-[1250px]:hidden">PP</th>
          <th className="max-[1250px]:hidden">GF</th>
          <th className="max-[1250px]:hidden">GC</th>
          <th className="max-[1250px]:table-cell hidden px-2">G</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody className="[&_td]:px-2 [&_td]:py-2 [&_td]:text-center [&_tr]:border-t [&_tr]:border-border">
        {
          loading && <RankingSkeleton></RankingSkeleton>

        }
        {
          !loading && error && <tr><td colSpan={10}>Ha ocurrido un error</td></tr>
        }
        {
          !loading && !error && data.length === 0 && <tr><td colSpan={10} className="py-8 text-muted-foreground">Clasificación no disponible todavía</td></tr>
        }
        {
          !loading && data.length > 0 && data.map((team: teamData) => (
            <tr key={team.teamName} className={`${team.teamName === 'Sansugus FC' ? 'bg-teamOrange/10 font-bold text-teamOrange' : 'hover:bg-white/5'}`}>
              <td className="font-display text-lg">{team.position}</td>
              <td className="flex w-full min-w-[9rem] items-center gap-2"><img src={getShieldImage(team.teamName)} className='h-7 w-7 object-contain'></img> <p className="text-left text-ellipsis whitespace-nowrap flex-1 overflow-hidden">{team.teamName}</p></td>
              <td className="">{team.played}</td>
              <td className="max-[1250px]:hidden">{team.won}</td>
              <td className="max-[1250px]:hidden">{team.drawn}</td>
              <td className="max-[1250px]:hidden">{team.lost}</td>
              <td className="max-[1250px]:hidden">{team.goals}</td>
              <td className="max-[1250px]:hidden">{team.goalsAgainst}</td>
              <td className="hidden max-[1250px]:table-cell">{team.goals + ':' + team.goalsAgainst}</td>
              <td className={`${team.teamName === 'Sansugus FC' ? 'bg-teamOrange text-black font-extrabold' : 'font-bold text-white'}`}>{team.points}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
