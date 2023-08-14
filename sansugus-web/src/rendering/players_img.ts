import Felix from '../img/players/Félix.png'
import Mark from '../img/players/Mark_Frente.png'
import Portu from '../img/players/Portu.png'
import Migue from '../img/players/Migue.png'
import Dani from '../img/players/Dani.png'

const players_img: { [key: string]: string } = {
    "Javier Delgado": Portu,
    "Marcos Herrero": Mark,
    "Félix Barragán": Felix,
    "Miguel Ángel Rodríguez": Migue,
    "Daniel Sanz": Dani
}

export function getImage(name:string){
    return players_img[name]
}