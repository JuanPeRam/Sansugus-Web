import { supabase } from '@/lib/supabase'

/** Lanza un Error legible si la consulta de Supabase falla */
function unwrap<T>(res: { data: unknown; error: { message: string; code?: string } | null }): T {
    if (res.error) throw new Error(friendly(res.error))
    return (res.data ?? []) as T
}

/** Traduce los errores más habituales de la base de datos */
function friendly(err: { message: string; code?: string }): string {
    switch (err.code) {
        case '23505': return 'Ya existe un registro con esos datos.'
        case '23503': return err.message.includes('Borra antes') || err.message.includes('borra antes')
            ? err.message
            : 'No se puede borrar: tiene datos asociados (partidos, actas o plantilla).'
        case '42501': return 'No tienes permisos de administrador.'
        default: return err.message
    }
}

const check = (res: { error: { message: string; code?: string } | null }) => {
    if (res.error) throw new Error(friendly(res.error))
}

/* ─────────── Sesión ─────────── */

export async function checkIsAdmin(): Promise<boolean> {
    // is_admin() vive en el esquema public (compartido con AITOR FS)
    const { data, error } = await supabase.schema('public').rpc('is_admin')
    return !error && data === true
}

/* ─────────── Temporadas ─────────── */

export type SeasonRecord = { id: number, name: string, active: boolean }

export async function fetchAdminSeasons(): Promise<SeasonRecord[]> {
    const rows = unwrap<{ id: number, nombre: string, activa: boolean }[]>(
        await supabase.from('temporadas').select('id,nombre,activa').order('nombre', { ascending: true })
    )
    return rows.map(r => ({ id: r.id, name: r.nombre, active: r.activa }))
}

export async function createSeason(name: string) {
    check(await supabase.from('temporadas').insert({ nombre: name.trim(), activa: false }))
}
export async function renameSeason(id: number, name: string) {
    check(await supabase.from('temporadas').update({ nombre: name.trim() }).eq('id', id))
}
export async function deleteSeason(id: number) {
    check(await supabase.from('temporadas').delete().eq('id', id))
}
export async function activateSeason(id: number) {
    check(await supabase.rpc('activar_temporada', { p_temporada_id: id }))
}

/* ─────────── Jugadores ─────────── */

export type PlayerRecord = { id: number, name: string, alias: string, position: string, ownGoal: boolean }

export async function fetchAllPlayers(): Promise<PlayerRecord[]> {
    const rows = unwrap<{ id: number, nombre: string, alias: string | null, posicion: string | null, propia_puerta: boolean }[]>(
        await supabase.from('jugadores').select('id,nombre,alias,posicion,propia_puerta').order('nombre', { ascending: true })
    )
    return rows.map(r => ({ id: r.id, name: r.nombre, alias: r.alias ?? '', position: r.posicion ?? '', ownGoal: r.propia_puerta }))
}

export async function createPlayer(input: { name: string, alias?: string, position?: string }): Promise<number> {
    const rows = unwrap<{ id: number }[]>(
        await supabase.from('jugadores')
            .insert({ nombre: input.name.trim(), alias: input.alias?.trim() || null, posicion: input.position || null })
            .select('id')
    )
    return rows[0].id
}
export async function updatePlayer(id: number, input: { name: string, alias: string, position: string }) {
    check(await supabase.from('jugadores')
        .update({ nombre: input.name.trim(), alias: input.alias.trim() || null, posicion: input.position || null })
        .eq('id', id))
}
export async function deletePlayer(id: number) {
    check(await supabase.from('jugadores').delete().eq('id', id))
}

/* ─────────── Plantilla de una temporada ─────────── */

export type HistoricStats = { goals: number, assists: number, played: number, yellows: number, reds: number, mvps: number }
export type RosterEntry = {
    playerId: number, name: string, alias: string, position: string, ownGoal: boolean,
    number: number | null,
    /** Solo en temporadas anteriores a las actas (se editan a mano) */
    historic: HistoricStats | null,
    /** Estadísticas calculadas desde las actas */
    stats: { goals: number, assists: number, played: number, yellows: number, reds: number, mvps: number }
}

type RosterRow = {
    jugador_id: number, dorsal: number | null,
    jugadores: { nombre: string, alias: string | null, posicion: string | null, propia_puerta: boolean } | null
}
type HistoricRow = { jugador_id: number, goles: number, asistencias: number, partidos: number, amarillas: number, rojas: number, mvp: number }
type StatRow = { jugador_id: number, goles: number, asistencias: number, partidos: number, amarillas: number, rojas: number, mvp: number }

export async function fetchRoster(seasonId: number): Promise<RosterEntry[]> {
    const [roster, historic, stats] = await Promise.all([
        supabase.from('jugador_temporada').select('jugador_id,dorsal,jugadores!inner(nombre,alias,posicion,propia_puerta)').eq('temporada_id', seasonId),
        supabase.from('estadisticas_historicas').select('jugador_id,goles,asistencias,partidos,amarillas,rojas,mvp').eq('temporada_id', seasonId),
        supabase.from('estadisticas_jugador').select('jugador_id,goles,asistencias,partidos,amarillas,rojas,mvp').eq('temporada_id', seasonId),
    ])
    const historicBy = new Map(unwrap<HistoricRow[]>(historic).map(r => [r.jugador_id, r]))
    const statsBy = new Map(unwrap<StatRow[]>(stats).map(r => [r.jugador_id, r]))
    return unwrap<RosterRow[]>(roster)
        .map(r => {
            const h = historicBy.get(r.jugador_id)
            const s = statsBy.get(r.jugador_id)
            return {
                playerId: r.jugador_id,
                name: r.jugadores?.nombre ?? '',
                alias: r.jugadores?.alias ?? '',
                position: r.jugadores?.posicion ?? '',
                ownGoal: !!r.jugadores?.propia_puerta,
                number: r.dorsal,
                historic: h ? { goals: h.goles, assists: h.asistencias, played: h.partidos, yellows: h.amarillas, reds: h.rojas, mvps: h.mvp } : null,
                stats: { goals: s?.goles ?? 0, assists: s?.asistencias ?? 0, played: s?.partidos ?? 0, yellows: s?.amarillas ?? 0, reds: s?.rojas ?? 0, mvps: s?.mvp ?? 0 },
            }
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export async function addToRoster(seasonId: number, playerId: number, number: number | null, historic: boolean) {
    check(await supabase.from('jugador_temporada').insert({ temporada_id: seasonId, jugador_id: playerId, dorsal: number }))
    if (historic) check(await supabase.from('estadisticas_historicas').insert({ temporada_id: seasonId, jugador_id: playerId }))
}
export async function updateRosterNumber(seasonId: number, playerId: number, number: number | null) {
    check(await supabase.from('jugador_temporada').update({ dorsal: number }).eq('temporada_id', seasonId).eq('jugador_id', playerId))
}
export async function updateHistoricStats(seasonId: number, playerId: number, s: HistoricStats) {
    check(await supabase.from('estadisticas_historicas')
        .update({ goles: s.goals, asistencias: s.assists, partidos: s.played, amarillas: s.yellows, rojas: s.reds, mvp: s.mvps })
        .eq('temporada_id', seasonId).eq('jugador_id', playerId))
}
export async function removeFromRoster(seasonId: number, playerId: number, hadHistoric: boolean) {
    // El trigger de la base de datos impide quitar a quien tiene partidos esa temporada
    if (hadHistoric) check(await supabase.from('estadisticas_historicas').delete().eq('temporada_id', seasonId).eq('jugador_id', playerId))
    check(await supabase.from('jugador_temporada').delete().eq('temporada_id', seasonId).eq('jugador_id', playerId))
}

/* ─────────── Partidos ─────────── */

export type MatchRecord = {
    id: number, home: string, away: string, date: string | null,
    homeGoals: number | null, awayGoals: number | null,
    homePens: number | null, awayPens: number | null,
    field: number | null, competition: string, round: string, played: boolean,
    seasonId: number, hasActa: boolean,
}
export type MatchInput = Omit<MatchRecord, 'id' | 'seasonId' | 'hasActa'>

type PartidoRow = {
    id: number, local: string, visitante: string, fecha: string | null,
    goles_local: number | null, goles_visitante: number | null,
    penaltis_local: number | null, penaltis_visitante: number | null,
    campo: number | null, competicion: string, jornada: string, jugado: boolean, temporada_id: number
}

const mapMatch = (r: PartidoRow, withActa: Set<number>): MatchRecord => ({
    id: r.id, home: r.local, away: r.visitante, date: r.fecha,
    homeGoals: r.goles_local, awayGoals: r.goles_visitante,
    homePens: r.penaltis_local, awayPens: r.penaltis_visitante,
    field: r.campo, competition: r.competicion, round: r.jornada, played: r.jugado,
    seasonId: r.temporada_id, hasActa: withActa.has(r.id),
})

export async function fetchSeasonMatches(seasonId: number): Promise<MatchRecord[]> {
    const rows = unwrap<PartidoRow[]>(
        await supabase.from('partidos').select('*').eq('temporada_id', seasonId)
            .order('fecha', { ascending: false, nullsFirst: false })
    )
    const ids = rows.map(r => r.id)
    const actas = ids.length
        ? unwrap<{ partido_id: number }[]>(await supabase.from('actas').select('partido_id').in('partido_id', ids))
        : []
    const withActa = new Set(actas.map(a => a.partido_id))
    return rows.map(r => mapMatch(r, withActa))
}

export async function fetchMatchById(id: number): Promise<MatchRecord | undefined> {
    const rows = unwrap<PartidoRow[]>(await supabase.from('partidos').select('*').eq('id', id).limit(1))
    return rows[0] ? mapMatch(rows[0], new Set()) : undefined
}

const matchColumns = (m: MatchInput) => ({
    local: m.home.trim(), visitante: m.away.trim(), fecha: m.date,
    goles_local: m.played ? m.homeGoals : null, goles_visitante: m.played ? m.awayGoals : null,
    penaltis_local: m.played ? m.homePens : null, penaltis_visitante: m.played ? m.awayPens : null,
    campo: m.field, competicion: m.competition.trim(), jornada: m.round.trim(), jugado: m.played,
})

export async function saveMatch(seasonId: number, m: MatchInput, id?: number): Promise<void> {
    if (id === undefined) check(await supabase.from('partidos').insert({ ...matchColumns(m), temporada_id: seasonId }))
    else check(await supabase.from('partidos').update(matchColumns(m)).eq('id', id))
}
export async function setMatchScore(id: number, homeGoals: number, awayGoals: number) {
    check(await supabase.from('partidos').update({ goles_local: homeGoals, goles_visitante: awayGoals }).eq('id', id))
}
export async function deleteMatch(id: number) {
    // Las actas se borran en cascada
    check(await supabase.from('partidos').delete().eq('id', id))
}

/** Equipos y competiciones ya usados, para autocompletar */
export async function fetchSuggestions(): Promise<{ teams: string[], competitions: string[] }> {
    const rows = unwrap<{ local: string, visitante: string, competicion: string }[]>(
        await supabase.from('partidos').select('local,visitante,competicion')
    )
    const teams = new Set<string>(), competitions = new Set<string>()
    rows.forEach(r => { teams.add(r.local); teams.add(r.visitante); competitions.add(r.competicion) })
    teams.delete('Descansa')
    return { teams: [...teams].sort((a, b) => a.localeCompare(b, 'es')), competitions: [...competitions].sort((a, b) => a.localeCompare(b, 'es')) }
}

/* ─────────── Acta de un partido ─────────── */

export type ActaEntry = {
    playerId: number, starter: boolean, position: string, number: number | null,
    goals: number, assists: number, yellows: number, reds: number, mvp: boolean,
}

type ActaRow = {
    jugador_id: number, titular: boolean, posicion: string | null, dorsal: number | null,
    goles: number, asistencias: number, amarillas: number, rojas: number, mvp: boolean
}

export async function fetchActaEntries(matchId: number): Promise<ActaEntry[]> {
    const rows = unwrap<ActaRow[]>(await supabase.from('actas').select('*').eq('partido_id', matchId))
    return rows.map(r => ({
        playerId: r.jugador_id, starter: r.titular, position: r.posicion ?? '', number: r.dorsal,
        goals: r.goles, assists: r.asistencias, yellows: r.amarillas, reds: r.rojas, mvp: r.mvp,
    }))
}

/** Guarda el acta completa de forma atómica; las estadísticas se recalculan solas */
export async function saveActa(matchId: number, entries: ActaEntry[]) {
    check(await supabase.rpc('guardar_acta_partido', {
        p_partido_id: matchId,
        p_acta: entries.map(e => ({
            jugador_id: e.playerId, titular: e.starter, posicion: e.position, dorsal: e.number,
            goles: e.goals, asistencias: e.assists, amarillas: e.yellows, rojas: e.reds, mvp: e.mvp,
        })),
    }))
}

/* ─────────── Resumen ─────────── */

export async function fetchDashboard(seasonId: number) {
    const [matches, roster, team, historic] = await Promise.all([
        fetchSeasonMatches(seasonId),
        supabase.from('jugador_temporada').select('jugador_id', { count: 'exact', head: true }).eq('temporada_id', seasonId),
        supabase.from('estadisticas_equipo').select('*').eq('temporada_id', seasonId).limit(1),
        supabase.from('estadisticas_historicas').select('jugador_id', { count: 'exact', head: true }).eq('temporada_id', seasonId),
    ])
    check(roster)
    check(historic)
    const t = unwrap<{ goles: number, asistencias: number, mvp: number }[]>(team)[0]
    return {
        matches, rosterCount: roster.count ?? 0, goals: t?.goles ?? 0, assists: t?.asistencias ?? 0, mvps: t?.mvp ?? 0,
        /** Las temporadas con estadísticas históricas no tienen actas */
        usesActas: (historic.count ?? 0) === 0,
    }
}
