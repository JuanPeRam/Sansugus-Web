import { Skeleton } from "@/components/ui/skeleton"

type TableRowLoadingProps = {
  numberOfColumns: number
}

export const TableRowLoading:React.FC<TableRowLoadingProps> = ({numberOfColumns}) => {
  const columns = [];
  
  for (let i = 0; i < numberOfColumns; i++) {
    columns.push(
      <td key={i} className="p-2">
        <Skeleton className="rounded-sm h-[40px] margin-auto" />
      </td>
    );
  }
  
  return (
    <tr className="text-center border-t">
      {columns}
    </tr>
  );
}
