import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { TableRowLoading } from './loading/TableRowLoading';
import { DataTableProps } from '@/types/dashboard';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const loadingRowsNumber = 10;

export const DataTable: React.FC<DataTableProps> = ({data,excludedRows,onDataChanged,isLoading,moreDetailsDir})=>{

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

  const handleInputChange = (value: string, index: number, field: string) => {
    const updatedData = [...data]
    updatedData[index][field] = value
    setDataState(updatedData)
    onDataChanged(updatedData)
  };

  const handleCheckBoxClick = (index:number, field:string) => {
    const updatedData = [...dataState];
    updatedData[index][field] = !updatedData[index][field]; // Invertir el valor del checkbox
    setDataState(updatedData);
    onDataChanged(updatedData);
  }
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
                      {
                        typeof dataRow[key] == 'boolean' ? 
                        <Checkbox checked={dataRow[key]} onClick={()=>{handleCheckBoxClick(index,key)}}
                        />
                        : 
                        <Input
                        type="text"
                        placeholder={key}
                        value={dataRow[key] ?? ''}
                        onChange={(event) => handleInputChange(event.target.value, index, key)}
                        className={`bg-secondary ${!isNaN(Number(dataRow[key])) ? 'w-[50px] text-center m-auto':''}`}
                        />
                      }
                    </td>
                  ))
                }
                { moreDetailsDir &&
                  <td className='p-2'><Button className='flex justify-center text-center items-center'>Ver detalles <ArrowRight className='h-5'></ArrowRight></Button></td>
                }
              </tr>
            ))}
          </tbody>
        </table>
    }
    </>)
    
}
