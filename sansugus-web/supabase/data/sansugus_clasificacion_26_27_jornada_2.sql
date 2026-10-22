-- Clasificación 26/27 tras la jornada 2 (sustituye los números de cada equipo y marca la fecha de actualización)
begin;

insert into sansugus.clasificacion (temporada_id, posicion, equipo, jugados, por_jugar, ganados, empatados, perdidos, goles_favor, goles_contra, puntos)
select t.id, v.* from sansugus.temporadas t, (values
 (1,  'Los Demonys',        2, 13, 2, 0, 0, 13,  3, 6),
 (2,  'Fimosis Gang',       2, 13, 2, 0, 0,  8,  5, 6),
 (3,  'Ínter Strada',       2, 13, 2, 0, 0,  6,  3, 6),
 (4,  'Caimanes CF',        2, 13, 1, 1, 0,  6,  3, 4),
 (5,  'Real Astrazeneca',   2, 13, 1, 1, 0,  7,  6, 4),
 (6,  'Minabo de Zagreb',   2, 13, 1, 0, 1,  5,  2, 3),
 (7,  'Ojos-Albos City',    2, 13, 1, 0, 1,  8,  6, 3),
 (8,  'AC Frío',            2, 13, 1, 0, 1,  4,  4, 3),
 (9,  'Macgregor F.C',      2, 13, 1, 0, 1,  8,  9, 3),
 (10, 'Sansugus FC',        2, 13, 0, 2, 0,  6,  6, 2),
 (11, 'DC Real Estate',     2, 13, 0, 2, 0,  3,  3, 2),
 (12, 'Negreiras FC',       1, 14, 0, 0, 1,  5,  6, 0),
 (13, 'Internacionales CF', 2, 13, 0, 0, 2,  2,  5, 0),
 (14, 'Valhalla Club',      1, 14, 0, 0, 1,  2,  6, 0),
 (15, 'Mortadelos FC',      2, 13, 0, 0, 2,  3,  8, 0),
 (16, 'Tripi Taka',         2, 13, 0, 0, 2,  4, 15, 0)
) as v(posicion, equipo, jugados, por_jugar, ganados, empatados, perdidos, goles_favor, goles_contra, puntos)
where t.nombre = '26/27'
on conflict (temporada_id, equipo) do update set
  posicion     = excluded.posicion,
  jugados      = excluded.jugados,
  por_jugar    = excluded.por_jugar,
  ganados      = excluded.ganados,
  empatados    = excluded.empatados,
  perdidos     = excluded.perdidos,
  goles_favor  = excluded.goles_favor,
  goles_contra = excluded.goles_contra,
  puntos       = excluded.puntos,
  actualizada  = now();

commit;
