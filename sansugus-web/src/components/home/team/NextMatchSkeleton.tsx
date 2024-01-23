import { Skeleton } from '@/components/ui/skeleton'

export const NextMatchSkeleton = () => {
  return (
    <article className="flex flex-col justify-center items-center min-h-[26vh] p-6">
          <section className="flex gap-4 items-center flex-wrap justify-center">
            <div className="flex justify-center items-center gap-2">
                <Skeleton className='w-[80px] h-[80px] m-auto rounded-full'></Skeleton>
                <Skeleton className='w-[100px] h-[20px] m-auto'></Skeleton>
            </div>
            <div className="max-[1250px]:hidden">-</div>
            <div className="flex justify-center items-center gap-2">
                <Skeleton className='w-[100px] h-[20px] m-auto'></Skeleton>
                <Skeleton className='w-[80px] h-[80px] m-auto rounded-full'></Skeleton>
            </div>
          </section>
          <section className="text-gray-300 text-sm flex flex-col gap-3">
            <div><Skeleton className='w-[100px] h-[20px] m-auto'></Skeleton></div>
            <div><Skeleton className='w-[100px] h-[20px] m-auto'></Skeleton></div>
            <div><Skeleton className='w-[100px] h-[20px] m-auto'></Skeleton></div>
          </section>
    </article>
  )
}
