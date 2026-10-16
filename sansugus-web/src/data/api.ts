import { supabase } from '@/lib/supabase'
import { matchData, matchPlayerInfo, playerData } from '@/components/types'
import { Game } from '@/types/games'

/** Lanza un Error legible si la consulta de Supabase falla */
function unwrap<T>(res: { data: unknown; error: { message: string } | null }): T {
    if (res.error) throw new Error(res.error.message)
    return (res.data ?? []) as T
}

/* ─────────── Temporadas ─────────── */

export type Season = { name: string, active: boolean }

export async function fetchSeasons(): Promise<Season[]> {
    const rows = unwrap<{ nombre: string, activa: boolean }[]>(
        await supabase.from('temporadas').select('nombre,activa').order('nombre', { ascending: true })
    )
    return rows.map(r => ({ name: r.nombre, active: r.activa }))
}

/* ─────────── Partidos ─────────── */

type PartidoRow = {
    id: number, local: string, visitante: string, fecha: string | null,
    goles_local: number | null, goles_visitante: number | null,
    penaltis_local: number | null, penaltis_visitante: number | null,
    campo: number | null, competicion: string, jornada: string, jugado: boolean,
    temporadas: { nombre: string } | null
}

const PARTIDO_COLUMNS = 'id,local,visitante,fecha,goles_local,goles_visitante,penaltis_local,penaltis_visitante,campo,competicion,jornada,jugado,temporadas!inner(nombre)'

const str = (v: number | null) => v === null || v === undefined ? '' : String(v)

function mapMatch(r: PartidoRow): matchData {
    return {
        ID_Partido: String(r.id),
        Local: r.local,
        Visitante: r.visitante,
        Fecha: r.fecha ? new Date(r.fecha) : undefined,
        'Goles Local': str(r.goles_local),
        'Goles Visitante': str(r.goles_visitante),
        'Penaltis Local': r.penaltis_local,
        'Penaltis Visitante': r.penaltis_visitante,
        Campo: r.campo ?? 0,
        Temporada: r.temporadas?.nombre ?? '',
        Competición: r.competicion,
        Jornada: r.jornada,
        Jugado: r.jugado,
    }
}

export async function fetchMatches(season: string): Promise<matchData[]> {
    const rows = unwrap<PartidoRow[]>(
        await supabase.from('partidos').select(PARTIDO_COLUMNS)
            .eq('temporadas.nombre', season)
            .order('fecha', { ascending: false, nullsFirst: false })
    )
    return rows.map(mapMatch)
}

/** Acepta el id numérico ('52') o el antiguo del Excel ('M.52') */
export function parseMatchId(raw: string | null): number | undefined {
    const n = Number((raw ?? '').replace(/^M\./i, ''))
    return Number.isInteger(n) && n > 0 ? n : undefined
}

export async function fetchMatch(id: number): Promise<matchData | undefined> {
    const rows = unwrap<PartidoRow[]>(
        await supabase.from('partidos').select(PARTIDO_COLUMNS).eq('id', id).limit(1)
    )
    return rows[0] ? mapMatch(rows[0]) : undefined
}

type ActaRow = {
    jugador_id: number, titular: boolean, posicion: string | null, goles: number, asistencias: number,
    amarillas: number, rojas: number, mvp: boolean, dorsal: number | null,
    jugadores: { nombre: string, alias: string | null } | null
}

export async function fetchActa(matchId: number): Promise<matchPlayerInfo[]> {
    const rows = unwrap<ActaRow[]>(
        await supabase.from('actas')
            .select('jugador_id,titular,posicion,goles,asistencias,amarillas,rojas,mvp,dorsal,jugadores!inner(nombre,alias)')
            .eq('partido_id', matchId)
    )
    const shirts = await fetchActaShirts(matchId, rows.map(r => r.jugador_id))
    return rows.map(r => ({
        ID_Partido: String(matchId),
        Jugador: r.jugadores?.nombre ?? '',
        Titular: r.titular,
        Posición: r.posicion ?? '',
        Goles: r.goles,
        Asistencias: r.asistencias,
        Amarillas: r.amarillas,
        Rojas: r.rojas,
        MVP: r.mvp,
        Alias: r.jugadores?.alias ?? '',
        Dorsal: r.dorsal ?? 0,
        Camiseta: shirts.get(r.jugador_id),
    }))
}

/** Camisetas subidas desde el panel para la temporada del partido (jugador → URL) */
async function fetchActaShirts(matchId: number, playerIds: number[]): Promise<Map<number, string>> {
    if (!playerIds.length) return new Map()
    const match = unwrap<{ temporada_id: number }[]>(
        await supabase.from('partidos').select('temporada_id').eq('id', matchId).limit(1)
    )[0]
    if (!match) return new Map()
    const rows = unwrap<{ jugador_id: number, dorsal_url: string | null }[]>(
        await supabase.from('jugador_temporada').select('jugador_id,dorsal_url')
            .eq('temporada_id', match.temporada_id).in('jugador_id', playerIds).not('dorsal_url', 'is', null)
    )
    return new Map(rows.map(r => [r.jugador_id, r.dorsal_url as string]))
}

/* ─────────── Inicio: último y próximo partido ─────────── */

const TIMEZONE = 'Europe/Madrid'

function mapGame(r: PartidoRow): Game {
    const date = new Date(r.fecha as string)
    return {
        home_team: r.local,
        away_team: r.visitante,
        date,
        competition: `${r.competicion} · ${r.jornada}`,
        round: r.jornada,
        stadium: '',
        field: r.campo ? `Campo ${r.campo}` : '',
        played: r.jugado,
        goals_home: r.goles_local ?? undefined,
        goals_away: r.goles_visitante ?? undefined,
        hour: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE }),
    }
}

export async function fetchHomeMatches(): Promise<{ last?: Game, next?: Game }> {
    const [last, next] = await Promise.all([
        supabase.from('partidos').select(PARTIDO_COLUMNS)
            .eq('jugado', true).not('fecha', 'is', null)
            .order('fecha', { ascending: false }).limit(1),
        supabase.from('partidos').select(PARTIDO_COLUMNS)
            .eq('jugado', false).gte('fecha', new Date().toISOString())
            .order('fecha', { ascending: true }).limit(1),
    ])
    const lastRows = unwrap<PartidoRow[]>(last)
    const nextRows = unwrap<PartidoRow[]>(next)
    return {
        last: lastRows[0] ? mapGame(lastRows[0]) : undefined,
        next: nextRows[0] ? mapGame(nextRows[0]) : undefined,
    }
}

/* ─────────── Jugadores ─────────── */

type EstadisticaRow = {
    jugador: string, dorsal: number | null, goles: number, asistencias: number,
    partidos: number, amarillas: number, rojas: number, mvp: number,
    temporada: string, propia_puerta: boolean, foto_url?: string | null
}

const mapPlayer = (r: EstadisticaRow): playerData => ({
    Jugador: r.jugador,
    Dorsal: r.dorsal === null ? '' : String(r.dorsal),
    Goles: r.goles,
    Asistencias: r.asistencias,
    Partidos: r.partidos,
    Amarillas: r.amarillas,
    Rojas: r.rojas,
    Temporada: r.temporada,
    MVP: r.mvp,
    Foto: r.foto_url ?? undefined,
})

export async function fetchPlayerStats(season: string): Promise<{ players: playerData[], total: playerData | undefined }> {
    const [players, total] = await Promise.all([
        supabase.from('estadisticas_jugador').select('*')
            .eq('temporada', season)
            .order('goles', { ascending: false })
            .order('asistencias', { ascending: false })
            .order('partidos', { ascending: false })
            .order('jugador', { ascending: true }),
        supabase.from('estadisticas_equipo').select('*').eq('temporada', season).limit(1),
    ])
    const rows = unwrap<EstadisticaRow[]>(players).filter(r => !r.propia_puerta)
    const t = unwrap<Omit<EstadisticaRow, 'jugador' | 'dorsal' | 'propia_puerta'>[]>(total)[0]
    return {
        players: rows.map(mapPlayer),
        total: t ? mapPlayer({ ...t, jugador: 'Total', dorsal: null, propia_puerta: false }) : undefined,
    }
}

/* ─────────── Clasificación ─────────── */

export type Standing = {
    position: number, team: string, played: number, remaining: number,
    won: number, drawn: number, lost: number, goalsFor: number, goalsAgainst: number, points: number,
}

type ClasificacionRow = {
    posicion: number, equipo: string, jugados: number, por_jugar: number, ganados: number, empatados: number,
    perdidos: number, goles_favor: number, goles_contra: number, puntos: number, actualizada: string
}

export const mapStanding = (r: ClasificacionRow): Standing => ({
    position: r.posicion, team: r.equipo, played: r.jugados, remaining: r.por_jugar,
    won: r.ganados, drawn: r.empatados, lost: r.perdidos,
    goalsFor: r.goles_favor, goalsAgainst: r.goles_contra, points: r.puntos,
})

/** Clasificación de la temporada activa (vacía si aún no se ha cargado) */
export async function fetchStandings(): Promise<{ rows: Standing[], updatedAt?: Date }> {
    const rows = unwrap<ClasificacionRow[]>(
        await supabase.from('clasificacion').select('*,temporadas!inner(activa)')
            .eq('temporadas.activa', true)
            .order('posicion', { ascending: true })
    )
    const last = rows.reduce<string | undefined>((max, r) => (!max || r.actualizada > max ? r.actualizada : max), undefined)
    return { rows: rows.map(mapStanding), updatedAt: last ? new Date(last) : undefined }
}
