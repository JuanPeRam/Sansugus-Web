import {playerData} from '../types'
import '../../styles/PlayerStats.css'
import ProgressCircle from '../stats-components/ProgressCircle';
import StatComponent from '../stats-components/StatComponent';

function calculatePercent(number:number, totalNumber:number){
    return (number/totalNumber * 100).toFixed(2)
}

const PlayerStats: React.FC<{ stats: playerData, totalStats: playerData }> = ({ stats, totalStats }) => {

    const totalGoals:number = totalStats.Goles;
    const totalAssists:number = totalStats.Asistencias;
    const totalYellow:number = totalStats.Amarillas;
    const totalReds:number = totalStats.Rojas;
    const totalMvps:number = totalStats.MVP;
    const totalGames:number = totalStats.Partidos;

    const totalGoalsPercent = calculatePercent(stats.Goles,totalGoals)
    const totalAssistsPercent = calculatePercent(stats.Asistencias,totalAssists)
    const totalYellowsPercent = calculatePercent(stats.Amarillas,totalYellow)
    const totalRedsPercent = calculatePercent(stats.Rojas,totalReds)
    const totalMVPPercent = calculatePercent(stats.MVP,totalMvps)
    const totalGamesPercent = calculatePercent(stats.Partidos, totalGames)

    const matchPlayed = stats.Partidos>0

    return (
      <>
        <div className='progress-list'>
            <StatComponent params={{stat: 'Goles',variable:stats.Goles,totalVariable:totalGoals,percent:totalGoalsPercent}}></StatComponent>
            {totalAssists>0 && matchPlayed &&<StatComponent params={{stat: 'Asistencias',variable:stats.Asistencias,totalVariable:totalAssists,percent:totalAssistsPercent}}></StatComponent>}
            {totalYellow > 0 && matchPlayed && <StatComponent params={{stat: 'Amarillas',variable:stats.Amarillas,totalVariable:totalYellow,percent:totalYellowsPercent}}></StatComponent>}
            {totalReds>0 && matchPlayed && <StatComponent params={{stat: 'Rojas',variable:stats.Rojas,totalVariable:totalReds,percent:totalRedsPercent}}></StatComponent>}
            {totalMvps>0 && matchPlayed && <StatComponent params={{stat: 'MVPs',variable:stats.MVP,totalVariable:totalMvps,percent:totalMVPPercent}}></StatComponent>}
            {totalGames>0 && matchPlayed && <StatComponent params={{stat: 'Partidos',variable:stats.Partidos,totalVariable:totalGames,percent:totalGamesPercent}}></StatComponent>}
            <div className='average-stats'>
                <ProgressCircle stats={{goals: stats.Goles, games: stats.Partidos}}></ProgressCircle>
                <ProgressCircle stats={{goals: stats.Goles, assists: stats.Asistencias, games: stats.Partidos}}></ProgressCircle>
            </div>
            
        </div>
      </>
    );
  };

export default PlayerStats