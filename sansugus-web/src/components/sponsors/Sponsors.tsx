import { useEffect, useState } from 'react'
import { fetchSponsors, type Sponsor } from '@/data/api'
import { cn } from '@/lib/utils'

/** Si la base de datos no responde, se muestran los patrocinadores de siempre */
const FALLBACK: Sponsor[] = [
  { id: -1, name: 'Dos Puntos Real Estate', logoUrl: '/resources/img/sponsors/dospuntos.png', webUrl: 'https://www.2puntos.es', monochrome: true },
  { id: -2, name: 'Ascensores Insanz', logoUrl: '/resources/img/sponsors/insanz.svg', webUrl: 'https://ascensoresinsanz.wordpress.com/', monochrome: true },
]

// Una sola petición para Inicio y el pie de página
let cache: Promise<Sponsor[]> | undefined
const loadSponsors = () => (cache ??= fetchSponsors().catch((err) => {
  console.error(err)
  cache = undefined
  return FALLBACK
}))

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>()
  useEffect(() => {
    let active = true
    loadSponsors().then((list) => active && setSponsors(list))
    return () => { active = false }
  }, [])
  return sponsors
}

/** Logo del patrocinador; en blanco si está marcado como monocromo. Sin logo, su nombre. */
function SponsorLogo({ sponsor, className }: { sponsor: Sponsor; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!sponsor.logoUrl || failed) {
    return <span className={cn('text-center font-display text-xl uppercase leading-tight text-white md:text-2xl', className)}>{sponsor.name}</span>
  }
  return (
    <img
      src={sponsor.logoUrl}
      alt={sponsor.name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-contain', sponsor.monochrome && '[filter:brightness(0)_invert(1)]', className)}
    />
  )
}

/** Enlace a la web del patrocinador (o bloque sin enlace si no tiene) */
function SponsorLink({ sponsor, className, children }: { sponsor: Sponsor; className?: string; children: React.ReactNode }) {
  return sponsor.webUrl ? (
    <a href={sponsor.webUrl} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name} title={sponsor.name} className={className}>{children}</a>
  ) : (
    <div title={sponsor.name} className={className}>{children}</div>
  )
}

/**
 * Sección de patrocinadores de la portada: rejilla de fichas oscuras con los logos
 * en blanco sobre un fondo negro con un haz de luz naranja.
 */
export function SponsorsSection() {
  const sponsors = useSponsors()
  if (sponsors && sponsors.length === 0) return null

  return (
    <section aria-labelledby="sponsors-title" className="relative isolate overflow-hidden rounded-sm border border-border bg-[#0b0b0b] px-3 py-10 sm:px-6 md:px-10 md:py-16">
      {/* Haz de luz naranja en diagonal y grano sutil */}
      <div aria-hidden className="pointer-events-none absolute -right-1/4 -top-1/3 -z-10 h-[140%] w-2/3 rotate-[28deg] bg-gradient-to-b from-teamOrange/40 via-teamOrange/15 to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-teamOrange/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:4px_4px]" />

      <header className="mb-8 text-center md:mb-12">
        <span className="eyebrow">Gracias a</span>
        <h2 id="sponsors-title" className="mt-2 text-4xl text-white md:text-5xl">Patrocinadores</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 md:text-base">
          Sansugus FC sale al campo cada fin de semana gracias a la colaboración de…
        </p>
      </header>

      <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        {(sponsors ?? [undefined, undefined, undefined]).map((s, i) => (
          <li key={s?.id ?? `s${i}`} className="w-[calc(50%-0.25rem)] sm:w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.667rem)]">
            {s ? (
              <SponsorLink
                sponsor={s}
                className="group relative flex h-28 items-center justify-center overflow-hidden border border-white/[0.06] bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-sm transition duration-300 hover:border-teamOrange/60 hover:from-teamOrange/20 hover:to-teamOrange/[0.04] focus-visible:border-teamOrange focus-visible:outline-none md:h-36 md:px-8"
              >
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-teamOrange transition duration-300 group-hover:scale-x-100" />
                <SponsorLogo sponsor={s} className="max-h-12 max-w-full opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100 md:max-h-16" />
              </SponsorLink>
            ) : (
              <div className="h-28 animate-pulse border border-white/[0.06] bg-white/[0.04] md:h-36" />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Versión compacta para el pie de página */
export function SponsorsStrip() {
  const sponsors = useSponsors()
  if (!sponsors || sponsors.length === 0) return null
  return (
    <ul className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      {sponsors.map((s) => (
        <li key={s.id}>
          <SponsorLink sponsor={s} className="group flex h-14 w-32 items-center justify-center border border-white/[0.06] bg-white/[0.04] px-3 transition hover:border-teamOrange/60 hover:bg-teamOrange/10 md:h-16 md:w-36">
            <SponsorLogo sponsor={s} className="max-h-8 max-w-full opacity-75 transition group-hover:opacity-100 md:max-h-9" />
          </SponsorLink>
        </li>
      ))}
    </ul>
  )
}
