import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { playersEndPoint } from '@/constants/api';
import { TableRowLoading } from '../templates/loading/TableRowLoading';
import { Input } from '../ui/input';
import { playerData } from '@/types/objects';

interface PlayersTableProps {
  season: string;
}

function getEditedRows(editedData: playerData[], originalData: playerData[]): playerData[] {
  const editedRows: playerData[] = [];
  // Iterar sobre cada objeto en editedData
  editedData.forEach(editedPlayer => {
    // Encontrar el jugador correspondiente en originalData
    const originalPlayer = originalData.find(player => player.ID === editedPlayer.ID);
    
    // Si no se encuentra el jugador en originalData o si algún campo es diferente, agregarlo a editedRows
    if (!originalPlayer || !comparePlayers(originalPlayer, editedPlayer)) {
      editedRows.push(editedPlayer);
    }
  });

  return editedRows;
}

// Función para comparar dos objetos playerData y verificar si tienen algún campo diferente
function comparePlayers(playerA: playerData, playerB: playerData): boolean {
  return (
    playerA.Jugador === playerB.Jugador &&
    playerA.Dorsal === playerB.Dorsal &&
    playerA.Goles === playerB.Goles &&
    playerA.Asistencias === playerB.Asistencias &&
    playerA.Partidos === playerB.Partidos &&
    playerA.Amarillas === playerB.Amarillas &&
    playerA.Rojas === playerB.Rojas &&
    playerA.Temporada === playerB.Temporada &&
    playerA.MVP === playerB.MVP
  );
}

export const PlayersTable = forwardRef ( (props: PlayersTableProps, ref: ForwardedRef<unknown>) => {
  useImperativeHandle(ref, ()=>{
    return {
      getEditedRows: testEditedRows
    }
  })
  // Estado local para los datos de los jugadores
  const [playersData, setPlayersData] = useState<playerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [fetchedPlayersData, setFetchedPlayersData] = useState<playerData[]>([]);
  const [error,setError] = useState();

  useEffect(()=>{
    setIsLoading(true)
    fetch(playersEndPoint(props.season)).then((res)=>res.json()).then((data)=>{setFetchedPlayersData(data) 
      setPlayersData(JSON.parse(JSON.stringify(data)))}).catch((error)=>setError(error)).finally(()=>setIsLoading(false))
  },[props.season])

  const testEditedRows = ()=>{
    const editedRows = getEditedRows(playersData,fetchedPlayersData)
    return editedRows;
  }

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
        {!isLoading && playersData && playersData.map((player: playerData, index: number) => (
          <tr key={index} className="text-center border-t">
            <td className="p-2">
              <Input
                type="text"
                placeholder="Jugador"
                value={player.Jugador}
                onChange={(event) => handleInputChange(event, index, 'Jugador')}
                className='bg-secondary'
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Gol"
                value={player.Goles}
                onChange={(event) => handleInputChange(event, index, 'Goles')}
                className="w-[50px] text-center m-auto bg-secondary"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Asistencias"
                value={player.Asistencias ?? ''}
                onChange={(event) => handleInputChange(event, index, 'Asistencias')}
                className="w-[50px] text-center m-auto bg-secondary"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Partidos"
                value={player.Partidos}
                onChange={(event) => handleInputChange(event, index, 'Partidos')}
                className="w-[50px] text-center m-auto bg-secondary"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Amarillas"
                value={player.Amarillas}
                onChange={(event) => handleInputChange(event, index, 'Amarillas')}
                className="w-[50px] text-center m-auto bg-secondary"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="Rojas"
                value={player.Rojas}
                onChange={(event) => handleInputChange(event, index, 'Rojas')}
                className="w-[50px] text-center m-auto bg-secondary"
              />
            </td>
            <td className="p-2">
              <Input
                type="text"
                placeholder="MVP"
                value={player.MVP ?? ''}
                onChange={(event) => handleInputChange(event, index, 'MVP')}
                className="w-[50px] text-center m-auto bg-secondary"
              />
            </td>
          </tr>
        ))}
         {
            isLoading && 
            <>
                <TableRowLoading numberOfColumns={2}/>
            </>
          }
          {
            error && <tr><td>Ha ocurrido un error</td></tr>
          }
      </tbody>
    </table>
  );
});
