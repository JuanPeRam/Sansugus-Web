# Auditoría de rendimiento · panel antiguo (`sansugus-dashboard`)

Fecha: 22/11/2026 · Rama: `feat/ecstatic-dirac-cgcxtm` · Checklist de 25 puntos (skill `web-performance-audit`).
La web pública tiene su propio informe: [`../../sansugus-web/docs/auditoria-rendimiento.md`](../../sansugus-web/docs/auditoria-rendimiento.md).

## Stack y situación

- **Frontend:** SPA React 18 + Vite 5 + Tailwind 3 (shadcn/Radix). Rutas: Inicio, Jugadores y Partidos (tablas editables por temporada); «Estadísticas» está en el menú pero no tiene ruta.
- **Datos:** `fetch` a `http://localhost:3000/acl-api` (fijo en `src/constants/api.ts`): una API propia que **no está en este repositorio**. Su base de datos sería el volcado MySQL `sansugus-database/script.sql`, que el propio README marca como obsoleto. El botón «Guardar cambios» solo muestra un aviso: no envía nada.
- **Despliegue:** no hay `netlify.toml` ni configuración de hosting en la carpeta, y el último cambio es de 2024. La gestión real se hace hoy en la web pública (`/admin`, sobre Supabase), así que este panel es un **prototipo sin uso en producción**. Por eso los cambios se han limitado a los de bajo riesgo; los puntos de red/backend/BD no son auditables aquí.
- Antes de esta rama, `npm run build` **fallaba** (`tsc`: un import sin usar y una variable sin leer en `GamesTable.tsx`).

## Resultado (antes → después)

| | Antes | Después |
|---|---|---|
| `npm run build` | Falla en `tsc` | Correcto |
| JS inicial | 323,6 kB · **103,1 kB gzip** (1 archivo) | 288,9 kB · **93,8 kB gzip** (−9 %) + `TableDashboard` 34,3 kB / 10,9 kB gzip y Jugadores/Partidos ~1,5 kB cada uno, al abrirlos |
| Logo de la barra lateral | SVG de 208 kB (en todas las pantallas) | WebP de 12 kB |
| `npm run lint` | 16 problemas (13 errores) | 13 problemas (10 errores), todos previos |

Comprobado con `vite preview` + Playwright: las tres rutas pintan sin errores de JavaScript; las únicas peticiones fallidas son las de `localhost:3000/acl-api` (la API no existe en este entorno), y la página lo muestra con su mensaje de error.

## Tabla priorizada (25 puntos)

✅ cumple · ⚠️ parcial · ❌ falta · ➖ no aplica. **(C)** = corregido en esta rama.

| # | Optimización | Estado | Impacto | Esfuerzo | Métrica | Evidencia / notas |
|---|---|---|---|---|---|---|
| 5 | Code splitting | ✅ (C) | Medio | Bajo | LCP, TBT | `src/App.tsx`: Jugadores y Partidos con `lazy()` y relleno con la forma de la página; la tabla, el selector y el diálogo de guardar van en su propio archivo. |
| 2 | Imágenes modernas | ✅ (C) | Medio | Bajo | LCP, peso | `src/components/left-bar/TopCard.tsx`: WebP de 12 kB con `width/height` en lugar del SVG de 208 kB; ruta absoluta (`./img/…` fallaba en rutas anidadas). Favicon PNG de 5 kB. |
| 1 | Skeleton screens | ✅ (C) | Bajo | Bajo | CLS, percepción | El selector ya tenía skeleton. La tabla solo mostraba filas de carga si ya había datos (la primera carga salía vacía): ahora también en la primera carga, y con `key` (`src/components/templates/DataTable.tsx`). |
| 10 | Debounce / cancelación | ✅ (C) | Bajo | Bajo | Correctitud, red | No hay búsquedas por tecla. Al cambiar de temporada se cancela la petición anterior con `AbortController` (`Players.tsx`, `GamesTable.tsx`), para que una respuesta lenta no pise la nueva. Fuera un `console.log` en cada petición. |
| 7 | Re-renderizados | ⚠️ | Bajo | Medio | INP | `DataTable` copia el array y re-renderiza toda la tabla en cada tecla y modifica los objetos de las props. Con ~30 filas no se nota; no se ha tocado (prototipo). |
| 9 | Deduplicación de peticiones | ⚠️ | Bajo | Bajo | Nº de peticiones | Las temporadas se piden de nuevo en cada pantalla. Irrelevante mientras la API no exista. |
| 8 | Fuentes | ✅ | — | — | — | Fuentes del sistema; no hay webfonts. |
| 4 | Terceros diferidos | ✅ | — | — | — | No hay scripts de terceros. |
| 3 | Estrategia de renderizado | ✅ | — | — | — | Herramienta interna: CSR es lo adecuado. |
| 6 | Virtualización | ➖ | — | — | — | Tablas de ~30 filas. |
| 12 | Peticiones en paralelo | ➖ | — | — | — | Una petición por pantalla (más la de temporadas, independiente). |
| 11 | Paginación | No verificable | — | — | — | Depende de `acl-api`, que no está en el repo. |
| 13 | Compresión | ➖ | — | — | — | Sin despliegue conocido. Si se publica en Netlify, viene de serie (Brotli). |
| 14 | CDN | ➖ | — | — | — | Ídem. |
| 15 | Caché de navegador | ➖ | — | — | — | Sin despliegue. Si se publica, copiar las reglas `[[headers]]` de `sansugus-web/netlify.toml` (`/assets/*` inmutable). |
| 16-22 | Backend y BD (colas, N+1, índices, proximidad, columnas, pooling, escalado) | ➖ | — | — | — | El backend (`acl-api`) no está en el repo y su BD MySQL (`script.sql`) está obsoleta. Los datos actuales viven en Supabase y se auditan en el informe de la web (índices nuevos en `sansugus-web/supabase/migrations/20261122100000_sansugus_indices_rendimiento.sql`). |
| 23 | Trazabilidad | ➖ | — | — | — | Sin backend propio en el repo. |
| 24 | RUM | ➖ | — | — | — | Sin usuarios reales. |
| 25 | Pruebas adversas | ➖ | — | — | — | Sin uso en producción; no hay CI. |

## Commit

| Commit | Bloque |
|---|---|
| `42e1b98` | Build arreglado, secciones diferidas, cancelación al cambiar de temporada, skeleton en la primera carga, logo y favicon ligeros |

## Pasos manuales

Ninguno: el panel no tiene despliegue ni base de datos propia en este repo.

## Pendiente (por prioridad)

1. **Decidir si se archiva.** El panel real es `sansugus-web` → `/admin` (Supabase). Mantener dos paneles confunde y este no guarda cambios. Si se quiere conservar, el siguiente paso sería conectarlo a Supabase (mismo esquema `sansugus`) en lugar de `localhost:3000`.
2. Si se sigue usando: aligerar `DataTable` (estado por fila y edición sin copiar toda la tabla), quitar `PlayersTable.tsx` (no se usa) y los 10 errores de lint previos.

## Segunda ronda (diagnóstico)

Fecha: 22/11/2026 · Commit `297c9f6`. Solo dependencias: el panel no se despliega, así que **no necesita cabeceras de seguridad** (si algún día se publica en Netlify, copiar el bloque `[[headers]] for = "/*"` de `sansugus-web/netlify.toml` y adaptar `connect-src` a su API).

| `npm audit` | Total | Críticas | Altas | Moderadas | Bajas | Solo producción |
|---|---|---|---|---|---|---|
| Antes | 30 | 0 | 22 | 7 | 1 | 16 |
| Después | **0** | 0 | 0 | 0 | 0 | **0** |

- `npm audit fix` (dos pasadas): react-router 6.30, postcss, nanoid, glob, braces, cross-spawn, sucrase, babel…
- Saltos de versión mayor, los mismos que en la web: `react-router-dom` 6 → **7.18.6** (redirección abierta con `\`, solo corregida en la 7; el panel solo usa `BrowserRouter`, `Routes`, `Route` y `NavLink`), `vite` 5 → **6.4.6** con `@vitejs/plugin-react` 4.7 (vulnerabilidades del servidor de desarrollo).
- `@typescript-eslint/*` 6 → **8.73** y `eslint` 8.56 → 8.57.1: la versión 6 arrastraba un `minimatch` con ReDoS (alta, solo en el lint). La configuración `.eslintrc.cjs` sigue sirviendo sin cambios.

Comprobado: `tsc` y `npm run build` correctos; `vite preview` + Playwright en `/`, `/players`, `/games` y una 404, y navegación con la barra lateral: pintan igual que antes y los únicos errores de consola son los de `localhost:3000/acl-api` (la API no existe en este entorno). `npm run lint`: 15 problemas (12 errores) frente a 13 (10): los 2 nuevos son reglas nuevas de typescript-eslint 8 (`no-empty-object-type` en `ui/input.tsx` y `no-unused-vars` para `actionTypes` en `ui/use-toast.ts`) sobre código que ya estaba; no se han tocado.

JS inicial: 93,8 → 100,6 kB gzip (+6,8 kB, casi todo de react-router 7). Al ser un prototipo sin usuarios, no se ha medido en móvil.
