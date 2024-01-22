import {link} from './global'

const getTeam = (teamID:number)=>{
    return `${link}/team/${teamID}`
}

export {
    getTeam
}
