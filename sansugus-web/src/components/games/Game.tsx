import { matchData } from "../types"
import sansugusLogo from '../../img/sansugus-logo.svg'
import Date from './Date'
import { getShieldImage } from "../../rendering/teams_img"

const sansugusName = "Sansugus FC"
const classGame = {
    "WON":"game-won",
    "LOST":"game-lost",
    "DRAW":"game-drawn"
}

const Game:React.FC<{game:matchData}> = ({game}) => {

    function isViewable() : boolean{
        let season = game['Temporada']
        return (season!='22/23'&&season!='21/22')
    }

    function openGame(){
            const match_id = game.ID_Partido;
            const url = 'Game?game=' + match_id;
            window.location.href = url;
    }

    
    return (
    <article className="flex flex-col items-center justify-center  shadow-md overflow-hidden text-center w-full border" key={game.ID_Partido}>
      <header className="flex justify-evenly items-center h-full w-full p-2 gap-2 bg-[#494949] shadow-xl relative text-center text-primary">
        <h2 className="text-base  font-bold">{game.Competición}</h2>
      </header>
      <div className="flex flex-col min-[450px]:flex-row p-5 items-center justify-evenly gap-5 hover:bg-black/30 transition w-full">
        <article className="h-36 flex flex-col justify-center items-center w-28">
          <div
            className="w-20 h-20 rounded-full shadow-md grid place-content-center p-4 group hover:shadow-xl transition"
          >
            <img src={getShieldImage(game.Local)} alt={`Escudo de ${game.Local}`} className="h-full w-full"/>
          </div>
          <h3 className="text-base text-center font-bold">
            {game.Local}
          </h3>
        </article>
        <div className="h-28 flex flex-col justify-center items-center w-32 gap-4">
          <div className="text-center text-xs">
            <Date date={game.Fecha}></Date>
          </div>
          <div className="flex justify-center items-center gap-3 text-xl font-bold relative text-center">
            <div
              className={`${
                game["Goles Local"] > game["Goles Visitante"]
                  ? "text-teamOrange"
                  : "text-primary"
              }`}
            >
                {game["Goles Local"]}
            </div>
            -
            <div
              className={`${
                game["Goles Local"] < game["Goles Visitante"]
                  ? "text-teamOrange"
                  : "text-primary"
              }`}
            >
              {game["Goles Visitante"]}
            </div>
          </div>
          <div>{game.Jornada}</div>
          <div className="text-[0.6rem]">Campo: {game.Campo}</div>
        </div>
        <article className="h-28 flex flex-col justify-center items-center w-28">
          <div
            className="w-20 h-20 rounded-full shadow-md grid place-content-center p-4 group hover:shadow-xl transition"
          >
            <img src={getShieldImage(game.Visitante)} alt={`Escudo de ${game.Visitante}`} className="h-full w-full"/>
          </div>
          <h3 className="text-base text-center font-bold">
            {game.Visitante}
          </h3>
        </article>
      </div>
    </article>
    )
}

export default Game;