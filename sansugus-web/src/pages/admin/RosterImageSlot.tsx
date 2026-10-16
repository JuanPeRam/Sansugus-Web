import { useRef, useState } from 'react'
import { ImagePlus, Shirt, Trash2, User } from 'lucide-react'
import { removeRosterImage, uploadRosterImage, type RosterImageKind } from '@/data/adminApi'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/admin/ui'
import { errorText } from './adminUtils'

const LABELS: Record<RosterImageKind, { title: string; hint: string }> = {
  photo: { title: 'Foto', hint: 'Foto del jugador esta temporada (mejor PNG con fondo transparente)' },
  shirt: { title: 'Camiseta', hint: 'Camiseta con el dorsal que se muestra en las actas (mejor PNG con fondo transparente)' },
}

/**
 * Hueco para subir, cambiar o quitar la foto o la camiseta de un jugador en una
 * temporada. Se guarda al momento (no depende de la barra de «Guardar»).
 */
export function RosterImageSlot({
  seasonId, playerId, playerName, kind, url, disabled, onChange, onError,
}: {
  seasonId: number
  playerId: number
  playerName: string
  kind: RosterImageKind
  url: string | null
  disabled?: boolean
  onChange: (url: string | null) => void
  onError: (message: string | undefined) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const { title, hint } = LABELS[kind]
  const Icon = kind === 'photo' ? User : Shirt

  const run = async (action: () => Promise<string | null>) => {
    setBusy(true)
    onError(undefined)
    try {
      onChange(await action())
    } catch (err) {
      onError(`${title} de ${playerName}: ${errorText(err, 'No se pudo subir la imagen')}`)
    } finally {
      setBusy(false)
    }
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) void run(() => uploadRosterImage(seasonId, playerId, kind, file, url))
  }

  const onRemove = () => {
    if (window.confirm(`¿Quitar la ${title.toLowerCase()} de ${playerName} en esta temporada?`)) {
      void run(async () => { await removeRosterImage(seasonId, playerId, kind, url); return null })
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      {title}
      <div className="relative">
        <button
          type="button"
          title={hint}
          disabled={disabled || busy}
          onClick={() => input.current?.click()}
          aria-label={`${url ? 'Cambiar' : 'Subir'} ${title.toLowerCase()} de ${playerName}`}
          className={cn(
            'flex size-14 items-center justify-center overflow-hidden rounded-md border bg-secondary transition hover:border-teamOrange disabled:cursor-not-allowed disabled:opacity-50',
            url ? 'border-border' : 'border-dashed border-muted-foreground/40',
          )}
        >
          {busy ? (
            <Spinner />
          ) : url ? (
            <img src={url} alt="" className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <span className="flex flex-col items-center text-muted-foreground/70">
              <Icon className="size-5" aria-hidden />
              <ImagePlus className="-mt-1 ml-4 size-3" aria-hidden />
            </span>
          )}
        </button>
        {url && !busy && !disabled && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Quitar ${title.toLowerCase()} de ${playerName}`}
            className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 text-red-400 hover:text-red-300"
          >
            <Trash2 className="size-3" />
          </button>
        )}
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={onFile} />
      </div>
    </div>
  )
}
