import { getCompetition } from "@/constants/api-links/competitionsLinks"
import useFetch from "@/hooks/useFetch"
import  RankingSkeleton  from "./RankingSkeleton"
import { teamData } from "@/types/competitionTypes"
import { getShieldImage } from "@/rendering/teams_img"

export const Ranking = () => {

  const {error,loading,result} = useFetch(`${getCompetition}/Grupo C`)
  return (
    <table className="text-m w-full border-collapse ranking-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Equipo</th>
          <th className="max-[1250px]:hidden">Partidos</th>
          <th className="max-[1250px]:hidden">PG</th>
          <th className="max-[1250px]:hidden">PE</th>
          <th className="max-[1250px]:hidden">PP</th>
          <th className="max-[1250px]:hidden">GF</th>
          <th className="max-[1250px]:hidden">GC</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody>
      {
        loading && <RankingSkeleton></RankingSkeleton>

      }
      {
        !loading && error && <div>Ha ocurrido un error</div>
      }
      {
        !loading && result && result[0].newStanding.map((team:teamData)=>(
          <tr key={team.teamName} className="">
            <td>{team.position}</td>
            <td className="flex gap-x-1 items-center mr-2"><img src={getShieldImage(team.teamName)} className='h-7 w-7'></img> <p className="text-left text-ellipsis whitespace-nowrap text-sm">{team.teamName}</p></td>
            <td className="max-[1250px]:hidden">{team.played}</td>
            <td className="max-[1250px]:hidden">{team.won}</td>
            <td className="max-[1250px]:hidden">{team.drawn}</td>
            <td className="max-[1250px]:hidden">{team.lost}</td>
            <td className="max-[1250px]:hidden">{team.goals}</td>
            <td className="max-[1250px]:hidden">{team.goalsAgainst}</td>
            <td className="bg-[#c9c9c9] text-black">{team.points}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}