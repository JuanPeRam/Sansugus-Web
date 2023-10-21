import { emojis, matchPlayerInfo } from "../../types";

const StatsList: React.FC<{stats:matchPlayerInfo}> = ({stats}) => {

    const goals = stats.Goles
    const assists = stats.Asistencias
    const yellowCards = stats.Amarillas
    const redCards = stats.Rojas

    return (
        <>
                <div className="stat-info">
                    {goals>0 && <div>{emojis["Goals"]}</div>}
                    {goals>1 && <div className="number">{goals}</div>}
                </div>
                <div className="stat-info">
                    {assists>0 && <div>{emojis["Assists"]}</div>}
                    {assists>1 && <div className="number">{assists}</div>}
                </div>
                
                
                {yellowCards>0 && <div>{emojis["Yellow"]}</div>}
                {redCards>0 && <div>{emojis["Red"]}</div>}
        </>
    )
}

export default StatsList;