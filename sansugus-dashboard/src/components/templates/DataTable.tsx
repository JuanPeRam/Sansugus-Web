import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { TableRowLoading } from '../players/loading/TableRowLoading';

interface DataTableProps {
  data: any,
  excludedRows?: string[],
  isLoading: boolean,
  onDataChanged: (newData:any)=>void
}
const loadingRowsNumber = 10;

export const DataTable: React.FC<DataTableProps> = ({data,excludedRows,onDataChanged,isLoading})=>{

  const [dataState,setDataState]:any = useState()
  const loadingRows:any = []

  if(dataState && dataState.length>0){
    for(let i=0;i<loadingRowsNumber;i++){
      loadingRows.push(<TableRowLoading numberOfColumns={Object.keys(dataState[0]).filter(key => !excludedRows?.includes(key)).length}></TableRowLoading>)
    }
  }
  
  useEffect(()=>{
    setDataState(data)
  },[data])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const updatedData = [...data]
    updatedData[index][field] = event.target.value;
    setDataState(updatedData)
    onDataChanged(updatedData)
  };
  return (
    <>
    {
        !dataState && <div>No hay datos para mostrar.</div>
    }
    {
        dataState && dataState.length>0 &&
        <table className="border-collapse border w-full">
          <thead>
            <tr className="text-center">
                {Object.keys(dataState[0]).filter(key => !excludedRows?.includes(key)).map((key: string) => (
                    <th className='p-2' key={key}>
                      {key}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {
              isLoading && loadingRows.length>0 && 
              <>
                {loadingRows}
              </>
            }
            {!isLoading && dataState.map((dataRow: any, index: number) => (
              <tr key={index} className="text-center border-t">
                {
                  Object.keys(dataRow).filter(key => !excludedRows?.includes(key)).map((key:string)=>(
                    <td className='p-2' key={key}>
                        <Input
                        type="text"
                        placeholder={key}
                        value={dataRow[key] ?? ''}
                        onChange={(event) => handleInputChange(event, index, key)}
                        className={`bg-secondary ${!isNaN(Number(dataRow[key])) ? 'w-[50px] text-center m-auto':''}`}
                        />
                    </td>
                  ))
                }
              </tr>
            ))}
          </tbody>
        </table>
    }
    </>)
    
}
