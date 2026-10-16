import './App.css'
import { lazy, Suspense } from 'react'
import NavBar from './components/NavBar'
import Players from './components/players/Players'
import Home from './components/home/Home'
import NotFound from '@/components/NotFound'
import Footer from '@/components/Footer'
import Games from '@/components/games/Games'
import GameData from '@/components/games/game_stats/GameData'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Honors } from '@/components/honors/Honors'
import Standings from '@/components/standings/Standings'

// Área de administración: carga aparte (no pesa en la web pública)
const AdminArea = lazy(() => import('@/pages/admin/AdminArea'))

function PublicSite() {
  const { pathname } = useLocation()
  return (
    // En móvil se deja sitio abajo para las pestañas fijas
    <div className='flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0'>
      <NavBar />
      <main className='main-content'>
        <ErrorBoundary resetKey={pathname}>
          <Routes>
            <Route path='/Players' Component={Players} />
            <Route path={'/'} Component={Home} />
            <Route path={'/Home'} Component={Home} />
            <Route path='/Games' Component={Games} />
            <Route path='/Game' Component={GameData} />
            <Route path='/Honors' Component={Honors} />
            <Route path='/Standings' Component={Standings} />
            <Route path="*" Component={NotFound} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin/*' element={
          <ErrorBoundary>
            <Suspense fallback={<div className='flex min-h-screen items-center justify-center text-teamOrange'>Cargando…</div>}>
              <AdminArea />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path='*' element={<PublicSite />} />
      </Routes>
    </Router>
  )
}

export default App
