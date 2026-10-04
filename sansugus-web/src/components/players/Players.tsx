import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { fetchPlayerStats } from "@/data/api"
import { playerData } from "../types"
import Player from "./Player"
import { ArrowLeft } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import PlayerCard from "./PlayerCard"
import { SeasonsSelect } from "../SeasonsSelect"


const Players = ()=> {
    const location = useLocation();
    const navigate = useNavigate();
    const [players,setPlayers]:any[]|playerData[]= useState([])
    const [isLoading, setIsLoading]:[boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [currentPlayer, setCurrentPlayer]:[playerData | undefined, Dispatch<SetStateAction<playerData | undefined>>] = useState()
    const [season, setSeason]:[string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState()
    const [totalStats, setTotalStats]:[playerData|undefined, Dispatch<SetStateAction<playerData|undefined>>] = useState()
    const [query, setQuery]: [string, Dispatch<SetStateAction<string>>] = useState('')
    const filteredPlayers:playerData[] = getFilteredPlayers()

    const handleSetCurrentPlayer = (playerId:playerData)=>{
        setCurrentPlayer(playerId)
        const params = new URLSearchParams(location.search);
        params.set('player', playerId.Jugador);
        navigate(`?${params.toString()}`);
    }

    const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const playerIdFromUrl = params.get('player');
        const playerFromUrl = players?.find((player:playerData) => player.Jugador === playerIdFromUrl);
        
        // Establecer el estado solo si hay un jugador en la URL
        if (playerFromUrl) {
          setCurrentPlayer(playerFromUrl);
        } else setCurrentPlayer(undefined)
      }, [location.search, players]);

    useEffect(() => {
        handleScrollToTop()
    }, [currentPlayer])
    

    useEffect(() => {
        if(!season) return
        setIsLoading(true)
        fetchPlayerStats(season)
            .then(({players, total}) => {
                setTotalStats(total)
                setPlayers(players)
            })
        .catch((err)=>{
            console.error(err)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }, [season])
    function getFilteredPlayers(){
        if(!query || query==='') return players
        const filteredPlayers:playerData[] = []
        players.map((player:playerData) => {
            if(player.Jugador.toLowerCase().includes(query.toLowerCase())) filteredPlayers.push(player)
        })
        return filteredPlayers
    }

    function goBack(){
        setCurrentPlayer(undefined)
        navigate(``);
    }
    
    return (
    <>
    { !currentPlayer &&
    <>
        <header className="page-hero">
            <div className="page-hero-inner">
                <span className="eyebrow">Primer equipo</span>
                <h1 className="page-title">La <em>plantilla</em></h1>
            </div>
        </header>
        <div className="page-container">
            <div className="panel mb-8 flex flex-wrap items-end justify-between gap-6 p-5">
                <label className="flex min-w-[14rem] flex-1 flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Buscar jugador</span>
                    <input
                        type="text"
                        placeholder="Nombre..."
                        className="h-10 border border-input bg-black px-3 text-white outline-none transition placeholder:text-muted-foreground focus:border-teamOrange"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
                <div className="flex w-40 flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Temporada</span>
                    <SeasonsSelect onSeasonChange={setSeason}/>
                </div>
            </div>
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading && <p className="col-span-full py-10 text-center text-muted-foreground">Cargando datos...</p>}
                {!isLoading && filteredPlayers.length === 0 && <p className="col-span-full py-10 text-center text-muted-foreground">No se ha encontrado al jugador</p>}
                {!isLoading && players &&
                    filteredPlayers.map((player:playerData, index:number) => (
                        <PlayerCard player={player} key={index} onclick={()=>handleSetCurrentPlayer(player)} />
                    ))
                }
            </section>
        </div>
    </>
    }
    { currentPlayer && totalStats &&
        <Player stats={currentPlayer} totalStats={totalStats} >
            <button onClick={()=>goBack()} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-teamOrange">
                <ArrowLeft size={18} /> Plantilla
            </button>
        </Player>
    }
    </>)
}

export default Players;
