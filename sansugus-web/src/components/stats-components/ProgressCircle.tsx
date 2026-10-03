import { circleStats } from "../types"

const ProgressCircle: React.FC<{stats:circleStats}> = ({stats}) => {

    const avg = (stats.assists?(stats.goals+stats.assists)/stats.games:stats.goals/stats.games)
    const valid = isFinite(avg)
    return (
        <>
        {valid && <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-teamOrange bg-black">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stats.assists ? 'G+A/P' : 'G/P'}</div>
            <span className="font-display text-4xl text-white">{avg.toFixed(2)}</span>
        </div>}
        </>
    )
}

export default ProgressCircle
