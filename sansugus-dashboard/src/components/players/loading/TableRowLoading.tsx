import { Skeleton } from "@/components/ui/skeleton"

export const TableRowLoading = () => {
  return (
    <tr className="text-center border-t">
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
        <td className="p-2"><Skeleton className="rounded-sm h-[20px] margin-auto"/></td>
    </tr>
  )
}
