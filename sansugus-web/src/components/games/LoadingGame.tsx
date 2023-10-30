
import { Skeleton } from "../ui/skeleton";

const LoadingGame:React.FC<{}> = ({}) => {

    
    return (
        <section className='game-data game-drawn'>
                        <div className='game-name'>
                            <Skeleton className="w-[100px] h-[100px] rounded-full" />
                        </div>
                        <div className="match-info flex justify-center flex-col items-center">
                            <div className='game-result flex gap-3 items-center justify-center'>
                                <Skeleton className="w-[30px] h-[50px] rounded-full" />
                                - 
                                <Skeleton className="w-[30px] h-[50px] rounded-full" />
                            </div>
                            <div className='game-date'>
                                <Skeleton className="w-[100px] h-[20px]" />
                            </div>
                            <div className='game-props'>
                                <div className='game-comp'>
                                    <Skeleton className="w-[100px] h-[20px]" />
                                </div>
                                <div className='game-field'>
                                    <Skeleton className="w-[100px] h-[20px]" />
                                </div>
                                <div><Skeleton className="w-[100px] h-[20px]" /></div>
                                <div className="game-played"><Skeleton className="w-[100px] h-[22px]" /></div>
                                
                            </div>
                        </div>
                        <div className='game-name'>
                            <Skeleton className="w-[100px] h-[100px] rounded-full" />
                        </div>
        </section>
    )
}

export default LoadingGame;