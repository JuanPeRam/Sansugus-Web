import React,{useState,useEffect} from "react";
import Field from "./Field";
import {link, matchData} from '../../types'
import { sheetResponseToObjects } from "../../../functions/sheets";
import BenchPlayers from "./BenchPlayers";

const sheetName = 'Actas'

const GameData: React.FC<{}> = ({}) => {

    const queryParameters = new URLSearchParams(window.location.search)
    const game = queryParameters.get("game")
    const [isLoading,setIsLoading] = useState(false)
    const [gameDataLoading, setGameDataLoading] = useState(false)
    const [gameData, setGameData] = useState<matchData[] | undefined>()
    const [playersInfo,setPlayersInfo] : any = useState(null)
    const [startingSeven, setStartingSeven] : any = useState(null)
    const [benchPlayers, setBenchPlayers] : any = useState(null)

    function getOpponentName():string{
        if(!gameData) return '';
        if(!(gameData[0].Local==='Sansugus FC')) return gameData[0].Local
        else return gameData[0].Visitante
    }

    useEffect(() => {
        setIsLoading(true)
        const query = `SELECT * WHERE A = '${game}'`
        fetchGame(query)
        fetch(`${link}&sheet=${sheetName}&tq=${query}`)
        .then(res => res.text())
        .then(rep => {
            const data = sheetResponseToObjects(rep)
            setPlayersInfo(data);
        })
        .catch(err=>{
            console.error(err)
        })
        .finally(()=>{
            setIsLoading(false)
        }
        )
    }, [])

    function fetchGame(query:string) {
        const sheet = 'Partidos'
        setGameDataLoading(true)
        fetch(`${link}&sheet=${sheet}&tq=${query}`)
        .then(res => res.text())
        .then(rep => {
            const data = sheetResponseToObjects(rep)
            setGameData(data);
        })
        .catch(err=>{
            console.error(err)
        })
        .finally(()=>{
            setGameDataLoading(false)
        }
        )
    }
        

    useEffect(()=>{
        if(playersInfo!=null){
            var players:Array<any> = new Array<any>
            var bench:Array<any> = new Array<any>
            playersInfo.map((player:any)=>{
                if(player.Titular){
                    players.push(player)
                }
                else bench.push(player)
            })
            setBenchPlayers(bench)
            setStartingSeven(players)
        }
    }, [playersInfo])

   

    return (
        <>
            <h1 className="text-5xl text-teamOrange bg-secondary w-full py-5">Resumen del partido</h1>
            <article className="bg-secondary w-full py-5">
            <section className="match-info">
                {!gameDataLoading && gameData && 
                <>
                    <h3>
                        {gameData[0].Jornada+' '+gameData[0].Competición+' '+gameData[0].Temporada}
                    </h3>
                    <h2 className="flex items-center justify-center gap-5 flex-wrap">
                        {gameData[0]["Goles Local"] + " - "+gameData[0]["Goles Visitante"]} VS <span className="text-teamOrange">{getOpponentName()} </span>
                    </h2>
                    <p className="text-teamOrange">
                        {gameData[0].Fecha}
                    </p>
                </>
                }
            </section>
            <section className="match-data">
            
            {
                startingSeven &&  startingSeven.length>0 && 
                <Field playersInfo={startingSeven} isLoading={isLoading} />
            }

{
                benchPlayers && benchPlayers.length>0 &&
                <BenchPlayers playersInfo={benchPlayers} isLoading={isLoading}/>
            }
            
            </section>
            </article>
            
        </>
    )
}

export default GameData;