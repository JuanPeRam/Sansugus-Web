import { Game } from '@/types/games'
import { fetchSheetsData } from '../sheets/fetchData'
import {link} from '../sheetsData/global'
const sheetName = 'WebPartidos'
const NOT_DETERMINATED = 'N/D'

export const webgamesLink = `${link}&sheet=${sheetName}`

const isGamePlayed = (possibleResult:string)=>{
    return possibleResult.includes('()')
}

const getGamesArrayByResponse = (response:Array<{[key:string]:string}>)=>{
    const gamesArray: Game[] = []
    for(let i=0; i<response.length;i+=2){
        const firstPart = response[i]
        const secondPart = response[i+1]

        const splittedFirstPart = firstPart['A'].split('-');
        const competition = splittedFirstPart[0] + " - "+splittedFirstPart[1]
        const round = splittedFirstPart[2].trim()
        const splittedSecondPart = secondPart['B'].split("\n")
        const gamePlayed = isGamePlayed(splittedSecondPart[0])
        const dateSplitted = splittedSecondPart[1].split('-')[0].split('.')
        let dateString;
            try{
                dateString = dateSplitted[2].trim()+"-"+dateSplitted[1]+"-"+dateSplitted[0];
            } catch(error){
                dateString = NOT_DETERMINATED;
            }
            
        
        
        const date = new Date(dateString)
        let stadium;
        try{
            stadium = splittedSecondPart[1].split('-')[1].trim()
        } catch(error){
            stadium = NOT_DETERMINATED;
        }
        
        const field = splittedSecondPart[1].split('-')[2]
        let home_goals
        let away_goals
        let hour

        if(gamePlayed){
            home_goals = Number(splittedSecondPart[0].split('-')[0].replace('()',''))
            away_goals = Number(splittedSecondPart[0].split('-')[1].replace('()',''))
        } else{
            hour = splittedSecondPart[0]
        }

        const newGame:Game = {
            home_team: secondPart['A'],
            away_team: secondPart['C'],
            round: round,
            competition: competition,
            played: gamePlayed,
            date:date,
            stadium: stadium,
            field: field,
            goals_home: home_goals,
            goals_away: away_goals,
            hour: hour
        }

        gamesArray.push(newGame)
    }

    return gamesArray;
}

const getNextMatch = (games:Game[])=>{
    const upcomingMatches = games.filter(game => !game.played);
    upcomingMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 

    return upcomingMatches[0]
}

const getLastMatch = (games: Game[])=>{
    const playedMatches = games.filter(game => game.played);
    playedMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return playedMatches[0]
}

const fetchGames = async ()=>{
    const games = await fetchSheetsData(webgamesLink);
    const gamesArray = getGamesArrayByResponse(games)
    return gamesArray
}

export{
    fetchGames,getNextMatch,getLastMatch
}