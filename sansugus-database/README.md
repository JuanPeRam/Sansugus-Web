# Base de datos de Sansugus FC

Los datos viven en el esquema **`sansugus`** del proyecto de Supabase `aitorfs-web`
(compartido con AITOR FS). No toca el esquema `public`; reutiliza `public.is_admin()`
para que solo los administradores puedan escribir (la lectura es pública).

| Tabla / vista | Contenido |
|---|---|
| `temporadas`, `jugadores`, `jugador_temporada` | Temporadas, jugadores y plantilla/dorsal por temporada (con `foto_url` y `dorsal_url`) |
| `partidos` | Partidos (id = número de `M.n` del Excel; penaltis en columnas aparte) |
| `actas` | Ficha de cada jugador en cada partido |
| `estadisticas_historicas` | Estadísticas de 21/22 y 22/23 (anteriores a las actas) |
| `estadisticas_jugador`, `estadisticas_equipo` | **Vistas**: se calculan desde las actas; no se editan |

## Imágenes por temporada

Desde **Panel → Plantilla** se sube, para cada jugador y temporada, su **foto** (plantilla y ficha)
y su **camiseta con el dorsal** (actas). Se reducen y convierten a WebP en el navegador y se guardan
en el bucket público `sansugus` (`jugadores/<temporada>/…` y `dorsales/<temporada>/…`); solo los
administradores pueden subir o borrar. Si un jugador no tiene imagen subida, la web usa las de
`public/resources/img` y, en último caso, la silueta o la camiseta genérica.
Migración: `sansugus-web/supabase/migrations/20261016100000_sansugus_imagenes.sql`.

## Carga inicial desde el Excel

1. Exporta las hojas a `csv/` (`partidos`, `actas`, `jugadores`, `estadisticas`).
2. `python3 build_seed.py` genera `sansugus-web/supabase/data/sansugus_seed_*.sql`.
3. Migración del esquema: `sansugus-web/supabase/migrations/20261004100000_sansugus_schema.sql`.

`script.sql` es el volcado MySQL original (obsoleto, solo como referencia histórica).
