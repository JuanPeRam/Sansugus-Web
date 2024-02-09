import './App.css'
import { LeftBar } from './components/LeftBar'
import { ModeToggle } from './components/mode-toggle'
import { ThemeProvider } from './components/theme-provider'

function App() {

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='flex items-center min-h-screen'>
        <LeftBar/>
        Hola
        <ModeToggle/>
      </div>
    </ThemeProvider>
  )
}

export default App
