import React,{useState,useEffect} from "react";
import Field from "./Field";
import {link} from '../../types'
import { sheetResponseToObjects } from "../../../functions/sheets";

const sheetName = 'Actas'

const GameData: React.FC<{}> = ({}) => {

    const queryParameters = new URLSearchParams(window.location.search)
    const game = queryParameters.get("game")
    const [isLoading,setIsLoading] = useState(false)
    const [playersInfo,setPlayersInfo] : any = useState(null)
    const [startingSeven, setStartingSeven] : any = useState(null)

    useEffect(() => {
        setIsLoading(true)
        const query = `SELECT * WHERE A = '${game}'`
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

    useEffect(()=>{
        if(playersInfo!=null){
            var players:Array<any> = new Array<any>
            playersInfo.map((player:any)=>{
                if(player.Titular){
                    players.push(player)
                }
            })
            setStartingSeven(players)
        }
    }, [playersInfo])

    return (
        <>
        
        <Field playersInfo={startingSeven} isLoading={isLoading}></Field>
        </>
    )
}

export default GameData;