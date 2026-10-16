import { Ranking } from './ranking/Ranking'
import { SponsorsSection } from '@/components/sponsors/Sponsors'
import { LastMatch } from './team/LastMatch'
import { NextMatch } from './team/NextMatch'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHomeMatches } from '@/data/api'
import { Game } from '@/types/games'
import sansuguslogo from '@/img/sansugus-logo.svg'

function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<any>(undefined)

    const [lastMatch, setLastMatch] = useState<Game | undefined>(undefined)
    const [nextMatch, setNextMatch] = useState<Game | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const { last, next } = await fetchHomeMatches()
                setLastMatch(last)
                setNextMatch(next)
            }
            catch (error) {
                setError(error)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            {/* HERO */}
            <section className='relative isolate w-full overflow-hidden border-b border-border'>
                <div className='absolute inset-0 -z-10 bg-gradient-to-br from-black via-[#111] to-[#2a1604]' />
                <div className='absolute -right-24 top-1/2 -z-10 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full bg-teamOrange/20 blur-3xl md:h-[34rem] md:w-[34rem]' />
                <div className='absolute inset-y-0 right-0 -z-10 hidden w-1/3 md:block'
                    style={{ background: 'repeating-linear-gradient(115deg, rgba(227,127,12,.22) 0 16px, transparent 16px 48px)' }} />
                <div className='mx-auto flex max-w-7xl flex-col-reverse items-center gap-6 px-5 py-10 md:flex-row md:gap-10 md:py-28'>
                    <div className='flex-1 text-center md:text-left'>
                        <span className='eyebrow'>Fútbol 7 · Web oficial</span>
                        <h1 className='mt-3 text-5xl text-white md:mt-4 md:text-8xl'>
                            Sansugus<br /><span className='text-teamOrange'>FC</span>
                        </h1>
                        <p className='mx-auto mt-4 max-w-lg text-base text-white/70 md:mx-0 md:mt-6 md:text-lg'>
                            Una plantilla, un escudo y un único objetivo: competir cada fin de semana y ganar.
                        </p>
                        <div className='mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:mt-8 md:justify-start'>
                            <Link to='/Games' className='btn-club justify-center px-3 sm:px-6'>Partidos</Link>
                            <Link to='/Players' className='btn-ghost justify-center px-3 sm:px-6'>Plantilla</Link>
                        </div>
                    </div>
                    <img src={sansuguslogo} alt='Escudo Sansugus FC' className='h-28 w-28 drop-shadow-[0_0_40px_rgba(227,127,12,.45)] md:h-72 md:w-72' />
                </div>
            </section>

            <div className='page-container flex flex-col gap-8 md:gap-14'>
                {/* PARTIDOS */}
                <section className='grid gap-4 md:gap-6 lg:grid-cols-2'>
                    <article className='panel panel-accent flex flex-col'>
                        <h2 className='section-title p-4 pb-0 text-xl md:p-5 md:pb-0 md:text-3xl'>Último partido</h2>
                        <LastMatch error={error} result={lastMatch} loading={isLoading} />
                    </article>
                    <article className='panel panel-accent flex flex-col'>
                        <h2 className='section-title p-4 pb-0 text-xl md:p-5 md:pb-0 md:text-3xl'>Próximo partido</h2>
                        <NextMatch error={error} result={nextMatch} loading={isLoading} />
                    </article>
                </section>

                {/* CLASIFICACIÓN */}
                <section>
                    <h2 className='section-title mb-6'>Clasificación</h2>
                    <Ranking />
                </section>

                {/* ACCESOS */}
                <section className='grid gap-3 md:grid-cols-3 md:gap-6'>
                    {[
                        { to: '/Players', title: 'Plantilla', text: 'Estadísticas de cada jugador', n: '01' },
                        { to: '/Games', title: 'Partidos', text: 'Resultados y actas', n: '02' },
                        { to: '/Honors', title: 'Palmarés', text: 'Títulos y trofeos del club', n: '03' },
                    ].map((item) => (
                        <Link key={item.to} to={item.to} className='group relative isolate flex h-24 flex-col justify-center overflow-hidden rounded-sm border border-border bg-card px-5 transition hover:border-teamOrange md:h-48 md:justify-end md:p-6'>
                            <span className='absolute right-4 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[5rem] leading-none text-white/[0.05] transition group-hover:text-teamOrange/20 md:top-0 md:translate-y-0 md:text-[8rem]'>{item.n}</span>
                            <span className='absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-teamOrange transition duration-300 group-hover:scale-x-100' />
                            <h3 className='text-3xl text-white md:text-4xl'>{item.title}</h3>
                            <p className='text-sm text-white/60'>{item.text}</p>
                        </Link>
                    ))}
                </section>

                {/* PATROCINADORES */}
                <SponsorsSection />
            </div>
        </>
    )
}

export default Home
