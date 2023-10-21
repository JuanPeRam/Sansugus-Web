import Migue from '../img/shirts/Migue.png'
import VicoGK from '../img/shirts/Vico-GK.png'
import Pepe from '../img/shirts/Pepe.png'
import Dani from '../img/shirts/Dani.png'
import Charly from '../img/shirts/Charly.png'
import Fer from '../img/shirts/Fer.png'
import Inigol from '../img/shirts/Inigol.png'
import Joselu from '../img/shirts/Joselu.png'
import Pere from '../img/shirts/Pere.png'
import Portu from '../img/shirts/Portu.png'
import Robert from '../img/shirts/Robert.png'
import Vico from '../img/shirts/Vico.png'

const players_img: { [key: string]: string } = {
    "Luis Vico GK": VicoGK,
    "Charly": Charly,
    "Pepe": Pepe,
    "Miguel Ángel Rodríguez": Migue,
    "Daniel Sanz": Dani,
    "Marcos Herrero":Dani, //Esta
    "Sergio Hernández 'Checho'":Dani, //Esta
    "Jorge Muñoz": Dani, //Esta
    "Félix Barragán":Dani, //Esta
    "Fernando Oteo":Fer,
    "Iñigo Sáez Mesas": Inigol,
    "Jose Delgado":Joselu,
    "Juan Pereira":Pere,
    "Javier Delgado":Portu,
    "Roberto Lage":Robert,
    "Luis Vico": Vico

}

export function getShirtImage(name:string){
    return players_img[name]
}