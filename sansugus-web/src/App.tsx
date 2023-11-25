import { useState, Dispatch, SetStateAction, useEffect} from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Players from './components/players/Players'
import Home from './components/home/Home'
import NotFound from './components/NotFound'
import Footer from './components/Footer'
import Games from './components/games/Games'
import GameData from './components/games/game_stats/GameData'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {
  const [currentComponent, setCurrentComponent] : [undefined | JSX.Element, Dispatch<SetStateAction<undefined | JSX.Element>>] = useState()
  const pathNames: { [key: string]: JSX.Element } = {
    '/Players':<Players />,
    '/':<Home/>,
    '/Home':<Home/>,
    '/Games':<Games/>,
    '/Game':<GameData/>
  }
  useEffect(() => {
    const currentPath  = window.location.pathname
    setCurrentComponent(pathNames[currentPath] ?? <NotFound/>)
  }, [])

  



  return (
    <>
      <NavBar/>
      <main className='main-content'>
      <Router>
        <Routes>
          <Route path='/Players' Component={Players} />
          <Route path={'/'} Component={Home} />
          <Route path={'/Home'} Component={Home} />
          <Route path='/Games' Component={Games}/>
          <Route path='/Game' Component={GameData}/>
        </Routes>
      </Router>
      </main>
      <Footer/>
    </>
  )
}

export default App
