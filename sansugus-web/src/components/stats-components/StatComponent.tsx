import { progressBarParams } from "../types"
import ProgressBar from "./ProgressBar"

const StatComponent: React.FC<{params:progressBarParams}> = ({params}) => {
    return (
        <div>
            <div className='mb-1 flex items-end justify-between'>
                <span className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>{params.stat}</span>
                <span className='font-display text-xl text-white'>
                    {params.variable}<span className='text-muted-foreground'> / {params.totalVariable}</span>
                </span>
            </div>
            <ProgressBar percent={params.percent}></ProgressBar>
        </div>
    )
}

export default StatComponent
