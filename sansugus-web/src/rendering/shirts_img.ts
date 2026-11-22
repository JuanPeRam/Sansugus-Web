const imagePaths: { [key: string]: string } = {
    "Luis Vico GK": 'Vico-GK.webp',
    "Carlos Pérez": 'Charly.webp',
    "Pepe": 'Pepe.webp',
    "Pepe Mesas": 'Pepe.webp',
    "Miguel Ángel Rodríguez": 'Migue.webp',
    "Daniel Sanz": 'Dani.webp',
    "Marcos Herrero":'Mark.webp', 
    "Sergio Hernández 'Checho'":'Checho.webp', 
    "Jorge Muñoz": 'Drako.webp',
    "Félix Barragán":'Félix.webp', 
    "Fernando Oteo":'Fer.webp',
    "Iñigo Saenz Mesas": 'Inigol.webp',
    "José Delgado":'Joselu.webp',
    "Juan Pereira":'Pere.webp',
    "Javier Delgado":'Portu.webp',
    "Roberto Lage":'Robert.webp',
    "Luis Vico": 'Vico.webp',
    "David Berdiales":"Berdi.webp",
    "Jorge Heras":"Hera.webp",
    "Víctor Méndez":"Vicmen.webp",
    "Gonzalo Manzano":"Gonman.webp",
  };
  
  const dir = '/resources/img/shirts/'
  const players_img: { [key: string]: string } = {};
  
for (const player in imagePaths) {
    players_img[player] = `${dir+imagePaths[player]}`;
}



export function getShirtImage(name:string){
    return players_img[name]
}
