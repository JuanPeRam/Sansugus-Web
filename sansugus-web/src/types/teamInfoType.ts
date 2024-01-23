type teamInfo = {
    team_name: string,
    last_result : {
        last_result_league: string,
        lastResultTitle: string,
        lastResultDate: string,
        home_team: {
            logo: string,
            team_name: string
        },
        away_team: {
            logo: string,
            team_name:string
        },
        result: {
            goals_home: number,
            goals_away: number
        }
    },
    next_match : {
        last_result_league:string,
        lastResultTitle:string,
        lastResultDate:string,
        home_team: {
            logo: string,
            team_name: string
        },
        away_team: {
            logo: string,
            team_name:string
        },
    },
    team_leaderboard: [
        {
            name:string,
            goals:number,
            games:number,
            average:number
        }
    ],
    last_results:[
        {
            home_team: {
                logo: string,
                team_name: string
            },
            away_team: {
                logo: string,
                team_name:string
            },
            game_date:string,
            game_facility:string,
            game_field:string,
            goals_home:number,
            goals_away:number
        }
    ]
}