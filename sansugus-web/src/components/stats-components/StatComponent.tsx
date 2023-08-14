import { progressBarParams } from "../types"
import ProgressBar from "./ProgressBar"


const StatComponent: React.FC<{params:progressBarParams}> = ({params}) => {

    return (
        <>
            <div>{params.stat}</div>
                <div className='progress-comp'>
                    <div>{params.variable}</div>
                    <ProgressBar percent={params.percent}></ProgressBar>
                    <div>{params.totalVariable}</div>
            </div>
        </>    
    )
}

export default StatComponent
