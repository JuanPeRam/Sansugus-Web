import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import sansuguslogo from '../img/sansugus-logo.svg'

const pages = [
  { name: 'Inicio', path: '/Home' },
  { name: 'Plantilla', path: '/Players' },
  { name: 'Partidos', path: '/Games' },
  { name: 'Palmarés', path: '/Honors' },
]

function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-black/90 backdrop-blur'>
      <div className='h-1 w-full bg-teamOrange' />
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-5'>
        <Link to='/' className='flex items-center gap-3' onClick={() => setOpen(false)}>
          <img src={sansuguslogo} alt='Sansugus FC' className='h-10 w-10' />
          <span className='font-display text-2xl text-white'>
            Sansugus <span className='text-teamOrange'>FC</span>
          </span>
        </Link>

        <ul className='hidden items-center gap-1 md:flex'>
          {pages.map((page) => (
            <li key={page.path}>
              <NavLink
                to={page.path}
                className={({ isActive }) =>
                  `relative block px-4 py-2 font-display text-lg transition-colors hover:text-teamOrange ${
                    isActive ? 'text-teamOrange after:absolute after:inset-x-4 after:-bottom-[13px] after:h-[3px] after:bg-teamOrange' : 'text-white/80'
                  }`
                }
              >
                {page.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          aria-label='Menú'
          className='text-white md:hidden'
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {open && (
        <ul className='absolute left-0 top-full flex h-[calc(100vh-4.25rem)] w-full flex-col justify-center gap-2 bg-black/95 px-8 md:hidden'>
          {pages.map((page) => (
            <li key={page.path}>
              <NavLink
                to={page.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block border-b border-border py-4 font-display text-5xl ${isActive ? 'text-teamOrange' : 'text-white'}`
                }
              >
                {page.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default NavBar
