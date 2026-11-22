-- ════════════════════════════════════════════════════════════════════════════
-- SANSUGUS FC · Índices de rendimiento (auditoría de rendimiento, nov. 2026)
-- Las dos tablas tienen clave primaria (jugador_id, temporada_id), que no sirve para
-- buscar solo por temporada; y temporada_id es además clave foránea sin índice.
-- Consultas que los usan:
--  · jugador_temporada (temporada_id): plantilla del panel, resumen (recuento), vista
--    estadisticas_jugador filtrada por temporada, borrado en cascada de una temporada.
--  · estadisticas_historicas (temporada_id): guardar_acta_partido (comprueba si la
--    temporada usa estadísticas históricas), plantilla y resumen del panel, cascada.
-- Las tablas son pequeñas: se crean sin CONCURRENTLY (el bloqueo dura milisegundos y
-- las migraciones se aplican dentro de una transacción). Idempotente.
-- Para deshacer: drop index if exists sansugus.jugador_temporada_temporada_idx;
--                drop index if exists sansugus.estadisticas_historicas_temporada_idx;
-- ════════════════════════════════════════════════════════════════════════════

create index if not exists jugador_temporada_temporada_idx
  on sansugus.jugador_temporada (temporada_id);

create index if not exists estadisticas_historicas_temporada_idx
  on sansugus.estadisticas_historicas (temporada_id);

analyze sansugus.jugador_temporada;
analyze sansugus.estadisticas_historicas;
