import './App.css'
import { lazy, Suspense } from 'react'
import NavBar from './components/NavBar'
import Home from './components/home/Home'
import NotFound from '@/components/NotFound'
import Footer from '@/components/Footer'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Inicio va en el paquete principal (es la entrada más habitual); el resto de secciones
// se descargan al visitarlas, cada una en su propio archivo.
const Players = lazy(() => import('./components/players/Players'))
const Games = lazy(() => import('@/components/games/Games'))
const GameData = lazy(() => import('@/components/games/game_stats/GameData'))
const Honors = lazy(() => import('@/components/honors/Honors').then((m) => ({ default: m.Honors })))
const Standings = lazy(() => import('@/components/standings/Standings'))

// Con la página ya pintada y el navegador ocioso, se adelanta la descarga de las demás
// secciones para que al pulsar en el menú se abran sin espera.
if (typeof window !== 'undefined') {
  const prefetch = () => {
    void import('./components/players/Players')
    void import('@/components/games/Games')
    void import('@/components/standings/Standings')
  }
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(prefetch, { timeout: 5000 })
    else setTimeout(prefetch, 3000)
  }, { once: true })
}

// Área de administración: carga aparte (no pesa en la web pública)
const AdminArea = lazy(() => import('@/pages/admin/AdminArea'))

/** Mientras llega el código de una sección: la cabecera de página con su altura real (sin saltos) */
function PageFallback() {
  return (
    <div aria-busy='true' aria-label='Cargando'>
      <div className='page-hero'>
        <div className='page-hero-inner'>
          <div className='h-3 w-32 animate-pulse rounded bg-white/10' />
          <div className='mt-3 h-12 w-64 animate-pulse rounded bg-white/10 md:h-[4.5rem] md:w-96' />
        </div>
      </div>
    </div>
  )
}

function PublicSite() {
  const { pathname } = useLocation()
  return (
    // En móvil se deja sitio abajo para las pestañas fijas
    <div className='flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0'>
      <NavBar />
      <main className='main-content'>
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageFallback />}>
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
          </Suspense>
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
