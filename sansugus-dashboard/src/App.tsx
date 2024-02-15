import './App.css'
import { Home } from './components/Home'
import { LeftBar } from './components/left-bar/LeftBar'
import { Players } from './components/players/Players'
import { TopBar } from './components/TopBar'
import { ThemeProvider } from './components/theme/theme-provider'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { NotFound } from './components/NotFound'
import { Games } from './components/games/Games'
import { Toaster } from './components/ui/toaster'

function App() {

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <div className='flex items-center min-h-screen'>
          <LeftBar/>
          <main className='flex flex-col h-screen w-full'>
            <TopBar/>
            <section className='overflow-y-auto scrollbar-thin scrollbar-thumb-primary/70 scrollbar-track-primary/20 h-full'>
              <Routes>
                <Route path='/' Component={Home}/>
                <Route path='/home' Component={Home}/>
                <Route path='/players' Component={Players}/>
                <Route path='/games' Component={Games}/>
                <Route path='/*' Component={NotFound}/>
              </Routes>
            </section>
          </main>
          <Toaster/>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
