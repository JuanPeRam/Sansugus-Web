import { createClient } from '@supabase/supabase-js'

// Proyecto de Supabase compartido con AITOR FS; los datos de Sansugus viven en el esquema `sansugus`.
// La URL y la clave publicable son públicas por diseño (van en el JavaScript de la web):
// solo permiten leer; las escrituras exigen un administrador (RLS).
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
    ?? 'https://fcqwmxbogdpcybperjhi.supabase.co'
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
    ?? 'sb_publishable_RBgGBPn0QwYzKQx1-lrTKA_4mX0hayM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: { schema: 'sansugus' },
    auth: { persistSession: false },
})
