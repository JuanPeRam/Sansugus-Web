import '../styles/NavBar.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'
import sansuguslogo from '../img/sansugus-logo.svg'
function NavBar(){
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  return (
    <nav className='navbar'>
      <ul className={
        isNavExpanded ? "options-list" : "options-list none"
      }>
        <li><a href="/"><img src={sansuguslogo} alt="Sansugus Logo" /></a></li>
        <li><a href='/Home'>Inicio</a></li>
        <li><a href='/Players'>Jugadores</a></li>
        <li><a href='/Players'>Partidos</a></li>
      </ul>
      {!isNavExpanded ? 
      <FontAwesomeIcon icon={faBars} size='xl' color='#aaaaaa' className='hamburguer' onClick={()=>{setIsNavExpanded(true)}}/>:
      <FontAwesomeIcon icon={faX} size='xl' color='#aaaaaa' className='hamburguer' onClick={()=>(setIsNavExpanded(false))}/>
      }
    </nav>
  )
}

export default NavBar
