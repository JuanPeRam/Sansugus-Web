const imagePaths: { [key: string]: string } = {
    "Boca Roners":"BocaRoners.png",
    "El Chimbón VC":"Chimbon.PNG",
    "El Chimbón":"Chimbon.PNG",
    "Élite FC":"Élite.png",
    "Enfurbaos CF":"Enfurbaos.png",
    "Ínter Strada":"InterStrada.png",
    "Internacionales FC":"Internacionales.png",
    "National Team":"NationalTeam.png",
    "Team Perú":"TeamPeru.png",
    "Sporting Brugal":"SportingBrugal.png",
    "Texas Guadarrama":"Texas-nuevo.PNG",
    "Tracas FC":"Tracas.png",
    "Recreativo de Juerga":"RecreativoJuerga.PNG",
    "Valhalla Club":"Valhalla.png",
    "Manchester Piti ":"Piti.png",
    "Paketenaikos FC":"Paketenaikos.png",
    "Cactus FC":"Cactus.png",
    "Buniatis Cleb":"Buniatis.png",
    "Real Astrazeneca FC":"Astrazeneca.PNG",
    "Real Astrazeneca":"Astrazeneca.PNG",
    "Talleres Pinho":"TalleresPinho.png",
    "Calvix Team":"Calvix.PNG",
    "Scissors FC":"Scissors.PNG",
    "Manza Football Club":"manza.png",
    "The Gorronalboys":"GorronalBoys.PNG",
    "Leyendas FC":"Leyendas.png",
    "Aston Birra":"AstonBirra.PNG",
    "Los Guerreros":"Guerreros.PNG",
    "Black&White":"Black&White.png",
    "Olimpiakojos FC":"Olimpiakojos.png",
    "Sansugus FC":"sansugus-logo.svg",
    "Real Suciedad":"Suciedad.png",
    "D. Sierra Bares":"D.SierraBares.png",
    "Los Bichos Gang":"Bichos.png",
    "New Rolls":"NewRolls.png",
    "Jabatos FC":"JabatosFC.png",
    "Rayo de la Sierra FC":"RayoSierraFC.png",
    "Cervecería La Cala":"CerveceriaCala.png",
    "Bayern Meister":"BayernMeister.png",
    "Deportivo Cinco Estrellas":"Deportivo5Estrellas.png"
  };
  
  const teams_img: { [key: string]: string } = {};
  
for (const team in imagePaths) {
    teams_img[team] = `/resources/img/shields/${imagePaths[team]}`;
}



export function getShieldImage(name:string){
    return teams_img[name]
}

export function getTeamShield(team: string): string {
    const url = getShieldImage(team);

    if (!url) {
        return `<span>${team}</span>`;
    } else {
        return `<img src="${url}" alt="${team}" class="team"/>`;
    }
}