

type circleStats = {
    goals:number,
    assists?:number,
    games:number
}

type progressBarParams = {
    stat: string,
    variable: number,
    totalVariable:number,
    percent:string
}

type playerData = {
    Jugador:string,
    Dorsal:string,
    Goles:number,
    Asistencias:number,
    Partidos:number,
    Amarillas:number,
    Rojas:number,
    Temporada:string,
    MVP:number,
}

export type {circleStats,progressBarParams,playerData}

