import { PostgrestClient } from '@supabase/postgrest-js'
import { SUPABASE_KEY, SUPABASE_SCHEMA, SUPABASE_URL } from './supabaseConfig'

/**
 * Cliente de solo lectura para la web pública: habla directamente con la API REST
 * (PostgREST) con la clave publicable, igual que hace supabase-js sin sesión. No arrastra
 * auth, storage ni realtime, así que el JavaScript inicial pesa bastante menos.
 * La lectura es pública por RLS («lectura publica» para anon), así que no hace falta sesión.
 * Nota: la versión de @supabase/postgrest-js va fijada a la misma que usa supabase-js;
 * al actualizar uno, actualiza el otro para no tener dos copias.
 */
export const db = new PostgrestClient(`${SUPABASE_URL}/rest/v1`, {
    schema: SUPABASE_SCHEMA,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
})
