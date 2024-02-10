import { playersEndPoint } from "@/constants/api"
import useFetch from "@/hooks/useFetch"
import { playerData } from "@/types/players"
import { TableRowLoading } from "./loading/TableRowLoading"

interface PlayersTableProps {
    season: string
}

export const PlayersTable : React.FC<PlayersTableProps> = ({ season }) => {
    const {result:players,error,loading} = useFetch(playersEndPoint(season))
  return (
    <table className="border-collapse">
        <thead>
          <tr className="text-center">
            <th className="p-2">Jugador</th>
            <th className="p-2">Goles</th>
            <th className="p-2">Asistencias</th>
            <th className="p-2">Partidos</th>
            <th className="p-2">Amarillas</th>
            <th className="p-2">Rojas</th>
            <th className="p-2">MVP</th>
          </tr>
        </thead>
        <tbody>
          {
            !loading && players && players.map((player:playerData) => (
              <tr key={player.Jugador} className="text-center border-t">
                <td className="p-2">{player.Jugador}</td>
                <td className="p-2">{player.Goles}</td>
                <td className="p-2">{player.Asistencias}</td>
                <td className="p-2">{player.Partidos}</td>
                <td className="p-2">{player.Amarillas}</td>
                <td className="p-2">{player.Rojas}</td>
                <td className="p-2">{player.MVP}</td>
              </tr>
            ))
          }
          {
            loading && 
            <>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
                <TableRowLoading/>
            </>
          }
          {
            error && <tr><td>Ha ocurrido un error</td></tr>
          }
        </tbody>
      </table>
  )
}
