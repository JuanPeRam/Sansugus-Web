const imagePaths: { [key: string]: string } = {
    "Luis Vico GK": 'Vico-GK.png',
    "Carlos Pérez": 'Charly.png',
    "Pepe": 'Pepe.png',
    "Miguel Ángel Rodríguez": 'Migue.png',
    "Daniel Sanz": 'Dani.png',
    "Marcos Herrero":'Mark.png', 
    "Sergio Hernández 'Checho'":'Checho.png', 
    "Jorge Muñoz": 'Drako.png',
    "Félix Barragán":'Félix.png', 
    "Fernando Oteo":'Fer.png',
    "Iñigo Saenz Mesas": 'Inigol.png',
    "José Delgado":'Joselu.png',
    "Juan Pereira":'Pere.png',
    "Javier Delgado":'Portu.png',
    "Roberto Lage":'Robert.png',
    "Luis Vico": 'Vico.png',
    "David Berdiales":"Berdi.png",
    "Jorge Heras":"Hera.png",
    "Víctor Méndez":"Vicmen.png",
    "Gonzalo Manzano":"Gonman.png",
  };
  
  const dir = '/resources/img/shirts/'
  const players_img: { [key: string]: string } = {};
  
for (const player in imagePaths) {
    players_img[player] = `${dir+imagePaths[player]}`;
}



export function getShirtImage(name:string){
    return players_img[name]
}
