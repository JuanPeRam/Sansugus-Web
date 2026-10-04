import { supabase } from '@/lib/supabase'
import { matchData, matchPlayerInfo, playerData } from '@/components/types'
import { Game } from '@/types/games'
import { teamData } from '@/types/competitionTypes'

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
    titular: boolean, posicion: string | null, goles: number, asistencias: number,
    amarillas: number, rojas: number, mvp: boolean, dorsal: number | null,
    jugadores: { nombre: string, alias: string | null } | null
}

export async function fetchActa(matchId: number): Promise<matchPlayerInfo[]> {
    const rows = unwrap<ActaRow[]>(
        await supabase.from('actas')
            .select('titular,posicion,goles,asistencias,amarillas,rojas,mvp,dorsal,jugadores!inner(nombre,alias)')
            .eq('partido_id', matchId)
    )
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
    }))
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
    temporada: string, propia_puerta: boolean
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

type FilaRow = {
    posicion: number, equipo: string, jugados: number, ganados: number, empatados: number,
    perdidos: number, goles_favor: number, goles_contra: number, puntos: number
}

/** Clasificación más reciente de la temporada activa (vacía si aún no se ha cargado) */
export async function fetchStandings(): Promise<teamData[]> {
    const seasons = unwrap<{ id: number }[]>(
        await supabase.from('temporadas').select('id').eq('activa', true).limit(1)
    )
    if (seasons.length === 0) return []
    const tables = unwrap<{ id: number }[]>(
        await supabase.from('clasificaciones').select('id')
            .eq('temporada_id', seasons[0].id).order('id', { ascending: false }).limit(1)
    )
    if (tables.length === 0) return []
    const rows = unwrap<FilaRow[]>(
        await supabase.from('clasificacion_filas').select('*')
            .eq('clasificacion_id', tables[0].id).order('posicion', { ascending: true })
    )
    return rows.map(r => ({
        position: r.posicion,
        teamName: r.equipo,
        points: r.puntos,
        played: r.jugados,
        won: r.ganados,
        drawn: r.empatados,
        lost: r.perdidos,
        goals: r.goles_favor,
        goalsAgainst: r.goles_contra,
        gd: String(r.goles_favor - r.goles_contra),
    }))
}
