import { getCompetition } from "@/constants/api-links/competitionsLinks"
import useFetch from "@/hooks/useFetch"
import  RankingSkeleton  from "./RankingSkeleton"
import { teamData } from "@/types/competitionTypes"
import { getShieldImage } from "@/rendering/teams_img"
import { datosPrueba } from "@/aa/prueba"

export const Ranking = () => {

  const {error,loading,result} = useFetch(`${getCompetition}/Grupo C`)
  return (
    <table className="text-m w-full border-collapse ranking-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Equipo</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody>
      {
        loading && <RankingSkeleton></RankingSkeleton>

      }
      {
        !loading && result && result[0].newStanding.map((team:teamData)=>(
          <tr key={team.teamName} className="">
            <td>{team.position}</td>
            <td className="flex gap-x-1 items-center"><img src={getShieldImage(team.teamName)} className='h-7 w-7'></img> <p className="text-left text-ellipsis whitespace-nowrap">{team.teamName}</p></td>
            <td>{team.points}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
