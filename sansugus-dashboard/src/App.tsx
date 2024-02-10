import './App.css'
import { Home } from './components/Home'
import { LeftBar } from './components/left-bar/LeftBar'
import { Players } from './components/Players'
import { TopBar } from './components/TopBar'
import { ThemeProvider } from './components/theme/theme-provider'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { NotFound } from './components/NotFound'

function App() {

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <div className='flex items-center min-h-screen'>
          <LeftBar/>
          <main className='flex flex-col h-screen w-full'>
            <TopBar/>
            <Routes>
              <Route path='/' Component={Home}/>
              <Route path='/players' Component={Players}/>
              <Route path='/*' Component={NotFound}/>
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
