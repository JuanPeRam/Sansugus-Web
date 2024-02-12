import React, { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { playersEndPoint } from '@/constants/api';
import { TableRowLoading } from './loading/TableRowLoading';
import { Input } from '../ui/input';
import { playerData } from '@/types/players';

interface PlayersTableProps {
  season: string;
}

export const PlayersTable: React.FC<PlayersTableProps> = ({ season }) => {
  // Estado local para los datos de los jugadores
  const [playersData, setPlayersData] = useState<playerData[]>([]);

  // Hook para obtener los datos de los jugadores
  const { result: fetchedPlayersData, error, loading: playersDataLoading } = useFetch(playersEndPoint(season));

  // Actualizar los datos de los jugadores cuando se obtienen de la API
  React.useEffect(() => {
    if (fetchedPlayersData) {
      setPlayersData(fetchedPlayersData);
    }
  }, [fetchedPlayersData]);

  // Función para manejar cambios en los inputs de los jugadores
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof playerData) => {
    const updatedPlayersData :any = [...playersData];
    updatedPlayersData[index][field] = event.target.value;
    setPlayersData(updatedPlayersData);
  };

  return (
    <table className="border-collapse border w-full">
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
        {!playersDataLoading && playersData && playersData.map((player: playerData, index: number) => (
          <tr key={index} className="text-center border-t">
            <td className="p-2">
              <Input
                type="text"
                placeholder="Jugador"
                value={player.Jugador}
                onChange={(event) => handleInputChange(event, index, 'Jugador')}
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Gol"
                value={player.Goles}
                onChange={(event) => handleInputChange(event, index, 'Goles')}
                className="w-[50px] text-center m-auto"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Asistencias"
                value={player.Asistencias}
                onChange={(event) => handleInputChange(event, index, 'Asistencias')}
                className="w-[50px] text-center m-auto"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Partidos"
                value={player.Partidos}
                onChange={(event) => handleInputChange(event, index, 'Partidos')}
                className="w-[50px] text-center m-auto"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Amarillas"
                value={player.Amarillas}
                onChange={(event) => handleInputChange(event, index, 'Amarillas')}
                className="w-[50px] text-center m-auto"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Rojas"
                value={player.Rojas}
                onChange={(event) => handleInputChange(event, index, 'Rojas')}
                className="w-[50px] text-center m-auto"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="MVP"
                value={player.MVP}
                onChange={(event) => handleInputChange(event, index, 'MVP')}
                className="w-[50px] text-center m-auto"
              />
            </td>
          </tr>
        ))}
         {
            playersDataLoading && 
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
  );
};
