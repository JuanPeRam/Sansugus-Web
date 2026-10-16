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

/** Partidos: área de penalti en perspectiva isométrica, con la portería al fondo y el balón en el punto de penalti */
export function PenaltyAreaIllustration({ className }: Props) {
  return (
    <svg viewBox='0 0 120 120' className={className} aria-hidden>
      <g {...stroke} strokeWidth={3}>
        <path d='M40.6 35.1 L11.9 51.7 L79.4 90.7 L108.1 74.1 Z' />
        <path d='M54.1 42.9 L44.0 48.8 L84.5 72.2 L94.6 66.3' />
        <path d='M52.8 76.3 L50.8 76.0 L48.9 75.7 L47.1 75.2 L45.4 74.6 L43.8 73.9 L42.3 73.2 L40.9 72.3 L39.8 71.4 L38.8 70.4 L37.9 69.3 L37.3 68.2 L36.9 67.1' />
      </g>
      <g {...stroke}>
        <path d='M64.7 31.5 L73.1 31.0 L73.1 44.2 M68.6 33.7 L77.0 33.3 L77.0 46.4 M72.4 36.0 L80.9 35.5 L80.9 48.6 M76.3 38.2 L84.7 37.7 L84.7 50.9 M80.1 40.4 L88.6 39.9 L88.6 53.1 M84.0 42.7 L92.4 42.2 L92.4 55.3 M69.3 37.6 L96.3 53.2 M69.3 33.2 L96.3 48.8' strokeWidth={1.6} opacity={0.7} />
        <path d='M60.8 46.8 L69.3 42.0 L96.3 57.6 L87.9 62.4' strokeWidth={1.2} opacity={0.6} />
        <path d='M60.8 29.3 L69.3 28.8 L69.3 42.0 M87.9 44.9 L96.3 44.4 L96.3 57.6 M69.3 28.8 L96.3 44.4 M69.3 42.0 L96.3 57.6' strokeWidth={2.2} opacity={0.9} />
        <path d='M60.8 46.8 L60.8 29.3 L87.9 44.9 L87.9 62.4' strokeWidth={4} />
      </g>
      <ellipse cx='55.8' cy='65.4' rx='5.6' ry='2.6' fill='currentColor' opacity={0.3} />
      <circle cx='55.8' cy='59.6' r='5.6' fill='hsl(var(--card))' stroke='currentColor' strokeWidth={2.2} />
      <path d='M53.6 58.1 l2.2 -1.6 l2.2 1.6 l-0.85 2.6 h-2.7 z' fill='currentColor' />
    </svg>
  )
}

/** Clasificación: tabla de la liga con la cabecera y una fila destacada */
export function TableIllustration({ className }: Props) {
  const rows = [44, 58, 72, 86, 100]
  return (
    <svg viewBox='0 0 120 120' className={className} aria-hidden>
      <rect {...stroke} x='10' y='16' width='100' height='94' rx='4' />
      <path fill='currentColor' opacity={0.85} d='M10 20 a4 4 0 0 1 4 -4 h92 a4 4 0 0 1 4 4 v12 h-100 z' />
      <rect x='12' y='51' width='96' height='14' fill='currentColor' opacity={0.28} />
      <path {...stroke} strokeWidth={2} d={rows.slice(0, -1).map((y) => `M10 ${y + 7} H110`).join(' ')} />
      <path {...stroke} strokeWidth={2} d='M30 32 V110 M86 32 V110' />
      {rows.map((y, i) => (
        <g key={y}>
          <text x='20' y={y + 4} textAnchor='middle' fontSize='11' fontWeight='700' fill='currentColor' fontFamily='inherit'>{i + 1}</text>
          <rect x='36' y={y - 2} width={[40, 32, 44, 28, 36][i]} height='4' rx='2' fill='currentColor' opacity={0.7} />
          <text x='98' y={y + 4} textAnchor='middle' fontSize='11' fontWeight='700' fill='currentColor' fontFamily='inherit'>{[9, 7, 6, 4, 3][i]}</text>
        </g>
      ))}
    </svg>
  )
}
