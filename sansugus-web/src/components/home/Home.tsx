import '../../styles/Home.css'
import { Ranking } from './ranking/Ranking'
import { LastMatch } from './team/LastMatch'
import { NextMatch } from './team/NextMatch'
import { useEffect, useState } from 'react'
import { fetchGames, getLastMatch, getNextMatch } from '@/constants/data/sheetsData/webmatches'
import { Game } from '@/types/games'

function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<any>(undefined)

    const [lastMatch, setLastMatch] = useState<Game | undefined>(undefined)
    const [nextMatch, setNextMatch] = useState<Game | undefined>(undefined)

    useEffect(()=>{
        const fetchData = async () => {
            try{
                setIsLoading(true)
                const res = await fetchGames()
                setLastMatch(getLastMatch(res))
                setNextMatch(getNextMatch(res))
                console.log(res)
            }
            catch(error){
                setError(error)
            }
            finally{
                setIsLoading(false)
            }
                
        }
        
        fetchData()
    }, [])
    
    return (
        <>
            <h1 className='text-4xl md:text-2xl lg:text-4xl sm:text-2xl'>Bienvenido al sitio web oficial del <span>Sansugus FC</span></h1>
            <section className='grid lg:grid-cols-10 auto-rows-[10rem] gap-5 max-w-[1500px] md:grid-cols-5'>
                <article className='one rounded-xl justify-center col-span-5 row-span-3 border p-5 flex flex-col'>
                    <h2 className='text-2xl text-center w-full'>Anterior Partido</h2>
                    <LastMatch error={error} result={lastMatch} loading={isLoading}/>
                </article>
                <article className='two rounded-xl justify-center col-span-5 row-span-2 border p-5 flex flex-col'>
                    <h2 className='text-2xl text-center w-full'>Próximo Partido</h2>
                    <NextMatch error={error} result={nextMatch} loading={isLoading}/>
                </article>
                <article className='three flex flex-col gap-2 items-start col-span-5 row-span-3 border rounded-xl p-5'>
                    <h2 className='text-2xl text-center w-full'>Clasificación Actual</h2>
                    <Ranking/>    
                </article>
                <article className='four rounded-xl col-span-5 row-span-2  border p-5 flex items-center justify-center'>
                        <h2 className='text-2xl'>Próximamente...</h2>
                </article>
            </section>
        </>
    )
}

export default Home
