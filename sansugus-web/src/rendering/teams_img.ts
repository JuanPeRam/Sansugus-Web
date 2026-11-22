const imagePaths: { [key: string]: string } = {
    "Boca Roners":"BocaRoners.webp",
    "El Chimbón VC":"Chimbon.webp",
    "El Chimbón":"Chimbon.webp",
    "Élite FC":"Élite.webp",
    "Enfurbaos CF":"Enfurbaos.webp",
    "Ínter Strada":"InterStrada.webp",
    "Internacionales FC":"Internacionales.webp",
    "National Team":"NationalTeam.webp",
    "Team Perú":"TeamPeru.webp",
    "Sporting Brugal":"SportingBrugal.webp",
    "Texas Guadarrama":"Texas-nuevo.webp",
    "Tracas FC":"Tracas.webp",
    "Recreativo de Juerga":"RecreativoJuerga.webp",
    "Valhalla Club":"Valhalla.webp",
    "Manchester Piti":"Piti.webp",
    "Paketenaikos FC":"Paketenaikos.webp",
    "Cactus FC":"Cactus.webp",
    "Buniatis Cleb":"Buniatis.webp",
    "Real Astrazeneca FC":"Astrazeneca.webp",
    "Real Astrazeneca":"Astrazeneca.webp",
    "Talleres Pinho":"TalleresPinho.webp",
    "Calvix Team":"Calvix.webp",
    "Scissors FC":"Scissors.webp",
    "Manza Football Club":"manza.webp",
    "The Gorronalboys":"GorronalBoys.webp",
    "Leyendas FC":"Leyendas.webp",
    "Aston Birra":"AstonBirra.webp",
    "Los Guerreros":"Guerreros.webp",
    "Black&White":"Black&White.webp",
    "Olimpiakojos FC":"Olimpiakojos.webp",
    "Sansugus FC":"sansugus-logo.svg",
    "Real Suciedad":"Suciedad.webp",
    "D. Sierra Bares":"D.SierraBares.webp",
    "Los Bichos Gang":"Bichos.webp",
    "New Rolls":"NewRolls.webp",
    "Jabatos FC":"JabatosFC.webp",
    "Rayo de la Sierra FC":"RayoSierraFC.webp",
    "Cervecería La Cala":"CerveceriaCala.webp",
    "Bayern Meister":"BayernMeister.webp",
    "Dep. Cinco Estrellas":"Deportivo5Estrellas.webp",
    "Cervecería la Cala":"CerveceriaLaCala.webp"
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