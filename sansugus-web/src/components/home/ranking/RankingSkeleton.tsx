import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const RankingSkeleton = () => {
    const tSkeletonBody: React.ReactNode[] = [];

    for(let i=0;i<12;i++){
        tSkeletonBody.push(
            <tr key={i} className='py-6'>
                <td><Skeleton className='w-[15px] h-[15px] rounded-full m-auto'></Skeleton></td>
                <td className="flex gap-x-1 items-center w-full m-auto"><Skeleton className='w-[100px] h-[10px] m-auto'></Skeleton></td>
                <td className="max-[1250px]:hidden"><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
                <td className="max-[1250px]:hidden"><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
                <td className="max-[1250px]:hidden"><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
                <td className="max-[1250px]:hidden"><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
                <td className="max-[1250px]:hidden"><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
                <td className="max-[1250px]:hidden"><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
                <td><Skeleton className='w-[50px] h-[10px] m-auto'></Skeleton></td>
            </tr>
        )
    }

  return (
    <>
    
        {tSkeletonBody}

        </>
  )
}

export default RankingSkeleton
