import { Link } from 'react-router-dom'
import sansuguslogo from '../img/sansugus-logo.svg'
import elephant from'../img/elephant.svg'
import insanz from '../img/insanz.svg'

function Footer(){

    const links = {
        "Instagram":"https://www.instagram.com/sansuguscf/",
        "TikTok":"https://www.tiktok.com/@sansuguscf"
    }

    function openLink(link:string){
        window.open(link,'_blank');
    }
    return(
        <footer className='border-t border-border bg-black'>
            <div className='h-1 w-full bg-teamOrange' />
            <div className='mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3'>
                <div className='flex flex-col items-center gap-4 text-center md:items-start md:text-left'>
                    <div className='flex items-center gap-3'>
                        <img src={sansuguslogo} alt='Sansugus FC' className='h-14 w-14' />
                        <span className='font-display text-3xl text-white'>Sansugus <span className='text-teamOrange'>FC</span></span>
                    </div>
                    <p className='max-w-xs text-sm text-muted-foreground'>Club de fútbol 7. Pasión, equipo y compromiso en cada partido.</p>
                    <div className='flex gap-4'>
                        <svg onClick={()=>openLink(links['Instagram'])} xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 fill-white/70 transition hover:cursor-pointer hover:fill-teamOrange" viewBox="0 0 448 512">
                            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                        </svg>
                        <svg onClick={()=>openLink(links['TikTok'])} xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 fill-white/70 transition hover:cursor-pointer hover:fill-teamOrange" viewBox="0 0 448 512">
                            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                        </svg>
            
                    </div>
                </div>
                <div className='flex flex-col items-center gap-2 md:items-start'>
                    <h4 className='mb-2 text-lg text-teamOrange'>Navegación</h4>
                    <Link className='text-sm text-white/70 hover:text-white' to='/Home'>Inicio</Link>
                    <Link className='text-sm text-white/70 hover:text-white' to='/Players'>Plantilla</Link>
                    <Link className='text-sm text-white/70 hover:text-white' to='/Games'>Partidos</Link>
                    <Link className='text-sm text-white/70 hover:text-white' to='/Honors'>Palmarés</Link>
                </div>
                <div className='flex flex-col items-center gap-4 md:items-start'>
                    <h4 className='mb-2 text-lg text-teamOrange'>Patrocinadores</h4>
                    <div className='flex items-center gap-6'>
                        <a href="https://www.elephantspain.com/"><img src={elephant} alt='Elephant Logo' className='h-14 w-auto opacity-80 transition hover:opacity-100'/></a>
                        <a href='https://ascensoresinsanz.wordpress.com/'><img src={insanz} alt="Insanz Logo" className='h-14 w-auto opacity-80 transition hover:opacity-100'/></a>
                    </div>
                </div>
            </div>
            <div className='border-t border-border py-4 text-center text-xs uppercase tracking-widest text-muted-foreground'>
                © {new Date().getFullYear()} Sansugus FC · Web oficial
            </div>
        </footer>
    )
}

export default Footer;
