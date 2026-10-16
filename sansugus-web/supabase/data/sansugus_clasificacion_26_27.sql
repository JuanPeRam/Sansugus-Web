-- Clasificación 26/27 tras la jornada 1 (carga inicial; las siguientes se hacen desde Panel → Clasificación)
insert into sansugus.clasificacion (temporada_id, posicion, equipo, jugados, por_jugar, ganados, empatados, perdidos, goles_favor, goles_contra, puntos)
select t.id, v.* from sansugus.temporadas t, (values
 (1,  'Minabo de Zagreb',   1, 14, 1, 0, 0, 4, 0, 3),
 (2,  'Caimanes CF',        1, 14, 1, 0, 0, 5, 2, 3),
 (3,  'Fimosis Gang',       1, 14, 1, 0, 0, 4, 2, 3),
 (4,  'Ínter Strada',       1, 14, 1, 0, 0, 4, 2, 3),
 (5,  'Los Demonys',        1, 14, 1, 0, 0, 3, 1, 3),
 (6,  'Real Astrazeneca',   1, 14, 1, 0, 0, 3, 2, 3),
 (7,  'DC Real Estate',     1, 14, 0, 1, 0, 2, 2, 1),
 (8,  'Sansugus FC',        1, 14, 0, 1, 0, 2, 2, 1),
 (9,  'Negreiras FC',       0, 15, 0, 0, 0, 0, 0, 0),
 (10, 'Valhalla Club',      0, 15, 0, 0, 0, 0, 0, 0),
 (11, 'AC Frío',            1, 14, 0, 0, 1, 2, 3, 0),
 (12, 'Macgregor F.C',      1, 14, 0, 0, 1, 2, 4, 0),
 (13, 'Ojos-Albos City',    1, 14, 0, 0, 1, 2, 4, 0),
 (14, 'Internacionales CF', 1, 14, 0, 0, 1, 1, 3, 0),
 (15, 'Tripi Taka',         1, 14, 0, 0, 1, 2, 5, 0),
 (16, 'Mortadelos FC',      1, 14, 0, 0, 1, 0, 4, 0)
) as v(posicion, equipo, jugados, por_jugar, ganados, empatados, perdidos, goles_favor, goles_contra, puntos)
where t.nombre = '26/27'
on conflict (temporada_id, equipo) do nothing;
