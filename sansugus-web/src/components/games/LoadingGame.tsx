import { Skeleton } from "../ui/skeleton";

const GameCardSkeleton = () => {
  return (
    <article className="flex flex-col items-center justify-center  shadow-md overflow-hidden text-center w-full">
      <header className="flex justify-evenly items-center h-full w-full p-2 gap-2 bg-[hsl(var(--appcolor))] shadow-xl relative text-center text-secondary">
        <Skeleton className="w-40 h-3" />
        <Skeleton className="w-40 h-2" />
      </header>
      <div className="flex flex-col min-[450px]:flex-row p-5 items-center justify-center gap-5 w-full">
        <article className="h-36 flex flex-col justify-center items-center w-28 gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-7 h-6" />
        </article>
        <div className="h-28 flex flex-col justify-center items-center w-32 gap-4">
          <div className="text-center text-xs">
            <Skeleton className="w-16 h-3" />
          </div>
          <div className="flex justify-center items-center gap-3 text-xl font-bold relative">
            <Skeleton className="w-8 h-8 rounded-full" />
            -
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <div><Skeleton className="w-12 h-5 rounded-md" /></div>
          <div><Skeleton className="w-12 h-5 rounded-md" /></div>
        </div>
        <article className="h-36 flex flex-col justify-center items-center w-28 gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-7 h-6" />
        </article>
      </div>
    </article>
  );
};

export default GameCardSkeleton;
