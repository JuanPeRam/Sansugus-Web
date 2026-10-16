import { circleStats } from "../types"

const ProgressCircle: React.FC<{stats:circleStats}> = ({stats}) => {

    // Con asistencias (aunque sean 0) es G+A por partido; sin ellas, goles por partido
    const withAssists = stats.assists !== undefined
    const avg = withAssists ? (stats.goals + (stats.assists ?? 0)) / stats.games : stats.goals / stats.games
    const valid = isFinite(avg)
    return (
        <>
        {valid && <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-teamOrange bg-black">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{withAssists ? 'G+A/P' : 'G/P'}</div>
            <span className="font-display text-4xl text-white">{avg.toFixed(2)}</span>
        </div>}
        </>
    )
}

export default ProgressCircle
