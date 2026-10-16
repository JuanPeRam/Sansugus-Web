-- ════════════════════════════════════════════════════════════════════════════
-- SANSUGUS FC · Clasificación de la liga por temporada
-- Una fila por equipo y temporada. Se actualiza cada semana desde Panel → Clasificación
-- y la web muestra en Inicio la de la temporada activa.
-- (Las tablas antiguas clasificaciones / clasificacion_filas las quita la migración
--  20261004110000_sansugus_quitar_clasificaciones.sql.)
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists sansugus.clasificacion (
  temporada_id int not null references sansugus.temporadas (id) on delete cascade,
  posicion     int not null check (posicion > 0),
  equipo       text not null check (btrim(equipo) <> ''),
  jugados      int not null default 0 check (jugados >= 0),   -- PJ
  por_jugar    int not null default 0 check (por_jugar >= 0), -- PR (partidos restantes)
  ganados      int not null default 0 check (ganados >= 0),
  empatados    int not null default 0 check (empatados >= 0),
  perdidos     int not null default 0 check (perdidos >= 0),
  goles_favor  int not null default 0 check (goles_favor >= 0),
  goles_contra int not null default 0 check (goles_contra >= 0),
  puntos       int not null default 0,                         -- puede ser negativo por sanciones
  actualizada  timestamptz not null default now(),
  primary key (temporada_id, equipo)
);
create index if not exists clasificacion_temporada_pos_idx on sansugus.clasificacion (temporada_id, posicion);

-- ─── Seguridad: lectura pública, escritura solo para administradores ────────
alter table sansugus.clasificacion enable row level security;
create policy "lectura publica" on sansugus.clasificacion for select to anon, authenticated using (true);
create policy "admins escriben" on sansugus.clasificacion for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on sansugus.clasificacion to anon, authenticated;
grant insert, update, delete on sansugus.clasificacion to authenticated;
grant all on sansugus.clasificacion to service_role;

notify pgrst, 'reload schema';
