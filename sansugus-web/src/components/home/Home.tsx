import '../../styles/Home.css'
import { Ranking } from './ranking/Ranking'
import { LastMatch } from './team/LastMatch'
import { NextMatch } from './team/NextMatch'

function Home() {
    
    return (
        <>
            <h1 className='text-4xl md:text-2xl lg:text-4xl sm:text-2xl'>Bienvenido al sitio web oficial del <span>Sansugus FC</span></h1>
            <section className='grid lg:grid-cols-10 auto-rows-[10rem] gap-5 w-full max-w-[1500px] md:grid-cols-5'>
                <article className='one rounded-xl justify-center col-span-5 row-span-3 border border-white p-5'>
                    <h2 className='text-2xl text-center w-full'>Próximo Partido</h2>
                    <NextMatch/>
                </article>
                <article className='two rounded-xl justify-center col-span-5 row-span-2 border border-white p-5'>
                    <h2 className='text-2xl text-center w-full'>Anterior Partido</h2>
                    <LastMatch/>
                </article>
                <article className='three flex flex-col gap-2 items-start col-span-5 row-span-3 border border-white rounded-xl p-5'>
                    <h2 className='text-2xl text-center w-full'>Clasificación Actual</h2>
                    <Ranking/>    
                </article>
                <article className='four rounded-xl col-span-5 row-span-2 border-white border p-5'>

                </article>
            </section>
        </>
    )
}

export default Home