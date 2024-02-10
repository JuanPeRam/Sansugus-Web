const api = 'http://localhost:3000'
const seasonsEndPoint = `${api}/seasons`
const playersEndPoint = (season:string) =>{
    const seasonSplited = season.split('/')
    return `${api}/players/${seasonSplited[0]}%2F${seasonSplited[1]}`
}

export {
    seasonsEndPoint,playersEndPoint
}