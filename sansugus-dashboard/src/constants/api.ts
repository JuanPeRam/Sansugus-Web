import { EndPointFunction } from "@/types"

const api = 'http://localhost:3000'
const seasonsEndPoint = `${api}/seasons`

const playersEndPoint:EndPointFunction = (season:string) =>{
    const endPoint = 'players'
    console.log(getEndPointSeasonParam(season,endPoint))
    return getEndPointSeasonParam(season,endPoint)
}

const gamesEndPoint:EndPointFunction = (season:string) => {
    const endPoint = 'games'
    return getEndPointSeasonParam(season, endPoint)
}

const getEndPointSeasonParam = (season:string, point:string) => {
    const seasonSplited = season.split('/')
    return `${api}/${point}/${seasonSplited[0]}%2F${seasonSplited[1]}`
}
 
export {
    seasonsEndPoint,playersEndPoint,gamesEndPoint
}