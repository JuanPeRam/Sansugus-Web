/**
 * Ilustraciones de línea para los accesos de Inicio (sustituyen a los números 01, 02, 03).
 * Usan currentColor: el color lo pone la tarjeta (tenue en reposo, naranja al pasar el ratón).
 */
type Props = { className?: string }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Plantilla: camiseta con dorsal */
export function ShirtIllustration({ className }: Props) {
  return (
    <svg viewBox='0 0 120 120' className={className} aria-hidden>
      <path {...stroke} d='M44 14 L28 20 L8 40 L22 56 L32 48 V106 H88 V48 L98 56 L112 40 L92 20 L76 14 C74 22 68 27 60 27 C52 27 46 22 44 14 Z' />
      <path {...stroke} strokeWidth={2} opacity={0.6} d='M44 14 C47 19 53 22 60 22 C67 22 73 19 76 14' />
      <text x='60' y='86' textAnchor='middle' fontSize='34' fontWeight='700' fill='currentColor' fontFamily='inherit'>7</text>
    </svg>
  )
}

/** Partidos: balón con su patrón de pentágonos */
export function BallIllustration({ className }: Props) {
  return (
    <svg viewBox='0 0 120 120' className={className} aria-hidden>
      <circle {...stroke} cx='60' cy='60' r='48' />
      <path fill='currentColor' opacity={0.85} d='M60 42 L75 53 L69 71 H51 L45 53 Z' />
      <path {...stroke} strokeWidth={2.5} d='M60 42 V22 M75 53 L94 46 M69 71 L80 88 M51 71 L40 88 M45 53 L26 46' />
      <path {...stroke} strokeWidth={2.5} d='M47 15 L60 22 L73 15 M100 37 L94 46 L101 62 M90 95 L80 88 L64 99 M30 95 L40 88 L56 99 M20 37 L26 46 L19 62' />
    </svg>
  )
}

/** Clasificación: podio con estrella en el primer puesto */
export function PodiumIllustration({ className }: Props) {
  return (
    <svg viewBox='0 0 120 120' className={className} aria-hidden>
      <path fill='currentColor' opacity={0.85} d='M60 10 L64.5 20 L75 21 L67 28 L69.5 38.5 L60 33 L50.5 38.5 L53 28 L45 21 L55.5 20 Z' />
      <path {...stroke} d='M42 48 H78 V108 H42 Z M10 66 H42 V108 H10 Z M78 78 H110 V108 H78 Z' />
      <text x='60' y='88' textAnchor='middle' fontSize='26' fontWeight='700' fill='currentColor' fontFamily='inherit'>1</text>
      <text x='26' y='96' textAnchor='middle' fontSize='18' fontWeight='700' fill='currentColor' fontFamily='inherit' opacity={0.7}>2</text>
      <text x='94' y='101' textAnchor='middle' fontSize='16' fontWeight='700' fill='currentColor' fontFamily='inherit' opacity={0.7}>3</text>
    </svg>
  )
}
