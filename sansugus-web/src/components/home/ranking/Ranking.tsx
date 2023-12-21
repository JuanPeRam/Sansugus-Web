import { getCompetition } from "@/constants/api-links/competitionsLinks"
import useFetch from "@/hooks/useFetch"
import  RankingSkeleton  from "./RankingSkeleton"
import { teamData } from "@/types/competitionTypes"
import { getShieldImage } from "@/rendering/teams_img"
import { datosPrueba } from "@/aa/prueba"
import { faL } from "@fortawesome/free-solid-svg-icons"

export const Ranking = () => {

  //const {error,loading,result} = useFetch(`${getCompetition}Grupo C`)
  const loading = false
  const result:any = datosPrueba
  return (
    <table className="">
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
          <tr key={team.teamName}>
            <td>{team.position}</td>
            <td className="flex gap-x-5 items-center"><img src={getShieldImage(team.teamName)} className='w-5'></img> <p className="text-left">{team.teamName}</p></td>
            <td>{team.points}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}
