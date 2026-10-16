import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Tras publicar una versión nueva, una carga diferida puede pedir archivos que ya no existen:
// se recarga una vez para obtener los actuales (el aviso se limpia si la página arranca bien).
const RELOAD_KEY = 'sansugus:chunk-reload'
window.addEventListener('vite:preloadError', (event) => {
  try {
    if (sessionStorage.getItem(RELOAD_KEY) === '1') return
    sessionStorage.setItem(RELOAD_KEY, '1')
  } catch { return }
  event.preventDefault()
  window.location.reload()
})
window.setTimeout(() => { try { sessionStorage.removeItem(RELOAD_KEY) } catch { /* sin almacenamiento */ } }, 10000)
import  './styles/Animations.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
