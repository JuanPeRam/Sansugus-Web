import { useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { CalendarDays, Home, ListOrdered, Trophy, Users } from 'lucide-react'
import sansuguslogo from '../img/sansugus-logo.svg'

const pages = [
  { name: 'Inicio', path: '/Home', Icon: Home },
  { name: 'Plantilla', path: '/Players', Icon: Users },
  { name: 'Partidos', path: '/Games', Icon: CalendarDays },
  { name: 'Clasificación', short: 'Clasif.', path: '/Standings', Icon: ListOrdered },
  { name: 'Palmarés', path: '/Honors', Icon: Trophy },
]

/** La portada vive en «/» y en «/Home»; el acta de un partido cuelga de «Partidos» */
function isActive(path: string, pathname: string) {
  if (path === '/Home') return pathname === '/' || pathname === '/Home'
  if (path === '/Games') return pathname === '/Games' || pathname === '/Game'
  return pathname === path
}

function NavBar() {
  const { pathname } = useLocation()
  // Al cambiar de sección se vuelve arriba. Con llaves: en Chrome reciente scrollTo devuelve una
  // Promise y React la tomaría como función de limpieza del efecto («n is not a function»)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <>
      <header className='sticky top-0 z-50 border-b border-border bg-black/90 backdrop-blur'>
        <div className='h-1 w-full bg-teamOrange' />
        <nav aria-label='Principal' className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-5'>
          <Link to='/' className='flex items-center gap-3'>
            <img src={sansuguslogo} alt='' className='h-9 w-9 md:h-10 md:w-10' />
            <span className='font-display text-xl text-white md:text-2xl'>
              Sansugus <span className='text-teamOrange'>FC</span>
            </span>
          </Link>

          <ul className='hidden items-center gap-1 md:flex'>
            {pages.map((page) => (
              <li key={page.path}>
                <NavLink
                  to={page.path}
                  className={() =>
                    `relative block px-4 py-2 font-display text-lg transition-colors hover:text-teamOrange ${
                      isActive(page.path, pathname) ? 'text-teamOrange after:absolute after:inset-x-4 after:-bottom-[13px] after:h-[3px] after:bg-teamOrange' : 'text-white/80'
                    }`
                  }
                >
                  {page.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Móvil: pestañas fijas abajo, al alcance del pulgar */}
      <nav aria-label='Secciones' className='fixed inset-x-0 bottom-0 z-50 border-t border-border bg-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden'>
        <ul className='grid grid-cols-5'>
          {pages.map(({ name, short, path, Icon }) => {
            const active = isActive(path, pathname)
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  aria-label={short ? name : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide transition-colors min-[400px]:text-[11px] ${active ? 'text-teamOrange' : 'text-white/60 hover:text-white'}`}
                >
                  {active && <span className='absolute inset-x-4 top-0 h-0.5 bg-teamOrange' aria-hidden />}
                  <Icon className='h-5 w-5' aria-hidden />
                  {short ?? name}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

export default NavBar
