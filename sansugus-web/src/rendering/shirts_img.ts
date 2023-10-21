const imagePaths: { [key: string]: string } = {
    "Luis Vico GK": 'Vico-GK.png',
    "Charly": 'Charly.png',
    "Pepe": 'Pepe.png',
    "Miguel Ángel Rodríguez": 'Migue.png',
    "Daniel Sanz": 'Dani.png',
    "Marcos Herrero":'Mark.png', 
    "Sergio Hernández 'Checho'":'Checho.png', 
    "Jorge Muñoz": 'Drako.png',
    "Félix Barragán":'Félix.png', 
    "Fernando Oteo":'Fer.png',
    "Iñigo Sáez Mesas": 'Inigol.png',
    "Jose Delgado":'Joselu.png',
    "Juan Pereira":'Pere.png',
    "Javier Delgado":'Portu.png',
    "Roberto Lage":'Robert.png',
    "Luis Vico": 'Vico.png'
  };
  
  const players_img: { [key: string]: string } = {};
  
for (const player in imagePaths) {
    players_img[player] = `./dir/${imagePaths[player]}`;
}



export function getShirtImage(name:string){
    return players_img[name]
}
