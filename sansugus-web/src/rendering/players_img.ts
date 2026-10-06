// Fotos de los jugadores (WebP con transparencia). Cada una tiene dos tamaños:
//  - `<nombre>.webp`     → pequeña (560 px de alto), para las tarjetas de la plantilla
//  - `<nombre>-lg.webp`  → grande (hasta 1100 px de alto), para la ficha del jugador
const imagePaths: { [key: string]: string } = {
    "Carlos Pérez": 'Charly',
    "Daniel Sanz": 'Dani',
    "Marcos Herrero": 'Mark_Frente',
    "Félix Barragán": 'Félix',
    "Iñigo Saenz Mesas": 'Inigol',
    "Javier Delgado": 'Portu',
    "Miguel Ángel Rodríguez": "Migue",
    "Roberto Lage": "Robert",
    "Luis Vico GK": "Vico-GK",
    "Juan Pereira": "Pere",
    "José Delgado": "Jose",
    "Sergio Hernández 'Checho'": "Checho"
};

const dir = '/resources/img/players/'

export type PhotoSize = 'sm' | 'lg'

export function getImage(name: string, size: PhotoSize = 'sm'): string | undefined {
    const base = imagePaths[name]
    return base ? `${dir}${base}${size === 'lg' ? '-lg' : ''}.webp` : undefined
}
