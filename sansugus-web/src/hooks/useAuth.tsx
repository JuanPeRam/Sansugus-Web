import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { checkIsAdmin } from '@/data/adminApi'

type AuthState = {
  session: Session | null
  /** null mientras se comprueba */
  isAdmin: boolean | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const apply = async (s: Session | null) => {
      if (!active) return
      setSession(s)
      setIsAdmin(s ? await checkIsAdmin() : false)
      if (active) setLoading(false)
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session))
    // No se llama a Supabase dentro del callback (puede bloquear el cliente): se difiere
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setTimeout(() => void apply(s), 0)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error.message)
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(() => ({ session, isAdmin, loading, signIn, signOut }), [session, isAdmin, loading, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
