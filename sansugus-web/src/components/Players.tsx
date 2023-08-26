import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { sheetResponseToObjects } from "../functions/sheets"
import { playerData } from "./types"
import Player from "./Player"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import '../styles/Players.css'
import { getImage } from "../rendering/players_img"
import EmptyPhoto from "../img/player.png"

const totalCell = 'Total'
const sheetName = "Estadísticas"
const link = "https://docs.google.com/spreadsheets/d/1oC9Iaba_OL_2BWSR0d-IZtrY0MSAynJRAW8jXixc70M/gviz/tq?"


function Players(){
    const [players,setPlayers]:any[]|playerData[]= useState([])
    const [isLoading, setIsLoading]:[boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [currentPlayer, setCurrentPlayer]:[playerData | undefined, Dispatch<SetStateAction<playerData | undefined>>] = useState()
    const [season, setSeason]:[string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState()
    const [totalStats, setTotalStats]:[playerData|undefined, Dispatch<SetStateAction<playerData|undefined>>] = useState()
    const [seasons, setSeasons]:any = useState()
    const [query, setQuery]: [string, Dispatch<SetStateAction<string>>] = useState('')
    const filteredPlayers:playerData[] = getFilteredPlayers()

    const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    }

    useEffect(() => {
        setIsLoading(true)
        const seasonQuery = "SELECT H, MAX(H) GROUP BY H"
        fetch(`${link}&tq=${seasonQuery}`)
        .then(res => res.text())
        .then(rep => {
            const data = sheetResponseToObjects(rep)
            setSeasons(data.map(obj => {
                return {
                Temporada: obj.Temporada
                };
            }))
        })
        .catch(err=>{
            console.error(err)
        })
    }, [])

    useEffect(() => {
        handleScrollToTop()
    }, [currentPlayer])

    useEffect(() => {
        if(!seasons) return
        if (seasons.length > 0) {
          setSeason(seasons[seasons.length - 1].Temporada);
        }
      }, [seasons]);
    

    useEffect(() => {
        if(!season) return
        setIsLoading(true)
        const query = `SELECT * WHERE H = '${season}'`
        fetch(`${link}&sheet=${sheetName}&tq=${query}`)
        .then(res => res.text())
            .then(rep => {
                const data = sheetResponseToObjects(rep)
                let totalValues = data.splice(data.findIndex(player=>player.Jugador===totalCell),1)[0]
                setTotalStats(totalValues)
                setPlayers(data)
            })
        .catch((err)=>{
            console.error(err)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }, [season])

    let empty = false

    function getPlayerImage(name:string){
        const image = getImage(name)
        if(!image){
            empty = true
            return EmptyPhoto
        }
        empty = false
        return image
    }

    function getFilteredPlayers(){
        if(!query || query==='') return players
        const filteredPlayers:playerData[] = []
        players.map((player:playerData) => {
            if(player.Jugador.toLowerCase().includes(query.toLowerCase())) filteredPlayers.push(player)
        })
        return filteredPlayers
    }
    
    return (
    <>
    { !currentPlayer && seasons &&
    <> 
        <header>
            <h1>Jugadores</h1>
        </header>
        <section className="players-controls">
            <div className="flex-column">
                <span>Buscar por nombre</span>
                <div className="search-bar">
                    <input type="text" placeholder="Nombre..." className="input-text" onChange={(e)=>setQuery(e.target.value)}/>
                    <div className="form-line"/>
                </div>
            </div>
            
            <div className="flex-column">
                <span>Temporada</span>
                <select onChange={(e)=> setSeason(e.target.value)} className="seasons-select" value={season  ?? seasons[seasons.length-1].Temporada}>
                    {seasons.map((seasonAux:any, index:number) => (
                        <option key={`season-${index}`} value={seasonAux.Temporada}>{seasonAux.Temporada}</option>
                    ))}
                </select>
            </div>
        </section>
        {
        <section className="players-list">
            { isLoading && <p>Cargando datos...</p> || filteredPlayers.length===0 && <p>No se ha encontrado al jugador</p>}
            {!isLoading && players && 
                filteredPlayers.map((player:playerData, index:number) => (
                    <div key={index} onClick={()=>setCurrentPlayer(player)} className="player-item">
                        <div className="player-description">
                            <div>{player.Jugador}</div>
                            
                        </div>
                        <img src={getPlayerImage(player.Jugador)} className={empty?'empty-photo':''}></img>
                    </div>
                ))
            }
        </section>
    }
    </>
    }
    { currentPlayer && totalStats &&
        <>
            
            <Player stats={currentPlayer} totalStats={totalStats} >
                <FontAwesomeIcon icon={faAngleLeft} size="xl" onClick={()=>setCurrentPlayer(undefined)} id="back-icon"></FontAwesomeIcon>
            </Player>
        </>
    }
    </>)
}

export default Players