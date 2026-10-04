import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Field, Input, Spinner } from '@/components/admin/ui'
import sansuguslogo from '@/img/sansugus-logo.svg'

export default function AdminLoginPage() {
  const { session, isAdmin, loading, signIn, signOut } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Acceso · Sansugus FC'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'
  if (!loading && session && isAdmin) return <Navigate to={from} replace />

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#111] to-[#2a1604] px-4 py-12">
      <div className="absolute -right-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-teamOrange/20 blur-3xl" aria-hidden />
      <div className="relative w-full max-w-sm overflow-hidden rounded-sm border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b-4 border-teamOrange bg-black px-6 py-5">
          <img src={sansuguslogo} alt="" className="h-12 w-12" />
          <div>
            <p className="font-display text-2xl leading-none text-white">Sansugus <span className="text-teamOrange">FC</span></p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-teamOrange">Panel de gestión</p>
          </div>
        </div>
        {session && isAdmin === false ? (
          <div className="flex flex-col gap-4 p-6">
            <p role="alert" className="text-white/80">
              La cuenta <strong>{session.user.email}</strong> no tiene permisos de administrador.
            </p>
            <Button variant="outline" onClick={() => void signOut()}>Cerrar sesión</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6" noValidate>
            <Field label="Email" htmlFor="email">
              <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error && <p role="alert" className="text-sm font-medium text-red-400">{error}</p>}
            <Button type="submit" disabled={submitting || loading || !email || !password} className="bg-teamOrange font-extrabold uppercase tracking-widest text-black hover:bg-teamOrange-light">
              {submitting && <Spinner className="mr-2 size-4" />} Entrar
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
