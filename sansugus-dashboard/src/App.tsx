import './App.css'
import { LeftBar } from './components/LeftBar'
import { TopBar } from './components/TopBar'
import { ModeToggle } from './components/mode-toggle'
import { ThemeProvider } from './components/theme-provider'

function App() {

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='flex items-center min-h-screen'>
        <LeftBar/>
        <main className='flex flex-col h-screen w-full'>
          <TopBar/>
        </main>
        
      </div>
    </ThemeProvider>
  )
}

export default App
