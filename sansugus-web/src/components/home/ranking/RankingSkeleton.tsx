import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const RankingSkeleton = () => {
    const tSkeletonBody: React.ReactNode[] = [];

    for(let i=0;i<12;i++){
        tSkeletonBody.push(
            <tr key={i} className='my-6'>
                <td><Skeleton className='w-[20px] h-[20px] rounded-full'></Skeleton></td>
                <td><Skeleton className='w-[100px] h-[20px]'></Skeleton></td>
                <td><Skeleton className='w-[100px] h-[20px]'></Skeleton></td>
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
