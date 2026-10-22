-- Calendario 26/27: jornadas 3 a 15 de la liga (las 1 y 2 ya están cargadas).
-- La competición se copia de los partidos que ya hay en 26/27 y las horas son de España.
-- No duplica: salta los partidos (mismo local y visitante) que ya existan en la temporada.
begin;

insert into sansugus.partidos (local, visitante, fecha, campo, temporada_id, competicion, jornada, jugado)
select v.local, v.visitante, v.hora::timestamp at time zone 'Europe/Madrid', v.campo, t.id,
       coalesce((select p.competicion from sansugus.partidos p where p.temporada_id = t.id order by p.fecha limit 1), 'Liga'),
       v.jornada, false
from sansugus.temporadas t, (values
 ('Jornada 3',  'Minabo de Zagreb',   'Sansugus FC',        '2026-10-25 09:15', 1),
 ('Jornada 4',  'Sansugus FC',        'Fimosis Gang',       '2026-11-08 12:15', 1),
 ('Jornada 5',  'Sansugus FC',        'Negreiras FC',       '2026-11-15 12:15', 2),
 ('Jornada 6',  'Ojos-Albos City',    'Sansugus FC',        '2026-11-29 13:15', 2),
 ('Jornada 7',  'Internacionales CF', 'Sansugus FC',        '2026-12-13 12:15', 3),
 ('Jornada 8',  'Sansugus FC',        'Tripi Taka',         '2026-12-20 12:15', 3),
 ('Jornada 9',  'Sansugus FC',        'Los Demonys',        '2027-01-10 12:15', 3),
 ('Jornada 10', 'Sansugus FC',        'Ínter Strada',       '2027-01-17 12:15', 2),
 ('Jornada 11', 'Valhalla Club',      'Sansugus FC',        '2027-02-20 16:45', 3),
 ('Jornada 12', 'Macgregor F.C',      'Sansugus FC',        '2027-02-28 10:15', 1),
 ('Jornada 13', 'Sansugus FC',        'Mortadelos FC',      '2027-03-06 17:45', 3),
 ('Jornada 14', 'AC Frío',            'Sansugus FC',        '2027-03-14 12:15', 3),
 ('Jornada 15', 'Caimanes CF',        'Sansugus FC',        '2027-03-21 12:15', 1)
) as v(jornada, local, visitante, hora, campo)
where t.nombre = '26/27'
  and not exists (select 1 from sansugus.partidos p
                  where p.temporada_id = t.id and p.local = v.local and p.visitante = v.visitante);

commit;
