import { useEffect, useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { getShirtImage } from '@/rendering/shirts_img'

/**
 * Camiseta de repuesto, en el estilo de las reales: naranja con el nombre y el
 * dorsal en negro. Se usa si el jugador no tiene imagen o esta no carga.
 */
export function FallbackShirt({ name, number, className }: { name: string; number: number | null; className?: string }) {
  const id = useId().replace(/:/g, '')
  const label = (name || '').toUpperCase().slice(0, 9)
  const shown = number && number > 0 ? String(number) : ''
  return (
    <svg viewBox="0 0 200 224" className={className} role="img" aria-label={`Camiseta de ${name}${shown ? `, dorsal ${shown}` : ''}`}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F08A1E" />
          <stop offset="1" stopColor="#C2560C" />
        </linearGradient>
        <pattern id={`p${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <path
        d="M62 8 L84 3 Q100 20 116 3 L138 8 L192 40 L174 90 L150 76 L150 218 L50 218 L50 76 L26 90 L8 40 Z"
        fill={`url(#g${id})`}
        stroke="#7a3606"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M62 8 L84 3 Q100 20 116 3 L138 8 L192 40 L174 90 L150 76 L150 218 L50 218 L50 76 L26 90 L8 40 Z" fill={`url(#p${id})`} />
      {/* cuello y puños */}
      <path d="M84 3 Q100 22 116 3" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <path d="M9 41 L25 90" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <path d="M191 41 L175 90" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <text x="100" y="62" textAnchor="middle" fontFamily="'Barlow Condensed', Impact, sans-serif" fontWeight="800" fontSize={label.length > 7 ? 17 : 21} fill="#111" letterSpacing="1">
        {label}
      </text>
      {shown && (
        <text x="100" y="140" textAnchor="middle" fontFamily="'Barlow Condensed', Impact, sans-serif" fontWeight="800" fontSize={shown.length > 1 ? 82 : 96} fill="#111">
          {shown}
        </text>
      )}
    </svg>
  )
}

const LOAD_TIMEOUT_MS = 7000

/**
 * Camiseta de un jugador con tres estados: cargando (silueta animada), imagen real
 * y camiseta de repuesto. Si la imagen falla, no existe o tarda demasiado, se muestra
 * la de repuesto: nunca se queda cargando indefinidamente.
 */
export function PlayerShirt({ player, alias, number, className }: { player: string; alias: string; number: number | null; className?: string }) {
  const src = getShirtImage(player)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error')

  useEffect(() => {
    setStatus(src ? 'loading' : 'error')
    if (!src) return
    const t = window.setTimeout(() => setStatus((s) => (s === 'loading' ? 'error' : s)), LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(t)
  }, [src])

  const label = alias || player.split(' ')[0]
  if (status === 'error') return <FallbackShirt name={label} number={number} className={className} />
  return (
    <span className={cn('relative block', className)} style={{ aspectRatio: '200 / 224' }}>
      {status === 'loading' && (
        <svg viewBox="0 0 200 224" className="absolute inset-0 h-full w-full animate-pulse" aria-hidden>
          <path d="M62 8 L84 3 Q100 20 116 3 L138 8 L192 40 L174 90 L150 76 L150 218 L50 218 L50 76 L26 90 L8 40 Z" fill="rgba(255,255,255,.08)" />
        </svg>
      )}
      <img
        src={src}
        alt={`Camiseta de ${label}`}
        decoding="async"
        onLoad={() => setStatus('ok')}
        onError={() => setStatus('error')}
        className={cn('h-full w-full object-contain transition-opacity duration-300', status === 'ok' ? 'opacity-100' : 'opacity-0')}
      />
    </span>
  )
}
