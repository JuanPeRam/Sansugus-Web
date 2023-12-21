import { getCompetition } from "@/constants/api-links/competitionsLinks"
import useFetch from "@/hooks/useFetch"
import  RankingSkeleton  from "./RankingSkeleton"
import { teamData } from "@/types/competitionTypes"
import { getShieldImage } from "@/rendering/teams_img"
import { datosPrueba } from "@/aa/prueba"

export const Ranking = () => {

  //const {error,loading,result} = useFetch(`${getCompetition}Grupo C`)
  const loading = false
  const result:any = datosPrueba
  return (
    <table className="text-m w-full border-collapse ranking-table">
      <tr>
        <th>Pos</th>
        <th>Equipo</th>
        <th>Puntos</th>
      </tr>
      <tbody>
      {
        loading && <RankingSkeleton></RankingSkeleton>

      }
      {
        !loading && result && result.newStanding.map((team:teamData)=>(
          <tr key={team.teamName} className="p-2">
            <td>{team.position}</td>
            <td className="flex gap-x-1 items-center"><img src={getShieldImage(team.teamName)} className=''></img> <p className="text-left">{team.teamName}</p></td>
            <td>{team.points}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
