import RankingSkeleton from "./RankingSkeleton"
import { teamData } from "@/types/competitionTypes"
import { getShieldImage } from "@/rendering/teams_img"
import { competitionsLink } from "@/constants/data/sheetsData/competitions"
import { useEffect, useState } from "react"
import { sheetResponseToObjects } from "@/functions/sheets"
import { CompetitonResponse, getTeamCompetition, parseCompResponseToTeamData } from "@/constants/data/sheetsData/types"

export const Ranking = () => {

  const [loading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState()
  const [data, setData] = useState<teamData[]>([])

  useEffect(() => {
    setIsLoading(true)
    fetch(competitionsLink)
      .then(res => res.text())
      .then(rep => {
        const data: Array<CompetitonResponse> = sheetResponseToObjects(rep)
        const result = parseCompResponseToTeamData(data)
        const sansugusCompetition = getTeamCompetition('Sansugus FC', result)
        if (sansugusCompetition) setData(sansugusCompetition)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <table className="text-m w-full border-collapse ranking-table max-[1250px]:text-xs">
      <thead>
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
      <tbody>
        {
          loading && <RankingSkeleton></RankingSkeleton>

        }
        {
          !loading && error && <td>Ha ocurrido un error</td>
        }
        {
          !loading && data.length > 0 && data.map((team: teamData) => (
            <tr key={team.teamName} className={`${team.teamName === 'Sansugus FC' ? 'text-teamOrange bg-white/10' : ''}`}>
              <td>{team.position}</td>
              <td className="flex gap-x-1 mr-2 w-full items-center"><img src={getShieldImage(team.teamName)} className='h-7 w-7'></img> <p className="text-left text-ellipsis whitespace-nowrap flex-1 overflow-hidden">{team.teamName}</p></td>
              <td className="">{team.played}</td>
              <td className="max-[1250px]:hidden">{team.won}</td>
              <td className="max-[1250px]:hidden">{team.drawn}</td>
              <td className="max-[1250px]:hidden">{team.lost}</td>
              <td className="max-[1250px]:hidden">{team.goals}</td>
              <td className="max-[1250px]:hidden">{team.goalsAgainst}</td>
              <td className="max-[1250px]:table-cell hidden goals-difference">{team.goals + ':' + team.goalsAgainst}</td>
              <td className={`${team.teamName === 'Sansugus FC' ? 'text-teamOrange bg-white/20' : 'bg-[#c9c9c9] text-black'}`}>{team.points}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
