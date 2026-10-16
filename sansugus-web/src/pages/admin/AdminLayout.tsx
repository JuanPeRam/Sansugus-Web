import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { CalendarDays, CalendarRange, ExternalLink, LayoutDashboard, ListOrdered, LogOut, Menu, User, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/admin/ui'
import sansuguslogo from '@/img/sansugus-logo.svg'
import { unsavedContext, createUnsavedRegistry, useConfirmLeave } from './adminUtils'

const ITEMS = [
  { to: '/admin', label: 'Resumen', short: 'Inicio', Icon: LayoutDashboard, end: true },
  { to: '/admin/partidos', label: 'Partidos', short: 'Partidos', Icon: CalendarDays, end: false },
  { to: '/admin/clasificacion', label: 'Clasificación', short: 'Tabla', Icon: ListOrdered, end: false },
  { to: '/admin/plantilla', label: 'Plantilla', short: 'Plantilla', Icon: Users, end: false },
  { to: '/admin/jugadores', label: 'Jugadores', short: 'Jugadores', Icon: User, end: false },
  { to: '/admin/temporadas', label: 'Temporadas', short: 'Temporadas', Icon: CalendarRange, end: false },
]

/** El área de administración no debe indexarse */
function NoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
  return null
}

/** Protege las rutas /admin/*: exige sesión de un usuario de la tabla admins */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session, isAdmin, loading } = useAuth()
  const location = useLocation()
  if (loading || (session && isAdmin === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-teamOrange">
        <Spinner className="size-8" />
      </div>
    )
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

export default function AdminLayout() {
  const registry = useMemo(createUnsavedRegistry, [])
  return (
    <unsavedContext.Provider value={registry}>
      <AdminShell />
    </unsavedContext.Provider>
  )
}

function AdminShell() {
  const { session, signOut } = useAuth()
  const confirmLeave = useConfirmLeave()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const guard = (e: React.MouseEvent) => {
    if (!confirmLeave()) e.preventDefault()
  }
  const logout = () => {
    if (confirmLeave()) void signOut()
  }
  // Al navegar se cierra el menú de cuenta y se vuelve arriba
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const current = ITEMS.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to))) ?? ITEMS[0]

  const brand = (
    <Link to="/admin" onClick={guard} className="flex items-center gap-3">
      <img src={sansuguslogo} alt="" className="size-9 lg:size-10" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg text-white lg:text-xl">Sansugus <span className="text-teamOrange">FC</span></span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-teamOrange">Gestión</span>
      </span>
    </Link>
  )

  const accountLinks = (
    <>
      <p className="truncate px-3 pb-1 text-xs text-white/50" title={session?.user.email}>{session?.user.email}</p>
      <a href="/" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white lg:min-h-0">
        <ExternalLink className="size-4" aria-hidden /> Ver la web
      </a>
      <button type="button" onClick={logout} className="flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white lg:min-h-0">
        <LogOut className="size-4" aria-hidden /> Cerrar sesión
      </button>
    </>
  )

  return (
    <AdminGuard>
      <NoIndex />
      <div className="min-h-screen bg-background lg:flex">
        {/* Escritorio: barra lateral */}
        <aside className="hidden shrink-0 flex-col border-r border-border bg-black lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64">
          <div className="h-1 bg-teamOrange" />
          <div className="border-b border-border px-5 py-4">{brand}</div>
          <nav aria-label="Administración" className="flex flex-1 flex-col gap-1 p-3">
            {ITEMS.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={guard}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-sm px-3 py-2.5 font-display text-base transition-colors',
                    isActive ? 'bg-teamOrange text-black' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <Icon className="size-4" aria-hidden /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-col gap-1 border-t border-border p-3">{accountLinks}</div>
        </aside>

        {/* Móvil: barra superior con la sección actual y el menú de cuenta */}
        <header className="sticky top-0 z-40 border-b border-border bg-black/95 backdrop-blur lg:hidden">
          <div className="h-0.5 bg-teamOrange" />
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            {brand}
            <div className="flex items-center gap-1">
              <span className="font-display text-base text-white/60">{current.label}</span>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="admin-account-menu"
                aria-label={menuOpen ? 'Cerrar menú de cuenta' : 'Abrir menú de cuenta'}
                className="ml-1 flex size-11 items-center justify-center rounded-sm text-white hover:bg-white/10"
              >
                {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
              </button>
            </div>
          </div>
          {/* El header usa backdrop-blur (crea un bloque contenedor): el menú se posiciona en absoluto bajo él */}
          {menuOpen && (
            <div className="absolute inset-x-0 top-full">
              <div id="admin-account-menu" className="relative z-10 flex flex-col gap-1 border-y border-border bg-black p-3 shadow-xl">
                {accountLinks}
              </div>
              <button type="button" aria-label="Cerrar menú" tabIndex={-1} className="block h-[100dvh] w-full bg-black/60" onClick={() => setMenuOpen(false)} />
            </div>
          )}
        </header>

        <main className="min-w-0 flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pt-8 lg:pb-8">
          <Outlet />
        </main>

        {/* Móvil: pestañas fijas abajo, al alcance del pulgar */}
        <nav aria-label="Administración" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          <ul className="grid grid-cols-6">
            {ITEMS.map(({ to, short, Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={guard}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-normal transition-colors min-[400px]:tracking-wider',
                      isActive ? 'text-teamOrange' : 'text-white/60 hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute inset-x-3 top-0 h-0.5 bg-teamOrange" aria-hidden />}
                      <Icon className="size-5" aria-hidden />
                      {short}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </AdminGuard>
  )
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between md:mb-6">
      <div className="min-w-0">
        <h1 className="text-3xl text-white sm:text-4xl md:text-5xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:mt-2 md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto [&>*]:min-w-0 [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>}
    </div>
  )
}
