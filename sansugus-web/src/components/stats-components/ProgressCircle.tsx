import { circleStats } from "../types"
import '../../styles/ProgressCircle.css'


const ProgressCircle: React.FC<{stats:circleStats}> = ({stats}) => {

    const avg = (stats.assists?(stats.goals+stats.assists)/stats.games:stats.goals/stats.games)
    const infinite = (avg!==Infinity)
    return (
        <>
        {infinite && <div className="circle">
            {stats.assists?
            <>
                <div>G+A/P</div>
                <span>{avg.toFixed(2)}</span>
            </>
            :
            <>
                <div>G/P</div>
                <span>{avg.toFixed(2)}</span>
            </>}
        </div>
        }
        </>
    )
}

export default ProgressCircle

    