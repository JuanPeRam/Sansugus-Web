

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

type matchData = {
    ID_Partido:string,
    Local:string,
    Visitante:string,
    Fecha: Date | any,
    'Goles Local':string,
    'Goles Visitante':string,
    Campo: number,
    Temporada:string,
    Competición:string,
    Jornada:string,
    Jugado:boolean
}

export type {circleStats,progressBarParams,playerData,matchData}

