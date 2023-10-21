import React,{useState,useEffect} from "react";
import Field from "./Field";
import {link} from '../../types'
import { sheetResponseToObjects } from "../../../functions/sheets";
import BenchPlayers from "./BenchPlayers";

const sheetName = 'Actas'

function getOpponentName(home:string,away:string):string{
    if(!(home==='Sansugus FC')) return home
    else return away
}

const GameData: React.FC<{}> = ({}) => {

    const queryParameters = new URLSearchParams(window.location.search)
    const game = queryParameters.get("game")
    const [isLoading,setIsLoading] = useState(false)
    const [gameDataLoading, setGameDataLoading] = useState(false)
    const [gameData, setGameData]:any = useState(null)
    const [playersInfo,setPlayersInfo] : any = useState(null)
    const [startingSeven, setStartingSeven] : any = useState(null)
    const [benchPlayers, setBenchPlayers] : any = useState(null)

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
            <section>
                {!gameDataLoading && gameData && 
                <div>
                    {getOpponentName(gameData[0].Local,gameData[0].Visitante)}
                </div>
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
        </>
    )
}

export default GameData;