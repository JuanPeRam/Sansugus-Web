const imagePaths: { [key: string]: string } = {
    "Carlos Pérez": 'Charly.png',
    "Daniel Sanz": 'Dani.png',
    "Marcos Herrero":'Mark_Frente.png', 
    "Félix Barragán":'Félix.png', 
    "Iñigo Saenz Mesas": 'Inigol.png',
    "Javier Delgado":'Portu.png',
    "Miguel Ángel Rodríguez":"Migue.png",
    "Roberto Lage":"Robert.png",
    "Luis Vico GK":"Vico-GK.png",
    "Juan Pereira":"Pere.png",
    "José Delgado":"Jose.png"
  };

const players_img: { [key: string]: string } = {
}
const dir = '/resources/img/players/'

for (const player in imagePaths) {
    players_img[player] = `${dir+imagePaths[player]}`;
}

export function getImage(name:string){
    return players_img[name]
}