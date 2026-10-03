import { Ranking } from './ranking/Ranking'
import { LastMatch } from './team/LastMatch'
import { NextMatch } from './team/NextMatch'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchGames, getLastMatch, getNextMatch } from '@/constants/data/sheetsData/webmatches'
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
                const res = await fetchGames()
                setLastMatch(getLastMatch(res))
                setNextMatch(getNextMatch(res))
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
                <div className='absolute -right-24 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-teamOrange/20 blur-3xl' />
                <div className='absolute inset-y-0 right-0 -z-10 hidden w-1/3 md:block'
                    style={{ background: 'repeating-linear-gradient(115deg, rgba(227,127,12,.22) 0 16px, transparent 16px 48px)' }} />
                <div className='mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-5 py-16 md:flex-row md:py-28'>
                    <div className='flex-1 text-center md:text-left'>
                        <span className='eyebrow'>Fútbol 7 · Web oficial</span>
                        <h1 className='mt-4 text-6xl text-white md:text-8xl'>
                            Sansugus<br /><span className='text-teamOrange'>FC</span>
                        </h1>
                        <p className='mx-auto mt-6 max-w-lg text-lg text-white/70 md:mx-0'>
                            Una plantilla, un escudo y un único objetivo: competir cada fin de semana y ganar.
                        </p>
                        <div className='mt-8 flex flex-wrap justify-center gap-4 md:justify-start'>
                            <Link to='/Games' className='btn-club'>Ver partidos</Link>
                            <Link to='/Players' className='btn-ghost'>Conocer la plantilla</Link>
                        </div>
                    </div>
                    <img src={sansuguslogo} alt='Escudo Sansugus FC' className='h-44 w-44 drop-shadow-[0_0_40px_rgba(227,127,12,.45)] md:h-72 md:w-72' />
                </div>
            </section>

            <div className='page-container flex flex-col gap-14'>
                {/* PARTIDOS */}
                <section className='grid gap-6 lg:grid-cols-2'>
                    <article className='panel panel-accent flex flex-col'>
                        <h2 className='section-title p-5 pb-0'>Último partido</h2>
                        <LastMatch error={error} result={lastMatch} loading={isLoading} />
                    </article>
                    <article className='panel panel-accent flex flex-col'>
                        <h2 className='section-title p-5 pb-0'>Próximo partido</h2>
                        <NextMatch error={error} result={nextMatch} loading={isLoading} />
                    </article>
                </section>

                {/* CLASIFICACIÓN */}
                <section>
                    <h2 className='section-title mb-6'>Clasificación</h2>
                    <div className='panel overflow-x-auto'>
                        <Ranking />
                    </div>
                </section>

                {/* ACCESOS */}
                <section className='grid gap-6 md:grid-cols-3'>
                    {[
                        { to: '/Players', title: 'Plantilla', text: 'Estadísticas de cada jugador', n: '01' },
                        { to: '/Games', title: 'Partidos', text: 'Resultados y actas', n: '02' },
                        { to: '/Honors', title: 'Palmarés', text: 'Títulos y trofeos del club', n: '03' },
                    ].map((item) => (
                        <Link key={item.to} to={item.to} className='group relative isolate flex h-48 flex-col justify-end overflow-hidden rounded-sm border border-border bg-card p-6 transition hover:border-teamOrange'>
                            <span className='absolute right-4 top-0 -z-10 select-none font-display text-[8rem] leading-none text-white/[0.05] transition group-hover:text-teamOrange/20'>{item.n}</span>
                            <span className='absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-teamOrange transition duration-300 group-hover:scale-x-100' />
                            <h3 className='text-4xl text-white'>{item.title}</h3>
                            <p className='text-sm text-white/60'>{item.text}</p>
                        </Link>
                    ))}
                </section>
            </div>
        </>
    )
}

export default Home
