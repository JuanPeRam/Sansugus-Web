import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

interface DataTableProps {
  data: any,
  excludedRows: string[],
  onDataChanged: (newData:any)=>void
}

export const DataTable: React.FC<DataTableProps> = ({data,excludedRows,onDataChanged})=>{

  const [dataState,setDataState]:any = useState()

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
        dataState && 
        <table className="border-collapse border w-full">
          <thead>
            <tr className="text-center">
                {Object.keys(dataState[0]).filter(key => !excludedRows.includes(key)).map((key: string) => (
                    <th className='p-2' key={key}>
                      {key}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {dataState.map((dataRow: any, index: number) => (
              <tr key={index} className="text-center border-t">
                {
                  Object.keys(dataRow).filter(key => !excludedRows.includes(key)).map((key:string)=>(
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
