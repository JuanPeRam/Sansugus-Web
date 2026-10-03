import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center'>
      <span className='eyebrow'>Fuera de juego</span>
      <h1 className='font-display text-[9rem] leading-none text-white md:text-[14rem]'>
        4<span className='text-teamOrange'>0</span>4
      </h1>
      <p className='max-w-md text-muted-foreground'>La página que buscas no está en el campo. Vuelve al área y sigue la jugada.</p>
      <Link to='/' className='btn-club'>Volver al inicio</Link>
    </div>
  )
}

export default NotFound
