import { matchData } from "../types"
import sansugusLogo from '../../img/sansugus-logo.svg'
import Date from './Date'

const sansugusName = "Sansugus FC"

const Game:React.FC<{game:matchData}> = ({game}) => {

    function checkWon(homeGoals:string,awayGoals:string):boolean{
        return homeGoals>awayGoals
    }

    let won = false
    let lost = false
    let local:string
    let away:string
    if(game.Local===sansugusName){
        local = game["Goles Local"]
        away = game["Goles Visitante"]
    }
    else{
        away = game["Goles Local"]
        local = game["Goles Visitante"]
    }

    won = checkWon(local,away)

    if(!won) lost=local!==away
    
    return (
        <div key={game.ID_Partido} className={won?'game-data game-won':'game-data game-drown'}>
                        <div className='game-name'>
                            {game.Local==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:<span>{game.Local}</span>}
                        </div>
                        <div>
                            <div className='game-result'>
                                {game['Goles Local']} - {game['Goles Visitante']}
                            </div>
                            <div className='game-date'>
                                {game.Fecha && <Date date={game.Fecha}></Date>}
                            </div>
                            <div className='game-props'>
                                <div className='game-comp'>
                                    {game.Competición} {game.Jornada}
                                </div>
                                {game.Campo && 
                                <div className='game-field'>
                                    Campo {game.Campo}
                                </div>}
                            </div>
                        </div>
                        <div className='game-name'>
                            {game.Visitante==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:<span>{game.Visitante}</span>}
                        </div>
        </div>
    )
}

export default Game;