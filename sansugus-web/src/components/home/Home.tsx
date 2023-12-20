import {entries} from '../../assets/blog/entries'
import '../../styles/Home.css'

function Home() {
    
    return (
        <>
            <h1 className='text-4xl'>Bienvenido al sitio web oficial del <span>Sansugus FC</span></h1>
            <h2 className="text-muted-foreground">Sitio en construcción...</h2>
            <section className='grid-home'>
                <article className='one rounded-xl'>Ver Jugadores</article>
                <article className='two rounded-xl'>Ver Partidos</article>
                <article className='three'>3</article>
                <article className='four rounded-xl'>4</article>
            </section>
        </>
    )
}

export default Home