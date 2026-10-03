import { Skeleton } from "../ui/skeleton";

const LoadingGame: React.FC = () => (
    <section className='panel flex items-center justify-between gap-4 px-6 py-8'>
        <div className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-12 w-28" />
        <div className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
    </section>
)

export default LoadingGame;
