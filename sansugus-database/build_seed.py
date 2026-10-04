#!/usr/bin/env python3
"""Genera el SQL de carga inicial del esquema `sansugus` a partir de los CSV del Excel.

Uso: python3 build_seed.py   →  escribe sansugus-web/supabase/data/sansugus_seed_*.sql
"""
import csv, re, sys
from collections import OrderedDict
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE.parent / 'sansugus-web' / 'supabase' / 'data'
OUT.mkdir(parents=True, exist_ok=True)

def rd(name):
    with open(HERE / 'csv' / name, encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))

def q(s):
    return 'null' if s is None else "'" + str(s).replace("'", "''") + "'"
def n(v):
    return 'null' if v is None else str(int(v))
def b(v):
    return 'true' if v else 'false'
def toint(v):
    v = (v or '').strip()
    return int(v) if v.lstrip('-').isdigit() else None

# Normalización de nombres (se conservan los del Excel salvo erratas evidentes)
PLAYER_FIX = {'Jose Delgado': 'José Delgado', 'Pepe': 'Pepe Mesas', 'PP (Propia puerta)': 'P.P'}
TEAM_FIX = {'Sansugus CF': 'Sansugus FC', 'Real Astrazeneca': 'Real Astrazeneca FC',
            'Sporting de Brugal': 'Sporting Brugal'}
def player(name):
    return PLAYER_FIX.get(name.strip(), name.strip())
def team(name):
    name = name.strip()
    return TEAM_FIX.get(name, name)

A, E, P, J = rd('actas.csv'), rd('estadisticas.csv'), rd('partidos.csv'), rd('jugadores.csv')

# ── Temporadas ──
seasons = sorted({p['Temporada'] for p in P})
sid = {s: i + 1 for i, s in enumerate(seasons)}
ACTIVE = seasons[-1]

# ── Jugadores ──
players = OrderedDict()
for j in J:
    players[j['Nombre']] = dict(alias=j['Alias'], pos=j['Posicion'], pp=False)
players.setdefault('Gabriel Valle Silva', dict(alias='Gabri', pos=None, pp=False))
players.setdefault('Álvaro Cea', dict(alias='Cea', pos=None, pp=False))
players.setdefault('P.P', dict(alias='Propia Puerta', pos=None, pp=True))
pid = {name: i + 1 for i, name in enumerate(players)}
for a in A:
    assert player(a['Jugador']) in pid, a['Jugador']
for e in E:
    if e['Jugador'] != 'Total':
        assert player(e['Jugador']) in pid, e['Jugador']

# ── Dorsales por (jugador, temporada) ──
dorsal = {}
for e in E:
    if e['Jugador'] == 'Total': continue
    d = toint(e['Dorsal'])
    if d is not None: dorsal[(player(e['Jugador']), e['Temporada'])] = d
for a in A:
    d = toint(a['Dorsal']); k = (player(a['Jugador']), a['Temporada'])
    if d is not None: dorsal.setdefault(k, d)
for j in J:  # último recurso: dorsal de la ficha del jugador
    pass

# ── Plantilla por temporada ──
squad = OrderedDict()
for e in E:
    if e['Jugador'] != 'Total':
        squad[(player(e['Jugador']), e['Temporada'])] = None
for a in A:
    squad.setdefault((player(a['Jugador']), a['Temporada']), None)
fichas = {j['Nombre']: toint(j['Dorsal']) for j in J}

# ── Históricas (temporadas sin actas) ──
seasons_with_actas = {a['Temporada'] for a in A}
hist = OrderedDict()
for e in E:
    if e['Jugador'] == 'Total' or e['Temporada'] in seasons_with_actas: continue
    k = (player(e['Jugador']), e['Temporada'])
    assert k not in hist, k
    hist[k] = [toint(e[c]) or 0 for c in ('Goles', 'Asistencias', 'Partidos', 'Amarillas', 'Rojas', 'MVP')]

ref = []
ref.append('-- Carga inicial Sansugus · referencias (generado por sansugus-database/build_seed.py)')
ref.append('insert into sansugus.temporadas (id, nombre, activa) values ' +
           ', '.join(f"({sid[s]}, {q(s)}, {b(s == ACTIVE)})" for s in seasons) + ';')
ref.append('insert into sansugus.jugadores (id, nombre, alias, posicion, propia_puerta) values\n' +
           ',\n'.join(f"({pid[nm]}, {q(nm)}, {q(v['alias'] or None)}, {q(v['pos'])}, {b(v['pp'])})" for nm, v in players.items()) + ';')
ref.append('insert into sansugus.jugador_temporada (jugador_id, temporada_id, dorsal) values\n' +
           ',\n'.join(f"({pid[nm]}, {sid[s]}, {n(dorsal.get((nm, s), fichas.get(nm) if (nm, s) not in {(player(e['Jugador']), e['Temporada']) for e in E if e['Jugador']!='Total'} else None))})"
                      for (nm, s) in squad) + ';')
ref.append('insert into sansugus.estadisticas_historicas (jugador_id, temporada_id, goles, asistencias, partidos, amarillas, rojas, mvp) values\n' +
           ',\n'.join(f"({pid[nm]}, {sid[s]}, {', '.join(map(str, v))})" for (nm, s), v in hist.items()) + ';')
ref.append("select setval(pg_get_serial_sequence('sansugus.temporadas','id'), (select max(id) from sansugus.temporadas));")
ref.append("select setval(pg_get_serial_sequence('sansugus.jugadores','id'), (select max(id) from sansugus.jugadores));")
(OUT / 'sansugus_seed_1_referencias.sql').write_text('\n'.join(ref) + '\n', encoding='utf-8')

# ── Partidos ──
TZ = ZoneInfo('Europe/Madrid')
def fecha(s):
    s = (s or '').strip()
    if not s: return None
    d = datetime.strptime(s, '%Y-%m-%d %H:%M').replace(tzinfo=TZ)
    return d.isoformat()
def goles(v):
    v = (v or '').strip()
    if not v: return (None, None)
    m = re.fullmatch(r'(\d+)(?:\s*\((\d+)\))?', v)
    assert m, v
    return (int(m.group(1)), int(m.group(2)) if m.group(2) else None)

rows = []
for p in P:
    num = int(p['ID_Partido'].split('.')[1])
    gl, pl = goles(p['Goles Local']); gv, pv = goles(p['Goles Visitante'])
    rows.append(f"({num}, {q(team(p['Local']))}, {q(team(p['Visitante']))}, {q(fecha(p['Fecha']))}, {n(gl)}, {n(gv)}, {n(pl)}, {n(pv)}, "
                f"{n(toint(p['Campo']))}, {sid[p['Temporada']]}, {q(p['Competición'].strip())}, {q(p['Jornada'].strip())}, {b(p['Jugado'] == 'TRUE')})")
(OUT / 'sansugus_seed_2_partidos.sql').write_text(
    'insert into sansugus.partidos (id, local, visitante, fecha, goles_local, goles_visitante, penaltis_local, penaltis_visitante, campo, temporada_id, competicion, jornada, jugado) values\n'
    + ',\n'.join(rows) + ';\n'
    + "select setval(pg_get_serial_sequence('sansugus.partidos','id'), (select max(id) from sansugus.partidos));\n", encoding='utf-8')

# ── Actas ──
arows = []
for a in A:
    nm = player(a['Jugador']); num = int(a['ID_Partido'].split('.')[1])
    d = toint(a['Dorsal']) or dorsal.get((nm, a['Temporada']))
    arows.append(f"({num}, {pid[nm]}, {b(a['Titular'] == 'TRUE')}, {q(a['Posición'].strip() or None)}, {int(a['Goles'])}, {int(a['Asistencias'])}, "
                 f"{int(a['Amarillas'])}, {int(a['Rojas'])}, {b(a['MVP'] == 'TRUE')}, {n(d)})")
HEAD = 'insert into sansugus.actas (partido_id, jugador_id, titular, posicion, goles, asistencias, amarillas, rojas, mvp, dorsal) values\n'
half = len(arows) // 2
(OUT / 'sansugus_seed_3_actas_a.sql').write_text(HEAD + ',\n'.join(arows[:half]) + ';\n', encoding='utf-8')
(OUT / 'sansugus_seed_4_actas_b.sql').write_text(HEAD + ',\n'.join(arows[half:]) + ';\n', encoding='utf-8')
print('jugadores', len(players), 'plantilla', len(squad), 'hist', len(hist), 'partidos', len(rows), 'actas', len(arows))
