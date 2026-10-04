import { createContext, useContext, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAdminSeasons } from '@/data/adminApi'
import { useAsync } from '@/hooks/useAsync'
import { NativeSelect } from '@/components/admin/ui'

export const POSITIONS = ['Portero', 'Defensa', 'Medio', 'Delantero']

export const errorText = (err: unknown, fallback = 'No se pudo guardar') => (err instanceof Error ? err.message : fallback)

/* ─────────── Cambios sin guardar ─────────── */

type UnsavedRegistry = { set: (id: symbol, dirty: boolean) => void; any: () => boolean }

export const unsavedContext = createContext<UnsavedRegistry | null>(null)

export const LEAVE_MESSAGE = 'Hay cambios sin guardar. ¿Salir sin guardarlos?'

/** Marca la pantalla como «con cambios sin guardar»: avisa al cerrar/recargar y al cambiar de sección */
export function useUnsavedChanges(dirty: boolean) {
  const registry = useContext(unsavedContext)
  const id = useRef(Symbol('pantalla')).current
  useEffect(() => {
    registry?.set(id, dirty)
    return () => registry?.set(id, false)
  }, [registry, id, dirty])
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])
}

/** Devuelve una función que pide confirmación si alguna pantalla tiene cambios sin guardar */
export function useConfirmLeave() {
  const registry = useContext(unsavedContext)
  return () => !registry?.any() || window.confirm(LEAVE_MESSAGE)
}

export function createUnsavedRegistry(): UnsavedRegistry {
  const dirty = new Set<symbol>()
  return {
    set: (id, isDirty) => (isDirty ? dirty.add(id) : dirty.delete(id)),
    any: () => dirty.size > 0,
  }
}

/* ─────────── Temporada seleccionada (?temporada=) ─────────── */

export function useAdminSeason() {
  const { data, loading, error, reload } = useAsync(fetchAdminSeasons, [])
  const [params, setParams] = useSearchParams()
  const confirmLeave = useConfirmLeave()
  const seasons = data ?? []
  const wanted = params.get('temporada')
  const current = seasons.find((s) => s.name === wanted) ?? seasons.find((s) => s.active) ?? seasons[seasons.length - 1]
  const setSeason = (name: string) => setParams((p) => { const n = new URLSearchParams(p); n.set('temporada', name); return n }, { replace: true })
  // Cambiar de temporada descarta lo que no se haya guardado: se pide confirmación
  const picker = (
    <NativeSelect
      aria-label="Temporada"
      value={current?.name ?? ''}
      onChange={(e) => confirmLeave() && setSeason(e.target.value)}
      className="w-40"
    >
      {seasons.map((s) => <option key={s.id} value={s.name}>{s.name}{s.active ? ' (activa)' : ''}</option>)}
    </NativeSelect>
  )
  return { seasons, season: current?.name, seasonId: current?.id, active: current?.active ?? false, loading, error, reload, picker }
}

/* ─────────── Fechas en hora de España ─────────── */

const TZ = 'Europe/Madrid'

function tzOffsetMinutes(utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(utcMs))
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return (Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - utcMs) / 60000
}

/** ISO → valor de <input type="datetime-local"> en hora de España */
export function isoToMadridInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = new Intl.DateTimeFormat('sv-SE', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d)
  return p.replace(' ', 'T')
}

/** Valor de <input type="datetime-local"> (hora de España) → ISO */
export function madridInputToIso(value: string): string | null {
  if (!value) return null
  const [date, time] = value.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [h, mi] = (time ?? '00:00').split(':').map(Number)
  const wall = Date.UTC(y, m - 1, d, h, mi)
  let utc = wall - tzOffsetMinutes(wall) * 60000
  utc = wall - tzOffsetMinutes(utc) * 60000
  return Number.isNaN(utc) ? null : new Date(utc).toISOString()
}

const shortDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ })
const shortTime = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
export const formatShortDate = (iso: string) => shortDate.format(new Date(iso))
export const formatTime = (iso: string) => shortTime.format(new Date(iso))
