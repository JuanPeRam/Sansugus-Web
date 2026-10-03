import { emojis, matchPlayerInfo } from "../../types"
import StatsList from "./StatsList"


const BenchPlayers: React.FC<{playersInfo:Array<any> | null, isLoading:any}> = ({playersInfo,isLoading}) => {

    return (
        <>
            {!isLoading &&
                <section className="panel panel-accent w-full min-w-[250px] max-w-sm p-5">
                    <h3 className="section-title mb-4 text-2xl">Banquillo</h3>
                    <article className="flex flex-col divide-y divide-border">
                        {
                            playersInfo?.map((player: matchPlayerInfo) => (
                                <article key={player.Jugador} className="flex items-center gap-4 py-3">
                                    <div className="w-10 font-display text-3xl text-teamOrange">{player.Dorsal}</div>
                                    <div className="flex flex-1 items-center justify-between gap-2">
                                        <span className="font-display text-xl text-white">{player.Alias}</span>
                                        <div className="flex items-center gap-1">
                                            <StatsList stats={player} />
                                            {player.MVP && emojis['MVP']}
                                        </div>
                                    </div>
                                </article>
                            ))
                        }
                    </article>
                </section>
            }
        </>
    )
}

export default BenchPlayers
