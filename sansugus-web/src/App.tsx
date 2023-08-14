import { useState, Dispatch, SetStateAction, useEffect} from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Players from './components/Players'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Footer from './components/Footer'

const pathNames: { [key: string]: JSX.Element } = {
  '/Players':<Players />,
  '/':<Home/>,
  '/Home':<Home/>
}

function App() {
  const [currentComponent, setCurrentComponent] : [undefined | JSX.Element, Dispatch<SetStateAction<undefined | JSX.Element>>] = useState()
  useEffect(() => {
    const currentPath  = window.location.pathname
  setCurrentComponent(pathNames[currentPath] ?? <NotFound/>)
  }, [])

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
