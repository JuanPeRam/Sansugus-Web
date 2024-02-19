import { TableDashboardProps } from "@/types/dashboard";
import { DialogSave } from "../DialogSave";
import { SeasonsSelect } from "../SeasonsSelect";
import { Separator } from "../ui/separator";
import { DataTable } from "./DataTable";

export const TableDashboard:React.FC<TableDashboardProps> = ({handleSeasonChanged,season,seasonsEndPoint,handleConfirm,tableProps}) => {

  const {data,isLoading,onDataChanged,excludedRows,moreDetailsDir} = tableProps;

  return (
    <section className="p-7 px-5 flex flex-col gap-2 w-11/12 m-auto">
      <article className="flex justify-between w-full">
        <SeasonsSelect onSeasonChange={handleSeasonChanged} apiEndPoint={seasonsEndPoint}></SeasonsSelect>
        {
          season && <DialogSave buttonText="Guardar cambios" confirmTrigger={handleConfirm}/>
        }
        
      </article>
      <Separator/>
      <article className="flex justify-center items-center flex-col">
      {
        data && <DataTable data={data} excludedRows={excludedRows} onDataChanged={onDataChanged} isLoading={isLoading} moreDetailsDir={moreDetailsDir}></DataTable>
      }
      {
        !season && <div>Selecciona una temporada</div>
      }
      </article>
    </section>
  )
}
