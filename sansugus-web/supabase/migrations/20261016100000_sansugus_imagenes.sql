-- ════════════════════════════════════════════════════════════════════════════
-- SANSUGUS FC · Imágenes por temporada (como las fotos de jugadores de AITOR FS)
--  · foto_url   → foto del jugador en esa temporada (plantilla y ficha)
--  · dorsal_url → camiseta con su dorsal en esa temporada (actas de los partidos)
-- Las imágenes viven en el bucket público `sansugus`; solo los administradores
-- (public.is_admin()) pueden subirlas, cambiarlas o borrarlas.
-- ════════════════════════════════════════════════════════════════════════════

alter table sansugus.jugador_temporada add column if not exists foto_url text;
alter table sansugus.jugador_temporada add column if not exists dorsal_url text;

-- La vista expone las URLs (columnas nuevas al final, para poder hacer create or replace)
create or replace view sansugus.estadisticas_jugador with (security_invoker = true) as
with agg as (
  select a.jugador_id, p.temporada_id,
         sum(a.goles)::int        as goles,
         sum(a.asistencias)::int  as asistencias,
         count(*) filter (where not j.propia_puerta)::int as partidos,
         sum(a.amarillas)::int    as amarillas,
         sum(a.rojas)::int        as rojas,
         count(*) filter (where a.mvp)::int as mvp
  from sansugus.actas a
  join sansugus.partidos p on p.id = a.partido_id
  join sansugus.jugadores j on j.id = a.jugador_id
  group by a.jugador_id, p.temporada_id
)
select jt.jugador_id, j.nombre as jugador, j.alias, jt.temporada_id, t.nombre as temporada, jt.dorsal,
       coalesce(h.goles,       g.goles,       0) as goles,
       coalesce(h.asistencias, g.asistencias, 0) as asistencias,
       coalesce(h.partidos,    g.partidos,    0) as partidos,
       coalesce(h.amarillas,   g.amarillas,   0) as amarillas,
       coalesce(h.rojas,       g.rojas,       0) as rojas,
       coalesce(h.mvp,         g.mvp,         0) as mvp,
       j.propia_puerta,
       jt.foto_url,
       jt.dorsal_url
from sansugus.jugador_temporada jt
join sansugus.jugadores  j on j.id = jt.jugador_id
join sansugus.temporadas t on t.id = jt.temporada_id
left join sansugus.estadisticas_historicas h on h.jugador_id = jt.jugador_id and h.temporada_id = jt.temporada_id
left join agg g on g.jugador_id = jt.jugador_id and g.temporada_id = jt.temporada_id;

-- ─── Bucket de imágenes ────────────────────────────────────────────────────
-- Rutas: jugadores/<temporada_id>/<jugador_id>-<marca>.webp
--        dorsales/<temporada_id>/<jugador_id>-<marca>.webp
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sansugus', 'sansugus', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "sansugus img: admins suben" on storage.objects
  for insert to authenticated with check (bucket_id = 'sansugus' and public.is_admin());
create policy "sansugus img: admins modifican" on storage.objects
  for update to authenticated using (bucket_id = 'sansugus' and public.is_admin());
create policy "sansugus img: admins borran" on storage.objects
  for delete to authenticated using (bucket_id = 'sansugus' and public.is_admin());

notify pgrst, 'reload schema';
