
type playerData = {
    ID:string,
    Jugador:string,
    Dorsal?:string,
    Goles:number,
    Asistencias?:number,
    Partidos:number,
    Amarillas:number,
    Rojas:number,
    Temporada:string,
    MVP?:number,
}

type gameData = {
    ID: number;
    Local: string;
    Visitante: string;
    Fecha: Date;
    'Goles Local': number;
    'Goles Visitante': number;
    Campo: number;
    Temporada: string;
    'Competición': string;
    Jornada: string;
    Jugado: boolean;
}

export type{
    playerData,gameData
}