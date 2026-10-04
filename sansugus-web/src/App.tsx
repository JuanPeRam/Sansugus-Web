import './App.css'
import { lazy, Suspense } from 'react'
import NavBar from './components/NavBar'
import Players from './components/players/Players'
import Home from './components/home/Home'
import NotFound from '@/components/NotFound'
import Footer from '@/components/Footer'
import Games from '@/components/games/Games'
import GameData from '@/components/games/game_stats/GameData'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Honors } from '@/components/honors/Honors'

// Área de administración: carga aparte (no pesa en la web pública)
const AdminArea = lazy(() => import('@/pages/admin/AdminArea'))

function PublicSite() {
  return (
    <>
      <NavBar />
      <main className='main-content'>
        <Routes>
          <Route path='/Players' Component={Players} />
          <Route path={'/'} Component={Home} />
          <Route path={'/Home'} Component={Home} />
          <Route path='/Games' Component={Games} />
          <Route path='/Game' Component={GameData} />
          <Route path='/Honors' Component={Honors} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin/*' element={
          <Suspense fallback={<div className='flex min-h-screen items-center justify-center text-teamOrange'>Cargando…</div>}>
            <AdminArea />
          </Suspense>
        } />
        <Route path='*' element={<PublicSite />} />
      </Routes>
    </Router>
  )
}

export default App
