import { matchData } from "../types"
import sansugusLogo from '../../img/sansugus-logo.svg'
import Date from './Date'

const sansugusName = "Sansugus FC"
const classGame = {
    "WON":"game-won",
    "LOST":"game-lost",
    "DRAW":"game-drawn"
}

const Game:React.FC<{game:matchData}> = ({game}) => {

    function checkWon(homeGoals:string,awayGoals:string):boolean{
        return homeGoals>awayGoals
    }

    function getClassGame(won:boolean,lost:boolean){
        if(won) return classGame["WON"]
        if(lost) return classGame["LOST"]
        return classGame["DRAW"]
    }

    let won = false
    let lost = false
    let local:string
    let away:string
    let gameClass:string
    
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

    gameClass = getClassGame(won,lost)

    function openGame(){
        if(game.Temporada!='21/22'&&game.Temporada!='22/23'){
            const match_id = game.ID_Partido;
            const url = 'Game?game=' + match_id;
            window.location.href = url;
        }
    }

    
    return (
        <div key={game.ID_Partido} className={'game-data '+gameClass} onClick={()=>openGame()}>
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
                                <div>{game.Temporada}</div>
                                {!game.Jugado && <div className="game-played">No Jugado</div>} 
                            </div>
                        </div>
                        <div className='game-name'>
                            {game.Visitante==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:<span>{game.Visitante}</span>}
                        </div>
        </div>
    )
}

export default Game;