import { createClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_SCHEMA, SUPABASE_URL } from './supabaseConfig'

// Cliente completo (sesión, almacenamiento, RPC con usuario): solo lo usa el área de
// administración, que se carga aparte. La web pública lee con `db` (lib/db.ts).
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: { schema: SUPABASE_SCHEMA },
    auth: { persistSession: true, autoRefreshToken: true },
})
