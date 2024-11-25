import { matchData } from "../types"
import sansugusLogo from '../../img/sansugus-logo.svg'
import Date from './Date'
import { getTeamShield } from "../../rendering/teams_img"

const sansugusName = "Sansugus FC"
const classGame = {
    "WON":"game-won",
    "LOST":"game-lost",
    "DRAW":"game-drawn"
}

const Game:React.FC<{game:matchData}> = ({game}) => {

    function checkWon(homeGoals:string,awayGoals:string):boolean{
        return Number(homeGoals)>Number(awayGoals);
    }

    function isViewable() : boolean{
        let season = game['Temporada']
        return (season!='22/23'&&season!='21/22')
    }

    function getClassGame(won:boolean,lost:boolean){
        let gameClass:string = ''
        if(won) gameClass+=classGame["WON"]
        else if(lost) gameClass+=classGame["LOST"]
        else gameClass+=classGame["DRAW"]
        if(isViewable()) gameClass+=' viewable'
        return gameClass
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
            const match_id = game.ID_Partido;
            const url = 'Game?game=' + match_id;
            window.location.href = url;
    }

    
    return (
        <section key={game.ID_Partido} className={'game-data '+gameClass}>
                        <div className='game-name'>
                            {game.Local==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:(
                                <div
                                    dangerouslySetInnerHTML={{ __html: getTeamShield(game.Local) }}
                                />
                            )}
                        </div>
                        <div className="match-info">
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
                            {isViewable() && game.Jugado && <div className="more-info" onClick={()=>openGame()}>Ver acta {'>'}</div>}
                        </div>
                        <div className='game-name'>
                            {game.Visitante==='Sansugus FC'?<img src={sansugusLogo} alt='Logo Sansugus'/>:(
                                <div
                                dangerouslySetInnerHTML={{ __html: getTeamShield(game.Visitante) }}
                                />
                            )}
                        </div>
        </section>
    )
}

export default Game;