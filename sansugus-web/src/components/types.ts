type gameStatus = "Won" | "Drawn" | "Lost"

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

type matchPlayerInfo = {
    ID_Partido:string,
    Jugador:string,
    Titular:boolean,
    Posición:string,
    Goles:number,
    Asistencias:number,
    Amarillas:number,
    Rojas:number,
    MVP:boolean,
    Alias:string,
    Dorsal:number
}

export type {circleStats,progressBarParams,playerData,matchData,matchPlayerInfo,gameStatus}

export const link = 'https://docs.google.com/spreadsheets/d/1oC9Iaba_OL_2BWSR0d-IZtrY0MSAynJRAW8jXixc70M/gviz/tq?'

export const emojis = {
    "Goals":"⚽",
    "Assists":"🅰",
    "Yellow":"🟨",
    "Red":"🟥",
    "MVP":"⭐"
}


