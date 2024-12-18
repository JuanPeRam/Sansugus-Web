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
  return (
    <>

      <Router>
        <NavBar />
        <main className='main-content w-full bg-black  bg-dot-white/[0.1] relative flex items-center justify-center'>
          <div className="z-[-2] absolute pointer-events-none inset-0 flex items-center justify-center  bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <Routes>
            <Route path='/Players' Component={Players} />
            <Route path={'/'} Component={Home} />
            <Route path={'/Home'} Component={Home} />
            <Route path='/Games' Component={Games} />
            <Route path='/Game' Component={GameData} />
            <Route path="*" Component={NotFound} />
          </Routes>
        </main>
      </Router>
      <Footer />
    </>
  )
}

export default App
