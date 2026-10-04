-- ════════════════════════════════════════════════════════════════════════════
-- SANSUGUS FC · Funciones del panel de administración
-- Las estadísticas por jugador (vista sansugus.estadisticas_jugador) se calculan
-- desde las actas: al guardar un acta, goles, asistencias, tarjetas y MVP quedan
-- reflejados al instante en la plantilla, la ficha del jugador y los totales.
-- ════════════════════════════════════════════════════════════════════════════

-- NOTA: activar_temporada ya está aplicada en Supabase; el resto (guardar_acta_partido y el
-- trigger de plantilla) contiene DELETE y hay que aplicarlo desde el editor SQL de Supabase.

-- ─── Activar una temporada (la web muestra siempre la activa) ──────────────
create or replace function sansugus.activar_temporada(p_temporada_id int)
returns void
language plpgsql
security definer
set search_path = sansugus, public
as $$
begin
  if not public.is_admin() then
    raise exception 'No tienes permisos de administrador' using errcode = '42501';
  end if;
  if not exists (select 1 from sansugus.temporadas where id = p_temporada_id) then
    raise exception 'La temporada no existe' using errcode = 'P0002';
  end if;
  -- primero se desactiva la anterior: el índice único solo admite una activa
  update sansugus.temporadas set activa = false where activa and id <> p_temporada_id;
  update sansugus.temporadas set activa = true where id = p_temporada_id and not activa;
end;
$$;
revoke all on function sansugus.activar_temporada(int) from public, anon;
grant execute on function sansugus.activar_temporada(int) to authenticated;

-- ─── Guardar el acta de un partido (atómico) ───────────────────────────────
-- p_acta: [{"jugador_id":1,"titular":true,"posicion":"Medio","goles":2,"asistencias":1,
--           "amarillas":0,"rojas":0,"mvp":false,"dorsal":10}, ...]
-- Sustituye el acta completa, añade a la plantilla de la temporada a quien falte y
-- admite como máximo un MVP por partido.
create or replace function sansugus.guardar_acta_partido(p_partido_id int, p_acta jsonb)
returns void
language plpgsql
security definer
set search_path = sansugus, public
as $$
declare
  v_temporada_id int;
  v_acta jsonb := coalesce(p_acta, '[]'::jsonb);
begin
  if not public.is_admin() then
    raise exception 'No tienes permisos de administrador' using errcode = '42501';
  end if;
  select temporada_id into v_temporada_id from sansugus.partidos where id = p_partido_id for update;
  if v_temporada_id is null then
    raise exception 'El partido no existe' using errcode = 'P0002';
  end if;
  if exists (select 1 from sansugus.estadisticas_historicas where temporada_id = v_temporada_id) then
    raise exception 'Esta temporada usa estadísticas históricas y no admite actas' using errcode = '22023';
  end if;
  if (select count(*) <> count(distinct e->>'jugador_id') from jsonb_array_elements(v_acta) e) then
    raise exception 'Un jugador aparece dos veces en el acta' using errcode = '22023';
  end if;
  if (select count(*) from jsonb_array_elements(v_acta) e where coalesce((e->>'mvp')::boolean, false)) > 1 then
    raise exception 'Solo puede haber un MVP por partido' using errcode = '22023';
  end if;

  delete from sansugus.actas where partido_id = p_partido_id;
  insert into sansugus.actas (partido_id, jugador_id, titular, posicion, goles, asistencias, amarillas, rojas, mvp, dorsal)
  select p_partido_id,
         (e->>'jugador_id')::int,
         coalesce((e->>'titular')::boolean, false),
         nullif(e->>'posicion', ''),
         greatest(coalesce((e->>'goles')::int, 0), 0),
         greatest(coalesce((e->>'asistencias')::int, 0), 0),
         greatest(coalesce((e->>'amarillas')::int, 0), 0),
         greatest(coalesce((e->>'rojas')::int, 0), 0),
         coalesce((e->>'mvp')::boolean, false),
         nullif(e->>'dorsal', '')::int
  from jsonb_array_elements(v_acta) e;

  -- Plantilla de la temporada: quien juega debe constar en ella (con su dorsal si no lo tenía)
  insert into sansugus.jugador_temporada (jugador_id, temporada_id, dorsal)
  select a.jugador_id, v_temporada_id, a.dorsal from sansugus.actas a where a.partido_id = p_partido_id
  on conflict (jugador_id, temporada_id)
  do update set dorsal = coalesce(sansugus.jugador_temporada.dorsal, excluded.dorsal);
end;
$$;
revoke all on function sansugus.guardar_acta_partido(int, jsonb) from public, anon;
grant execute on function sansugus.guardar_acta_partido(int, jsonb) to authenticated;

-- ─── Una plantilla no pierde a un jugador que tiene partidos esa temporada ──
create or replace function sansugus.proteger_plantilla()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from sansugus.actas a join sansugus.partidos p on p.id = a.partido_id
    where a.jugador_id = old.jugador_id and p.temporada_id = old.temporada_id
  ) then
    raise exception 'El jugador tiene partidos en esta temporada: borra antes sus actas' using errcode = '23503';
  end if;
  return old;
end;
$$;
create or replace trigger jugador_temporada_proteger before delete on sansugus.jugador_temporada
  for each row execute function sansugus.proteger_plantilla();
