type competition = {
    group:string,
    newStanding: Array<teamData>
}

type teamData = {
    position:number,
    teamShield:string,
    teamName:string,
    link:string,
    points:number,
    played:number,
    won:number,
    drawn:number,
    lost:number,
    goals:number,
    goalsAgainst:number,
    gd:string
}

export type{
    competition,teamData
}