import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getShieldImage } from '@/rendering/teams_img'
import sansuguslogo from '@/img/sansugus-logo.svg'

const CLUB = 'Sansugus FC'

/** Iniciales de un equipo: las dos primeras palabras significativas */
export function teamInitials(name: string): string {
  const words = name
    .replace(/[´'’`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w && !['de', 'del', 'la', 'el', 'los', 'las', 'fc', 'cf', 'club'].includes(w.toLowerCase()))
  const list = words.length ? words : [name.trim() || '?']
  // una sola palabra: sus dos primeras letras; si hay más, la inicial de las dos primeras
  const letters = list.length === 1 ? list[0].slice(0, 2) : list.slice(0, 2).map((w) => w[0]).join('')
  return letters.toUpperCase()
}

/**
 * Escudo de un equipo. Si no hay imagen registrada o falla la carga, muestra un
 * escudo con las iniciales (nunca se queda cargando ni deja un icono roto).
 */
export function TeamCrest({ name, className }: { name: string; className?: string }) {
  const src = name === CLUB ? sansuguslogo : getShieldImage(name)
  const [failed, setFailed] = useState(!src)
  useEffect(() => setFailed(!src), [src])

  if (failed) {
    return (
      <span
        role="img"
        aria-label={name}
        className={cn('relative inline-flex items-center justify-center font-display text-white', className)}
        style={{ aspectRatio: '1 / 1.12' }}
      >
        <svg viewBox="0 0 100 112" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="crest-fb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2e2e2e" />
              <stop offset="1" stopColor="#0d0d0d" />
            </linearGradient>
          </defs>
          <path d="M50 3 L93 16 V56 C93 82 74 100 50 109 C26 100 7 82 7 56 V16 Z" fill="url(#crest-fb)" stroke="#E37F0C" strokeWidth="4" strokeLinejoin="round" />
          <path d="M50 11 L85 21 V56 C85 77 70 92 50 100 C30 92 15 77 15 56 V21 Z" fill="none" stroke="rgba(227,127,12,.35)" strokeWidth="1.5" />
        </svg>
        <span className="relative text-[1.6em] leading-none tracking-wide">{teamInitials(name)}</span>
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className={cn('object-contain', className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
