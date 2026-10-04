import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { CalendarDays, CalendarRange, ExternalLink, LayoutDashboard, LogOut, User, Users } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/admin/ui'
import sansuguslogo from '@/img/sansugus-logo.svg'
import { unsavedContext, createUnsavedRegistry, useConfirmLeave } from './adminUtils'

const ITEMS = [
  { to: '/admin', label: 'Resumen', Icon: LayoutDashboard, end: true },
  { to: '/admin/partidos', label: 'Partidos', Icon: CalendarDays, end: false },
  { to: '/admin/plantilla', label: 'Plantilla', Icon: Users, end: false },
  { to: '/admin/jugadores', label: 'Jugadores', Icon: User, end: false },
  { to: '/admin/temporadas', label: 'Temporadas', Icon: CalendarRange, end: false },
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
  const guard = (e: React.MouseEvent) => {
    if (!confirmLeave()) e.preventDefault()
  }
  const logout = () => {
    if (confirmLeave()) void signOut()
  }
  return (
    <AdminGuard>
      <NoIndex />
      <div className="flex min-h-screen flex-col bg-background lg:flex-row">
        <aside className="flex shrink-0 flex-col border-r border-border bg-black lg:sticky lg:top-0 lg:h-screen lg:w-64">
          <div className="h-1 bg-teamOrange" />
          <Link to="/admin" onClick={guard} className="flex items-center gap-3 border-b border-border px-5 py-4">
            <img src={sansuguslogo} alt="" className="h-10 w-10" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl text-white">Sansugus <span className="text-teamOrange">FC</span></span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-teamOrange">Gestión</span>
            </span>
          </Link>
          <nav aria-label="Administración" className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col">
            {ITEMS.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={guard}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-3 rounded-sm px-3 py-2.5 font-display text-base transition-colors',
                    isActive ? 'bg-teamOrange text-black' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <Icon className="size-4" aria-hidden /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden flex-col gap-1 border-t border-border p-3 lg:flex">
            <p className="truncate px-3 pb-1 text-xs text-white/50" title={session?.user.email}>{session?.user.email}</p>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
              <ExternalLink className="size-4" aria-hidden /> Ver la web
            </a>
            <button type="button" onClick={logout} className="flex items-center gap-3 rounded-sm px-3 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white">
              <LogOut className="size-4" aria-hidden /> Cerrar sesión
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
          <button type="button" onClick={logout} className="mt-10 flex items-center gap-2 text-sm text-muted-foreground lg:hidden">
            <LogOut className="size-4" aria-hidden /> Cerrar sesión
          </button>
        </main>
      </div>
    </AdminGuard>
  )
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="text-4xl text-white md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
