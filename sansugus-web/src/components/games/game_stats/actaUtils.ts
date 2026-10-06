import { matchPlayerInfo } from '../../types'

/** Pseudo-jugador que recoge los goles en propia puerta del rival */
export const OWN_GOAL = 'P.P'

export const isOwnGoal = (p: matchPlayerInfo) => p.Jugador === OWN_GOAL

/** Nombre corto: el alias o, si no hay, el nombre de pila */
export const shortName = (p: matchPlayerInfo) => p.Alias?.trim() || p.Jugador.split(' ')[0]

export type Lineup = {
  forwards: matchPlayerInfo[]
  midfielders: matchPlayerInfo[]
  defenders: matchPlayerInfo[]
  keepers: matchPlayerInfo[]
}

/** Reparte a los titulares por líneas (delantera arriba, portería abajo) */
export function buildLineup(starters: matchPlayerInfo[]): Lineup {
  const l: Lineup = { forwards: [], midfielders: [], defenders: [], keepers: [] }
  for (const p of starters) {
    switch (p.Posición) {
      case 'Delantero': l.forwards.push(p); break
      case 'Defensa': l.defenders.push(p); break
      case 'Portero': l.keepers.push(p); break
      default: l.midfielders.push(p) // Medio o sin posición
    }
  }
  return l
}

/** Formación en formato 2-3-1 (defensas-medios-delanteros) */
export const formation = (l: Lineup) => `${l.defenders.length}-${l.midfielders.length}-${l.forwards.length}`

const POSITION_ORDER: Record<string, number> = { Portero: 0, Defensa: 1, Medio: 2, Delantero: 3 }
export const byPosition = (a: matchPlayerInfo, b: matchPlayerInfo) =>
  (POSITION_ORDER[a.Posición] ?? 9) - (POSITION_ORDER[b.Posición] ?? 9) || a.Dorsal - b.Dorsal

export type Highlights = {
  scorers: { name: string; n: number }[]
  assists: { name: string; n: number }[]
  yellows: { name: string; n: number }[]
  reds: { name: string; n: number }[]
  ownGoals: number
}

/** Resumen del partido a partir del acta */
export function buildHighlights(players: matchPlayerInfo[]): Highlights {
  const pick = (key: 'Goles' | 'Asistencias' | 'Amarillas' | 'Rojas') =>
    players.filter((p) => !isOwnGoal(p) && p[key] > 0).sort((a, b) => b[key] - a[key] || a.Dorsal - b.Dorsal).map((p) => ({ name: shortName(p), n: p[key] }))
  return {
    scorers: pick('Goles'),
    assists: pick('Asistencias'),
    yellows: pick('Amarillas'),
    reds: pick('Rojas'),
    ownGoals: players.filter(isOwnGoal).reduce((s, p) => s + p.Goles, 0),
  }
}
