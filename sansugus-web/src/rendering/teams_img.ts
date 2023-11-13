const imagePaths: { [key: string]: string } = {
    "Boca Roners":"BocaRoners.png",
    "El Chimbón VC":"Chimbon.PNG",
    "Élite FC":"Élite.png",
    "Enfurbaos FC":"Enfurbaos.png",
    "Ínter Strada":"InterStrada.png",
    "Internacionales FC":"Internacionales.png",
    "National Team":"NationalTeam.png",
    "Team Peru":"TeamPeru.png",
    "Sporting Brugal":"SportingBrugal.png",
    "Texas Guadarrama":"Texas-nuevo.PNG",
    "Tracas FC":"Tracas.png",
    "Recreativo de Juerga":"RecreativoJuerga.PNG",
    "Valhalla Club":"Valhalla.png",
    "Manchester Piti":"Piti.png",
    "Paketenaikos FC":"Paketenaikos.png",
    "Cactus FC":"Cactus.png",
    "Buniatis Cleb":"Buniatis.png",
    "Real Astrazeneca FC":"Astrazeneca.PNG",
    "Talleres Pinho":"TalleresPinho.png",
    "Calvix Team":"Calvix.PNG",
    "Scissors FC":"Scissors.PNG",
    "Manza Football Club":"manza.png",
    "The Gorronalboys":"GorronalBoys.PNG",
    "Leyendas FC":"Leyendas.png",
    "Aston Birra":"AstonBirra.PNG",
    "Los Guerreros":"Guerreros.PNG"
  };
  
  const teams_img: { [key: string]: string } = {};
  
for (const team in imagePaths) {
    teams_img[team] = `/resources/img/shields/${imagePaths[team]}`;
}



export function getShieldImage(name:string){
    return teams_img[name]
}
