import './App.css'
import { lazy, Suspense } from 'react'
import { Home } from './components/Home'
import { LeftBar } from './components/left-bar/LeftBar'
import { TopBar } from './components/TopBar'
import { ThemeProvider } from './components/theme/theme-provider'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { NotFound } from './components/NotFound'
import { Toaster } from './components/ui/toaster'
import { Skeleton } from './components/ui/skeleton'

// Las tablas (selector, diálogo de guardar, casillas…) se descargan al abrir su sección
const Players = lazy(() => import('./components/players/Players').then((m) => ({ default: m.Players })))
const Games = lazy(() => import('./components/games/Games').then((m) => ({ default: m.Games })))

const PageFallback = () => (
  <div className='p-7 px-5 w-11/12 m-auto flex flex-col gap-3' aria-busy='true'>
    <Skeleton className='w-[140px] h-10 rounded-sm' />
    <Skeleton className='h-64 w-full rounded-sm' />
  </div>
)

function App() {

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <div className='flex items-center min-h-screen'>
          <LeftBar/>
          <main className='flex flex-col h-screen w-full'>
            <TopBar/>
            <section className='overflow-y-auto scrollbar-thin scrollbar-thumb-primary/70 scrollbar-track-primary/20 h-full'>
              <Suspense fallback={<PageFallback/>}>
              <Routes>
                <Route path='/' Component={Home}/>
                <Route path='/home' Component={Home}/>
                <Route path='/players' Component={Players}/>
                <Route path='/games' Component={Games}/>
                <Route path='/*' Component={NotFound}/>
              </Routes>
              </Suspense>
            </section>
          </main>
          <Toaster/>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
