import '../styles/NavBar.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import sansuguslogo from '../img/sansugus-logo.svg'
function NavBar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const selectedWindow = window.location.pathname;
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsNavExpanded(false);
  }

  const pages = [
    { name: 'Inicio', path: '/Home' },
    { name: 'Jugadores', path: '/Players' },
    { name: 'Partidos', path: '/Games' },
    { name: 'Palmarés', path: '/Honors' },
  ]

  return (
    <nav className='navbar'>
      <ul className={
        isNavExpanded ? "options-list" : "options-list none"
      }>
        <li className='z-10'><a href="/"><img src={sansuguslogo} alt="Sansugus Logo" /></a></li>
        {
          pages.map((page, index) => (
            <li key={index}><a onClick={() => handleNavigation(page.path)} className={selectedWindow == page.path ? 'selected' : 'text-muted-foreground'}>{page.name}</a></li>
          ))
        }
      </ul>
      {!isNavExpanded ?
        <FontAwesomeIcon icon={faBars} size='xl' color='#aaaaaa' className='hamburguer' onClick={() => { setIsNavExpanded(true) }} /> :
        <FontAwesomeIcon icon={faX} size='xl' color='#aaaaaa' className='hamburguer' onClick={() => (setIsNavExpanded(false))} />
      }
    </nav>
  )
}

export default NavBar
