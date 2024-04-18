type Game = {
    home_team: string,
    away_team: string,
    date: Date,
    competition: string,
    round: string,
    stadium: string,
    field: string,
    played: boolean,
    goals_home: number | undefined,
    goals_away: number | undefined,
    hour: string | undefined
}

export type{
    Game
}