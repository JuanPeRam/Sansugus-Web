import '../../styles/Home.css'
import { Ranking } from './ranking/Ranking'

function Home() {
    
    return (
        <>
            <h1 className='text-4xl'>Bienvenido al sitio web oficial del <span>Sansugus FC</span></h1>
            <h2 className="text-muted-foreground">Sitio en construcción...</h2>
            <section className='grid-home'>
                <article className='one rounded-xl justify-center'><p className='p-2 bg-opacity-75 bg-[#a7b8bf] rounded-xl'>Ver Jugadores</p></article>
                <article className='two rounded-xl justify-center'><p className='p-2 bg-opacity-75 bg-[#599d9c] rounded-xl'>Ver partidos</p></article>
                <article className='three flex flex-col gap-2 items-start'>
                    <h2 className='text-2xl'>Clasificación</h2>
                    <Ranking/>    
                </article>
                <article className='four rounded-xl'></article>
            </section>
        </>
    )
}

export default Home