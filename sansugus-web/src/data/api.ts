import { db } from '@/lib/db'
import { matchData, matchPlayerInfo, playerData } from '@/components/types'
import { Game } from '@/types/games'

/**
 * Caché corta en memoria para las lecturas públicas: evita repetir la misma consulta al
 * volver a una sección o cuando dos componentes la piden a la vez (comparten la promesa).
 * Si falla, se olvida para reintentar. El panel la vacía al guardar (clearPublicCache).
 */
const memo = new Map<string, { at: number, value: Promise<unknown> }>()
function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
    const hit = memo.get(key)
    if (hit && Date.now() - hit.at < ttlMs) return hit.value as Promise<T>
    const value = load().catch((err) => { memo.delete(key); throw err })
    memo.set(key, { at: Date.now(), value })
    return value
}
const MINUTE = 60_000
export const clearPublicCache = () => memo.clear()

/** Lanza un Error legible si la consulta de Supabase falla */
function unwrap<T>(res: { data: unknown; error: { message: string } | null }): T {
    if (res.error) throw new Error(res.error.message)
    return (res.data ?? []) as T
}

/* ─────────── Temporadas ─────────── */

export type Season = { name: string, active: boolean }

export function fetchSeasons(): Promise<Season[]> {
    return cached('seasons', 5 * MINUTE, async () => {
        const rows = unwrap<{ nombre: string, activa: boolean }[]>(
            await db.from('temporadas').select('nombre,activa').order('nombre', { ascending: true })
        )
        return rows.map(r => ({ name: r.nombre, active: r.activa }))
    })
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

export function fetchMatches(season: string): Promise<matchData[]> {
    return cached(`matches:${season}`, MINUTE, async () => {
        const rows = unwrap<PartidoRow[]>(
            await db.from('partidos').select(PARTIDO_COLUMNS)
                .eq('temporadas.nombre', season)
                .order('fecha', { ascending: false, nullsFirst: false })
        )
        return rows.map(mapMatch)
    })
}

/** Acepta el id numérico ('52') o el antiguo del Excel ('M.52') */
export function parseMatchId(raw: string | null): number | undefined {
    const n = Number((raw ?? '').replace(/^M\./i, ''))
    return Number.isInteger(n) && n > 0 ? n : undefined
}

export async function fetchMatch(id: number): Promise<matchData | undefined> {
    const rows = unwrap<PartidoRow[]>(
        await db.from('partidos').select(PARTIDO_COLUMNS).eq('id', id).limit(1)
    )
    return rows[0] ? mapMatch(rows[0]) : undefined
}

type ActaRow = {
    jugador_id: number, titular: boolean, posicion: string | null, goles: number, asistencias: number,
    amarillas: number, rojas: number, mvp: boolean, dorsal: number | null,
    partidos: { temporada_id: number } | null,
    jugadores: {
        nombre: string, alias: string | null,
        jugador_temporada: { temporada_id: number, dorsal_url: string | null }[] | null
    } | null
}

/**
 * Acta del partido en una sola petición: la temporada del partido y las camisetas
 * subidas desde el panel (jugador_temporada.dorsal_url) vienen embebidas. Antes eran
 * tres consultas encadenadas (acta → temporada del partido → camisetas).
 */
export async function fetchActa(matchId: number): Promise<matchPlayerInfo[]> {
    const rows = unwrap<ActaRow[]>(
        await db.from('actas')
            .select('jugador_id,titular,posicion,goles,asistencias,amarillas,rojas,mvp,dorsal,'
                + 'partidos!inner(temporada_id),jugadores!inner(nombre,alias,jugador_temporada(temporada_id,dorsal_url))')
            .eq('partido_id', matchId)
    )
    return rows.map(r => {
        const seasonId = r.partidos?.temporada_id
        const shirt = r.jugadores?.jugador_temporada?.find(jt => jt.temporada_id === seasonId)?.dorsal_url
        return {
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
            Camiseta: shirt ?? undefined,
        }
    })
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

export function fetchHomeMatches(): Promise<{ last?: Game, next?: Game }> {
    return cached('home', MINUTE, loadHomeMatches)
}

async function loadHomeMatches(): Promise<{ last?: Game, next?: Game }> {
    const [last, next] = await Promise.all([
        db.from('partidos').select(PARTIDO_COLUMNS)
            .eq('jugado', true).not('fecha', 'is', null)
            .order('fecha', { ascending: false }).limit(1),
        db.from('partidos').select(PARTIDO_COLUMNS)
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

const STAT_COLUMNS = 'goles,asistencias,partidos,amarillas,rojas,mvp,temporada'

export function fetchPlayerStats(season: string): Promise<{ players: playerData[], total: playerData | undefined }> {
    return cached(`players:${season}`, MINUTE, () => loadPlayerStats(season))
}

async function loadPlayerStats(season: string): Promise<{ players: playerData[], total: playerData | undefined }> {
    const [players, total] = await Promise.all([
        db.from('estadisticas_jugador').select(`jugador,dorsal,propia_puerta,foto_url,${STAT_COLUMNS}`)
            .eq('temporada', season)
            .order('goles', { ascending: false })
            .order('asistencias', { ascending: false })
            .order('partidos', { ascending: false })
            .order('jugador', { ascending: true }),
        db.from('estadisticas_equipo').select(STAT_COLUMNS).eq('temporada', season).limit(1),
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

export const CLASIFICACION_COLUMNS = 'posicion,equipo,jugados,por_jugar,ganados,empatados,perdidos,goles_favor,goles_contra,puntos,actualizada'

/** Clasificación de la temporada activa (vacía si aún no se ha cargado). Inicio y Clasificación comparten la consulta. */
export function fetchStandings(): Promise<{ rows: Standing[], updatedAt?: Date, season?: string }> {
    return cached('standings', MINUTE, loadStandings)
}

async function loadStandings(): Promise<{ rows: Standing[], updatedAt?: Date, season?: string }> {
    const rows = unwrap<(ClasificacionRow & { temporadas: { nombre: string } | null })[]>(
        await db.from('clasificacion').select(`${CLASIFICACION_COLUMNS},temporadas!inner(activa,nombre)`)
            .eq('temporadas.activa', true)
            .order('posicion', { ascending: true })
    )
    const last = rows.reduce<string | undefined>((max, r) => (!max || r.actualizada > max ? r.actualizada : max), undefined)
    return { rows: rows.map(mapStanding), updatedAt: last ? new Date(last) : undefined, season: rows[0]?.temporadas?.nombre }
}

/* ─────────── Patrocinadores ─────────── */

export type Sponsor = { id: number, name: string, logoUrl: string | null, webUrl: string | null, monochrome: boolean }

type PatrocinadorRow = { id: number, nombre: string, logo_url: string | null, web_url: string | null, monocromo: boolean }

/** Patrocinadores visibles, en el orden elegido en el panel */
export async function fetchSponsors(): Promise<Sponsor[]> {
    const rows = unwrap<PatrocinadorRow[]>(
        await db.from('patrocinadores').select('id,nombre,logo_url,web_url,monocromo')
            .eq('activo', true)
            .order('orden', { ascending: true })
            .order('id', { ascending: true })
    )
    return rows.map(r => ({ id: r.id, name: r.nombre, logoUrl: r.logo_url, webUrl: r.web_url, monochrome: r.monocromo }))
}
