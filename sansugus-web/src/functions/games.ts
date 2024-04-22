import { gameStatus } from "@/components/types";
import { genericTeamName } from "@/constants/ids";
import { Game } from "@/types/games";

const getGameStatus = (game:Game)=>{
    let status:gameStatus;
    let goals_scored
    let goals_conceeded
    if(game.home_team == genericTeamName){
        goals_scored = game.goals_home || 0
        goals_conceeded = game.goals_away || 0
    }
    else {
        goals_scored = game.goals_away || 0
        goals_conceeded = game.goals_home || 0
    }
    
    if(goals_scored > goals_conceeded) status ="Won";
    else if(goals_conceeded == goals_scored) status="Drawn";
    else status = 'Lost'
    return status 
}

export {
    getGameStatus
}