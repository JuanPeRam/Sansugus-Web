import { forwardRef, useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, Save, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export { Input }

export const Spinner = ({ className }: { className?: string }) => <Loader2 className={cn('animate-spin', className ?? 'size-5')} aria-hidden />

/** Mensaje de error de una acción del panel */
export function ActionError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mb-4 flex items-start gap-2 rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /> {message}
    </p>
  )
}

export function Notice({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <p className={cn('rounded-sm border px-4 py-3 text-sm', tone === 'warn' ? 'border-teamOrange/50 bg-teamOrange/10 text-orange-200' : 'border-border bg-secondary text-muted-foreground')}>
      {children}
    </p>
  )
}

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}

export const NativeSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn('h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)}
    {...props}
  >
    {children}
  </select>
))
NativeSelect.displayName = 'NativeSelect'

export function Checkbox({ label, className, ...props }: { label: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-sm', className)}>
      <input type="checkbox" className="size-4 accent-[var(--orange-main)]" {...props} /> {label}
    </label>
  )
}

/** Campo numérico entero ≥ 0 (vacío = null si allowEmpty) */
export function NumberInput({
  value, onChange, allowEmpty = false, className, ...props
}: {
  value: number | null
  onChange: (value: number | null) => void
  allowEmpty?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <Input
      type="number" inputMode="numeric" min={0} step={1}
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value
        if (raw === '') return onChange(allowEmpty ? null : 0)
        const n = Math.max(0, Math.trunc(Number(raw)))
        onChange(Number.isFinite(n) ? n : 0)
      }}
      className={cn('h-10 w-20 px-2 text-center tabular-nums', className)}
      {...props}
    />
  )
}

export function Badge({ children, tone = 'soft' }: { children: React.ReactNode; tone?: 'soft' | 'orange' | 'win' | 'loss' }) {
  const tones = {
    soft: 'bg-secondary text-muted-foreground',
    orange: 'bg-teamOrange text-black',
    win: 'bg-emerald-500/15 text-emerald-300',
    loss: 'bg-red-500/15 text-red-300',
  }
  return <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest', tones[tone])}>{children}</span>
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-display text-2xl text-white">{title}</p>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ErrorState({ description, onRetry }: { description?: string; onRetry?: () => void }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-display text-2xl text-white">No se han podido cargar los datos</p>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {onRetry && <Button className="mt-4" variant="outline" onClick={onRetry}>Reintentar</Button>}
    </div>
  )
}

export function Skeletons({ rows = 4, className = 'h-14' }: { rows?: number; className?: string }) {
  return <div className="space-y-2 p-4">{Array.from({ length: rows }).map((_, i) => <div key={i} className={cn('animate-pulse rounded-md bg-muted', className)} />)}</div>
}

export const changesLabel = (n: number) => (n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`)

/**
 * Barra fija al pie: indica cuántos cambios hay sin guardar y permite guardarlos todos
 * de una vez o descartarlos. Tras guardar muestra «Cambios guardados».
 */
export function SaveBar({
  changes, saving, onSave, onDiscard, savedAt, saveLabel = 'Guardar cambios',
}: {
  changes: number
  saving: boolean
  onSave: () => void
  onDiscard: () => void
  /** Date.now() del último guardado correcto */
  savedAt?: number
  saveLabel?: string
}) {
  const [, tick] = useState(0)
  const justSaved = !!savedAt && Date.now() - savedAt < 4000
  useEffect(() => {
    if (!justSaved) return
    const t = window.setTimeout(() => tick((n) => n + 1), 4000)
    return () => window.clearTimeout(t)
  }, [justSaved, savedAt])

  if (changes === 0 && !saving) {
    if (!justSaved) return null
    return (
      <div role="status" className="sticky bottom-4 z-20 mt-6 flex items-center gap-2 rounded-sm bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg">
        <CheckCircle2 className="size-5" aria-hidden /> Cambios guardados
      </div>
    )
  }
  return (
    <div role="region" aria-label="Cambios sin guardar"
      className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-teamOrange bg-black px-5 py-3 shadow-lg shadow-black/60">
      <p className="flex items-center gap-2 font-semibold">
        <span className="size-2.5 rounded-full bg-teamOrange" aria-hidden /> {changesLabel(changes)}
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onDiscard}><Undo2 className="mr-1 size-4" aria-hidden /> Descartar</Button>
        <Button type="button" size="sm" disabled={saving} onClick={onSave} className="bg-teamOrange text-black hover:bg-teamOrange-light">
          <Save className="mr-1 size-4" aria-hidden /> {saving ? 'Guardando…' : saveLabel}
        </Button>
      </div>
    </div>
  )
}
