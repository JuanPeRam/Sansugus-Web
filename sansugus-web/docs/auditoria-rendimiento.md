# Auditoría de rendimiento · web pública (`sansugus-web`)

Fecha: 22/11/2026 · Rama: `feat/ecstatic-dirac-cgcxtm` · Checklist de 25 puntos (skill `web-performance-audit`).
El panel antiguo (`sansugus-dashboard`) tiene su propio informe: [`../../sansugus-dashboard/docs/auditoria-rendimiento.md`](../../sansugus-dashboard/docs/auditoria-rendimiento.md).

## Stack

- **Frontend:** SPA React 18 + Vite 4 + Tailwind 3 (shadcn/Radix). Rutas públicas (`/`, `/Players`, `/Games`, `/Game`, `/Standings`, `/Honors`) y panel de gestión en `/admin/*` (ya iba en un archivo aparte).
- **Hosting:** Netlify (`netlify.toml`, CDN de Netlify; producción en `https://sansugusfc.netlify.app`).
- **Datos:** Supabase compartido con AITOR FS, esquema `sansugus` (lectura pública por RLS). El navegador habla directamente con PostgREST; no hay servidor propio. Migraciones en `supabase/migrations/` (fuente de verdad; `sansugus-database/script.sql` es el volcado MySQL antiguo y está obsoleto).
- **Volumen real:** 6 temporadas, ~100 partidos, ~475 filas de actas, ~90 filas de plantilla. Las consultas tardan ~1 ms en Postgres (medido con `EXPLAIN ANALYZE` sobre la carga inicial en un Postgres 16 local): el cuello de botella es la red (viajes de ida y vuelta, JS e imágenes), no la base de datos.

## Resultado (antes → después)

Medido con Chromium (Playwright) en móvil 390×844, **CPU ×4 y red 1,6 Mbps / 150 ms** (perfil parecido al de Lighthouse móvil), caché desactivada, servidor estático con gzip, datos reales de Supabase. Mediana de 3 cargas.

| Página | FCP | LCP | CLS | Transferido (6 s) |
|---|---|---|---|---|
| Inicio `/` | 1,60 s → **1,28 s** | 2,69 s → **2,34 s** | 0 → 0 | 407 → 306 kB |
| Acta `/Game?game=95` | 1,63 s → **1,22 s** | 3,58 s → **2,50 s** | 0,228 → **0** | 547¹ → 453 kB |
| Partidos `/Games` | 1,59 s → **1,22 s** | 1,59 s² → 1,82 s | 0,372 → **0** | 418 → 270 kB |
| Plantilla `/Players` | 1,56 s → **1,26 s** | 1,56 s² → 2,95 s | 0,457 → **0** | 620 → 516 kB |
| Clasificación `/Standings` | 1,58 s → **1,24 s** | 1,58 s → **1,44 s** | 0,087 → **0** | 462 → 306 kB |

¹ Antes, las camisetas del acta (1,8 MB) no terminaban de bajar en la ventana medida.
² Antes, el LCP era el título de la cabecera porque el contenido real aparecía tarde y empujaba el pie (de ahí el CLS de 0,37-0,46); ahora el LCP es la primera tarjeta de partido / la foto del jugador, que es lo que de verdad ve el usuario, y no hay saltos.

Build (`npm run build`):

| | Antes | Después |
|---|---|---|
| JS inicial (`index-*.js`) | 569,8 kB · **168,9 kB gzip** | 248,1 kB · **79,9 kB gzip** (−53 %) |
| Archivos JS | 2 (principal + admin) | 12 (principal, una por sección, selector, admin) |
| Imágenes de `public/resources/img` (camisetas, escudos, trofeo) | 7,7 MB PNG | 1,1 MB WebP |
| Escudo de Sansugus en barra, pie y listas | SVG 208 kB (60 kB gzip) | WebP 12 kB |
| Fuentes | Google Fonts (CSS bloqueante + 2 orígenes) | 7 woff2 propios de ~22 kB, 2 con preload |

`tsc` sin errores. `npm run lint` sigue con los mismos 17 errores y 23 avisos que había antes (todos previos: `any`, `var`, etc.); los cambios no añaden ninguno.

## Tabla priorizada (25 puntos)

Ordenada por impacto alto / esfuerzo bajo primero. ✅ cumple · ⚠️ parcial · ❌ falta · ➖ no aplica. **(C)** = corregido en esta rama.

| # | Optimización | Estado | Impacto | Esfuerzo | Métrica | Evidencia / notas |
|---|---|---|---|---|---|---|
| 5 | Code splitting | ✅ (C) | Alto | Bajo | LCP, INP, TBT | Antes un único JS de 570 kB con supabase-js completo (auth, storage, realtime). Ahora la web pública lee con `PostgrestClient` (`src/lib/db.ts`) y el cliente completo solo va en `/admin`; secciones con `lazy()` y precarga en reposo (`src/App.tsx`). |
| 2 | Imágenes modernas | ✅ (C) | Alto | Bajo | LCP, peso | Camisetas, escudos y trofeo a WebP (`public/resources/img`), escudo pequeño WebP, `width/height`, `loading="lazy"` fuera de la primera pantalla, `fetchpriority="high"` en el escudo de portada y en las fotos de la primera fila de la plantilla. Arreglado de paso el escudo de National Team (pedía `.png` y el archivo era `.PNG`). |
| 15 | Caché de navegador | ✅ (C, pendiente de desplegar) | Alto | Bajo | Visitas repetidas, LCP | Producción hoy: `cache-control: public,max-age=0,must-revalidate` también en `/assets/*` con hash. `netlify.toml`: `/assets/*` → `max-age=31536000, immutable`; `/resources/*` y favicon → 1 día + `stale-while-revalidate` 1 semana; HTML con la cabecera por defecto (revalida). |
| 8 | Fuentes | ✅ (C) | Medio | Bajo | FCP, LCP, CLS | Barlow / Barlow Condensed (OFL) en `src/fonts/`, `@font-face` con `font-display: swap`, subconjunto latino, preload de las dos de la primera pantalla (`index.html`). |
| 4 | Terceros diferidos | ✅ (C) | Medio | Bajo | FCP | El único tercero que bloqueaba era la hoja de Google Fonts; eliminado. No hay analítica, chat ni píxeles. |
| 1 | Skeleton screens | ✅ (C) | Medio | Bajo | CLS, percepción | Ya los había en Inicio, Partidos, Acta, Clasificación y Patrocinadores. Añadidos en Plantilla (tarjetas), selector de temporada y relleno de sección mientras llega su código. El pie empieza fuera de la pantalla (`min-height` del contenido): CLS 0,23-0,46 → 0. |
| 12 | Peticiones en paralelo | ✅ (C) | Medio | Bajo | LCP, TTFB percibido | El acta eran 3 consultas encadenadas (acta → temporada → camisetas): ahora 1 con recursos embebidos. En el panel, la lista de partidos y «¿tiene acta?» en 1 consulta. Temporadas pedidas a la vez que el código de Plantilla/Partidos. El resto ya usaba `Promise.all`. |
| 20 | Columnas explícitas | ✅ (C) | Bajo-medio | Bajo | Peso de respuesta | Fuera los `select('*')` de `src/data/api.ts` y `src/data/adminApi.ts` (estadísticas, clasificación, partidos, actas, resumen). |
| 9 | Deduplicación de peticiones | ✅ (C) | Bajo-medio | Bajo | Nº de peticiones | Caché en memoria con promesa compartida (`cached()` en `src/data/api.ts`): temporadas 5 min; partidos, plantilla, Inicio y clasificación 1 min. El panel la vacía al guardar. Patrocinadores ya tenían su propia caché. No hace falta TanStack Query para este tamaño. |
| 18 | Índices | ✅ (C, pendiente de aplicar) | Bajo (hoy) | Bajo | Carga de BD | `supabase/migrations/20261122100000_sansugus_indices_rendimiento.sql`: `temporada_id` de `jugador_temporada` y `estadisticas_historicas` (claves foráneas sin índice, filtro del panel y de `guardar_acta_partido`). El resto ya estaba cubierto (`partidos (temporada_id, fecha)`, `actas (jugador_id)`, PK de `actas` por `partido_id`, clasificación, patrocinadores). Con ~100 partidos, un índice `partidos (jugado, fecha)` para Inicio no aporta: no se ha añadido. |
| 13 | Compresión | ✅ | — | — | Peso | Verificado en producción: `content-encoding: br` en el JS. |
| 14 | CDN | ✅ | — | — | TTFB | Netlify (cabecera `server: Netlify`); imágenes subidas desde el panel, por el CDN de Supabase Storage (`cacheControl` de 1 año al subir). |
| 17 | N+1 | ✅ | — | — | Nº de consultas | No hay consultas dentro de bucles; las relaciones se piden embebidas (`temporadas!inner`, `jugadores!inner`). |
| 11 | Paginación | ✅ | Bajo | — | Peso | Todas las listas van acotadas por temporada (≤ 40 partidos, ≤ 30 jugadores, ≤ 16 equipos) o con `limit(1)`. Única lectura sin filtro: sugerencias del panel (`fetchSuggestions`, 3 columnas de todos los partidos, ~100 filas, +30 por temporada): aceptable durante años. |
| 10 | Debounce | ➖ | — | — | INP | El buscador de la plantilla filtra en memoria (no hace peticiones). Lo que sí se ha corregido: Partidos y Plantilla descartan la respuesta de una temporada anterior si se cambia antes de que llegue. |
| 6 | Virtualización | ➖ | — | — | INP | Ninguna lista pasa de ~40 elementos. |
| 7 | Re-renderizados | ✅ | — | — | INP | Árboles pequeños; sin cascadas ni estado global. No merece memoización adicional. |
| 3 | Estrategia de renderizado | ⚠️ | Medio | Alto | LCP, SEO | SPA pura con contenido público: el HTML llega vacío y todo depende del JS + Supabase. Prerenderizar (Vite SSG, `vite-plugin-prerender`) o pasar a Astro mejoraría LCP y SEO, pero es una migración, no un ajuste. **No se ha hecho.** |
| 19 | Proximidad de infraestructura | No verificable | Medio | — | TTFB de datos | Netlify sirve desde el CDN más cercano; los datos van del navegador a Supabase directamente, así que lo que cuenta es la región del proyecto de Supabase frente a los usuarios (España). Comprobar en Supabase → Project Settings → General → Region (ideal: `eu-west-*`/`eu-central-*`). Es el proyecto compartido con AITOR FS: moverlo afecta a las dos webs. |
| 24 | RUM | ❌ | Medio | Bajo-medio | Todas | No hay analítica de usuarios reales. Ver «Pendiente». |
| 25 | Pruebas adversas | ⚠️ | Medio | Medio | Todas | Hechas a mano en esta auditoría (CPU ×4 + red lenta, tabla de arriba). No hay CI en el repo donde poner un presupuesto de tamaño o LHCI. |
| 23 | Trazabilidad (OpenTelemetry) | ➖ | — | — | — | No hay servidor propio; sería sobreingeniería. Para consultas lentas basta Supabase → *Query Performance* / *Advisors*. |
| 21 | Connection pooling | ➖ | — | — | — | Sin servidor propio; PostgREST y Supavisor los gestiona Supabase. |
| 22 | Escalado horizontal | ➖ | — | — | — | Web estática + Supabase gestionado. |
| 16 | Colas de trabajo | ➖ | — | — | — | No hay emails, PDF ni llamadas a terceros; las imágenes se reducen a WebP en el navegador antes de subirlas. |

## Commits

| Commit | Bloque |
|---|---|
| `1e6b831` | Cliente ligero de lectura y carga diferida por secciones |
| `0cdfdb4` | Consultas más ligeras, acta en una sola petición, caché corta y skeletons |
| `404f6be` | Camisetas, escudos y trofeo en WebP; escudo pequeño y favicon ligeros |
| `7aa77a5` | Fuentes Barlow alojadas en la propia web |
| `e19231e` | Cabeceras de caché en Netlify |
| `7e4e384` | Migración de índices (`temporada_id`) |
| `68fc65f` | El pie no salta mientras carga la sección (CLS) |
| `200337d` | Temporadas en paralelo y fotos de la primera fila con prioridad |

## Pasos manuales (necesitan acceso a servidores)

1. **Aplicar la migración de índices** en el proyecto de Supabase compartido con AITOR FS: ejecutar
   `supabase/migrations/20261122100000_sansugus_indices_rendimiento.sql` en el editor SQL (como las anteriores) o con el flujo de migraciones habitual. Independiente del despliegue (se puede antes o después). Riesgo mínimo: tablas de < 100 filas, `CREATE INDEX IF NOT EXISTS`, idempotente (probado en Postgres 16 local). Deshacer: `drop index if exists sansugus.jugador_temporada_temporada_idx; drop index if exists sansugus.estadisticas_historicas_temporada_idx;`. Comprobar: `select indexname from pg_indexes where schemaname = 'sansugus' and indexname like '%temporada_idx';` (deben salir las dos).
2. **Fusionar la rama en `main`** para que Netlify despliegue: hasta entonces las cabeceras de `netlify.toml`, el JS ligero, las fuentes y los WebP no llegan a producción. Después, comprobar:
   - `curl -sI https://sansugusfc.netlify.app/assets/<archivo>.js | grep -i cache-control` → `public, max-age=31536000, immutable` (el nombre sale de `curl -s https://sansugusfc.netlify.app/ | grep -o '/assets/[^"]*'`).
   - `curl -sI https://sansugusfc.netlify.app/resources/img/shields/Valhalla.webp | grep -i cache-control` → `max-age=86400, stale-while-revalidate=604800`.
   - `curl -sI https://sansugusfc.netlify.app/ | grep -i cache-control` → sigue `max-age=0, must-revalidate`.
   - Que el HTML ya no pida `fonts.googleapis.com`.
   Deshacer: revertir los commits (las imágenes PNG siguen en el historial de git).
3. **Revisar el log del despliegue en Netlify**: hay dos lockfiles (`yarn.lock` y `package-lock.json`); si Netlify usa yarn, `yarn.lock` ya estaba desfasado (le faltan las dependencias internas de supabase-js) y resolverá `@supabase/postgrest-js@2.117.2` igual que hacía con ellas. Recomendación: quedarse con un único lockfile.
4. **Comprobar la región de Supabase** (punto 19): Project Settings → General. Si no es europea, valorar con AITOR FS, porque el proyecto es compartido.

## Pendiente (por prioridad)

1. **RUM (24).** No se ha añadido `web-vitals` porque no hay dónde enviar los datos. Opciones: Cloudflare Web Analytics (gratis, incluye Core Web Vitals, un script diferido) o `web-vitals` (~2 kB) enviando a una tabla de Supabase con política de solo inserción para `anon`. Decisión del equipo (privacidad/cookies).
2. **Prerenderizado de las páginas públicas (3).** Mayor mejora restante de LCP y SEO, pero es una migración (Vite SSG o Astro). Proponer como proyecto aparte.
3. **Presupuesto de rendimiento en CI (25).** No hay CI; si se añade (GitHub Actions), un paso que falle si `index-*.js` pasa de ~90 kB gzip.
4. **Escudos con `srcset`.** Se sirven a 300 px y se ven a 28-112 px; una versión de 128 px ahorraría ~60 % más en listas largas. Bajo impacto tras el paso a WebP.
5. **Logo de Dos Puntos (`/resources/img/sponsors/dospuntos.png`).** Su ruta está guardada en la tabla `patrocinadores`; para pasarlo a WebP hay que subirlo desde el panel (lo convierte solo) o cambiar la fila. No se ha tocado para no romper la referencia.
6. **Limpieza del repo (sin efecto en la web):** `src/img/shirts/` (27 MB de PNG que no usa nadie), `src/fonts/Archivo-*.ttf`, `src/assets/photo/victoria.jpg` y escudos/fotos sin referencia en `public/` (p. ej. `cool-background.png`, `Mark_Lateral*`). Solo pesan al clonar.
7. **Lint:** 17 errores previos (`no-explicit-any`, `no-var`…); no bloquean el build, pero conviene limpiarlos.
