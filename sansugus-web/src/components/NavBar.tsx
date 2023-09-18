import '../styles/NavBar.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'
import sansuguslogo from '../img/sansugus-logo.svg'
function NavBar(){
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const selectedWindow = window.location.pathname;

  console.log(selectedWindow)

  return (
    <nav className='navbar'>
      <ul className={
        isNavExpanded ? "options-list" : "options-list none"
      }>
        <li><a href="/"><img src={sansuguslogo} alt="Sansugus Logo" /></a></li>
        <li><a href='/Home' className={selectedWindow=='/Home'?'selected':''}>Inicio</a></li>
        <li><a href='/Players' className={selectedWindow=='/Players'?'selected':''}>Jugadores</a></li>
        <li><a href='/Games' className={selectedWindow=='/Games'?'selected':''}>Partidos</a></li>
      </ul>
      {!isNavExpanded ? 
      <FontAwesomeIcon icon={faBars} size='xl' color='#aaaaaa' className='hamburguer' onClick={()=>{setIsNavExpanded(true)}}/>:
      <FontAwesomeIcon icon={faX} size='xl' color='#aaaaaa' className='hamburguer' onClick={()=>(setIsNavExpanded(false))}/>
      }
    </nav>
  )
}

export default NavBar
