import { Component, type ErrorInfo, type ReactNode } from 'react'

const RELOAD_KEY = 'sansugus:chunk-reload'

/** Tras publicar una versión nueva, los archivos JS antiguos dejan de existir */
const isChunkError = (error: Error) =>
  /dynamically imported module|Importing a module script failed|Failed to fetch dynamically|error loading dynamically|ChunkLoadError|Unexpected token '<'/i.test(`${error.name} ${error.message}`)

type Props = {
  children: ReactNode
  /** Al cambiar (p. ej. la ruta) se descarta el error y se vuelve a intentar */
  resetKey?: string
}

/**
 * Evita que un fallo al pintar una sección deje la web en blanco: muestra un aviso
 * dentro de la página y, al cambiar de sección, se recupera sola sin recargar.
 */
export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error en la página:', error, info.componentStack)
    // Versión nueva publicada: se recarga una vez para descargar los archivos actuales
    if (isChunkError(error)) {
      let reloaded = false
      try { reloaded = sessionStorage.getItem(RELOAD_KEY) === '1'; sessionStorage.setItem(RELOAD_KEY, '1') } catch { /* sin almacenamiento */ }
      if (!reloaded) window.location.reload()
    }
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div role='alert' className='flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 py-16 text-center'>
        <span className='eyebrow'>Algo ha fallado</span>
        <p className='font-display text-3xl text-white md:text-4xl'>No se ha podido mostrar esta sección</p>
        <p className='max-w-md text-sm text-muted-foreground'>Prueba de nuevo o cambia de sección. Si se repite, avisa con este mensaje:</p>
        <code className='max-w-full break-words rounded-sm border border-border bg-black px-3 py-2 text-xs text-red-300'>{error.message}</code>
        <button type='button' className='btn-club' onClick={() => this.setState({ error: null })}>Reintentar</button>
      </div>
    )
  }
}
