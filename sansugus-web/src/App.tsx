import { useState, Dispatch, SetStateAction, useEffect} from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Players from './components/Players'
import Home from './components/home/Home'
import NotFound from './components/NotFound'
import Footer from './components/Footer'
import Games from './components/games/Games'



function App() {
  const [currentComponent, setCurrentComponent] : [undefined | JSX.Element, Dispatch<SetStateAction<undefined | JSX.Element>>] = useState()

  useEffect(() => {
    const currentPath  = window.location.pathname
    setCurrentComponent(pathNames[currentPath] ?? <NotFound/>)
  }, [])

  

  const pathNames: { [key: string]: JSX.Element } = {
    '/Players':<Players />,
    '/':<Home/>,
    '/Home':<Home/>,
    '/Games':<Games/>
  }

  return (
    <>
      <NavBar/>
      <main className='main-content'>
        {currentComponent}
      </main>
      <Footer/>
    </>
  )
}

export default App
