use sansugus;
DROP TABLE IF EXISTS Player_Stats;
DROP TABLE IF EXISTS Player_Game;
DROP TABLE IF EXISTS Players_Info;
DROP TABLE IF EXISTS Players;
DROP TABLE IF EXISTS Games;

CREATE TABLE Players (
	Player_ID INT NOT NULL auto_increment,
    Player_Name VARCHAR(50) NOT NULL UNIQUE,
	Player_Aka VARCHAR(50),
    primary key(Player_ID)
);
CREATE TABLE Players_Info(
	Player_ID INT NOT NULL,
    Player_Position VARCHAR(50) NOT NULL,
    Player_Number INT NOT NULL,
    Season VARCHAR(50) NOT NULL,
    FOREIGN KEY (Player_ID) REFERENCES Players(Player_ID),
    Primary key (Player_ID, Season)
);

CREATE TABLE Games(
    Game_ID INT NOT NULL auto_increment,
    Home_Team VARCHAR(50) NOT NULL,
    Away_Team VARCHAR(50) NOT NULL,
    Game_Date DATETIME,
    Home_Goals VARCHAR(10),
    Away_Goals VARCHAR(10),
    Field INT,
    Season VARCHAR(50) NOT NULL,
    Competition VARCHAR(50) NOT NULL,
    Round VARCHAR(50) NOT NULL,
    Played BIT NOT NULL,
    Primary key(Game_ID)
);

CREATE TABLE Player_Game (
	Game_ID INT NOT NULL,
    Player_ID INT NOT NULL,
    Starter BIT DEFAULT 0,
    Position VARCHAR(50) NOT NULL,
    Goals INT DEFAULT 0,
    Assists  INT DEFAULT 0,
    Yellows INT DEFAULT 0,
    Reds INT DEFAULT 0,
    IsMVP BIT DEFAULT 0,
    Season VARCHAR(50) NOT NULL,
    primary key(Game_ID,Player_ID),
    FOREIGN KEY (Game_ID) REFERENCES Games(Game_ID),
    FOREIGN key (Player_ID) REFERENCES Players(Player_ID)
);

CREATE TABLE Player_Stats(
    Player_ID INT NOT NULL,
    Season VARCHAR(50) NOT NULL,
    Goals INT DEFAULT 0,
    Assists INT,
    Games INT NOT NULL,
    Yellows INT NOT NULL,
    Reds INT NOT NULL,
    MVPs INT,
    primary key (Player_ID, Season),
    FOREIGN KEY (Player_ID) REFERENCES Players(Player_ID)
);

INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Juan Pereira','Pere');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Iñigo Saenz Mesas','Iñi');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Roberto Lage','Robert');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Javier Delgado','Portu');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('José Delgado','Joselu');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Luis Vico','Vico');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Félix Barragán','Félix');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Marcos Herrero','Mark');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Jorge Muñoz','Drako');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Daniel Sanz','Dani');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Miguel Ángel Rodríguez','Migue');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Sergio Hernández','Checho');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Carlos Pérez','Charly');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('David Berdiales','Berdi');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Jorge Heras','Jorge');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Fernando Oteo','Fer');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('P.P','Propia Puerta');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Diego López','Goyón');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Gabriel Valle Silva','Gabri');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Álvaro Cea','Cea');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Pepe Mesas','Pepe');

INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),'Delantero',9,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),'Medio',22,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),'Medio',24,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),'Defensa',5,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),'Defensa',2,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),'Portero',1,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),'Medio',3,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),'Delantero',7,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),'Defensa',4,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),'Defensa',8,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),'Medio',10,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),'Medio',14,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),'Medio',69,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'David Berdiales'),'Portero',28,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Heras'),'Portero',98,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Fernando Oteo'),'Medio',99,'23/24');

INSERT INTO Games VALUES (NULL,'Sansugus FC','ALH','2021-10-16 19:15:00','6','1','3','21/22','Torneo Apertura','Jornada 1',1);
INSERT INTO Games VALUES (NULL,'Valhalla Club','Sansugus FC','2021-10-23 19:15:00','1','4','3','21/22','Torneo Apertura','Jornada 2',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Juventus FC','2021-11-07 10:45:00','3','2','1','21/22','Torneo Apertura','Jornada 3',1);
INSERT INTO Games VALUES (NULL,'Kamikaze FC','Sansugus FC','2021-11-14 12:45:00','4','4','3','21/22','Torneo Apertura','Jornada 4',1);
INSERT INTO Games VALUES (NULL,'Internacionales FC','Sansugus FC','2021-11-21 09:45:00','2','2','2','21/22','Torneo Apertura','Jornada 5',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Enfurbaos CF','2021-11-28 09:45:00','2','1','1','21/22','Torneo Apertura','Jornada 6',1);
INSERT INTO Games VALUES (NULL,'Black&White','Sansugus FC','2021-12-12 09:45:00','2','3','1','21/22','Torneo Apertura','Jornada 7',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Caseto United','2021-12-19 10:45:00','3','3','2','21/22','Torneo Apertura','Jornada 8',1);
INSERT INTO Games VALUES (NULL,'Team Perú','Sansugus FC','2022-01-16 10:45:00','0','3','3','21/22','Torneo Apertura','Jornada 9',0);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Buniatis Cleb','2022-01-23 09:45:00','2','5','3','21/22','Torneo Apertura','Jornada 10',1);
INSERT INTO Games VALUES (NULL,'Talleres Pinho','Sansugus FC','2022-01-30 10:45:00','2','3','1','21/22','Torneo Apertura','Jornada 11',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','The Hammers FC','2022-02-05 16:15:00','3','2','3','21/22','Torneo Clausura','Jornada 1',1);
INSERT INTO Games VALUES (NULL,'Boca Roners','Sansugus FC','2022-02-13 09:45:00','5','1','2','21/22','Torneo Clausura','Jornada 2',1);
INSERT INTO Games VALUES (NULL,'Élite FC','Sansugus CF','2022-02-20 09:45:00','0','4','1','21/22','Torneo Clausura','Jornada 3',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Enfurbaos CF','2022-02-27 09:45:00','3','4','2','21/22','Torneo Clausura','Jornada 4',1);
INSERT INTO Games VALUES (NULL,'ALH','Sansugus FC','2022-03-06 10:45:00','2','1','1','21/22','Torneo Clausura','Jornada 5',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Paketenaikos FC','2022-03-13 10:45:00','0','4','2','21/22','Torneo Clausura','Jornada 6',1);
INSERT INTO Games VALUES (NULL,'Valhalla Club','Sansugus FC','2022-03-19 16:45:00','4','2','3','21/22','Torneo Clausura','Jornada 7',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Buniatis Cleb','2022-03-27 11:45:00','1','5','3','21/22','Torneo Clausura','Jornada 8',1);
INSERT INTO Games VALUES (NULL,'El Chimbón VC','Sansugus FC','2022-04-03 11:45:00','3','4','1','21/22','Torneo Clausura','Jornada 9',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Real Astrazeneca FC','2022-04-10 11:45:00','1','4','3','21/22','Torneo Clausura','Jornada 10',1);
INSERT INTO Games VALUES (NULL,'Black&White','Sansugus FC','2022-04-24 12:45:00','3','1','3','21/22','Torneo Clausura','Jornada 11',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Leyendas FC','2022-05-08 10:45:00','5 (4)','5 (3)','2','21/22','Europa League','Cuartos de final',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Internacionales FC','2022-05-22 11:00:00','5','3','2','21/22','Europa League','Semifinal',1);
INSERT INTO Games VALUES (NULL,'Enfurbaos CF','Sansugus FC','2022-05-28 12:30:00','2','1','1','21/22','Europa League','Final',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Ínter Strada','2022-10-16 09:15:00','0','3','2','22/23','Torneo Apertura','Jornada 1',1);
INSERT INTO Games VALUES (NULL,'Boca Roners','Sansugus FC','2022-10-23 09:15:00','1','4','1','22/23','Torneo Apertura','Jornada 2',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Real Astrazeneca FC','2022-11-13 11:15:00','2','1','1','22/23','Torneo Apertura','Jornada 4',1);
INSERT INTO Games VALUES (NULL,'Tracas FC','Sansugus FC','2022-11-20 10:15:00','1','5','3','22/23','Torneo Apertura','Jornada 5',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Manchester Piti ','2022-11-27 12:15:00','1','2','1','22/23','Torneo Apertura','Jornada 6',1);
INSERT INTO Games VALUES (NULL,'Recreativo de Juerga','Sansugus FC','2022-12-10 18:15:00','1','6','3','22/23','Torneo Apertura','Jornada 7',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Team Perú','2022-12-18 09:15:00','3','0','3','22/23','Torneo Apertura','Jornada 8',0);
INSERT INTO Games VALUES (NULL,'El Chimbón VC','Sansugus FC','2023-01-15 10:15:00','2','2','2','22/23','Torneo Apertura','Jornada 9',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Valhalla Club','2023-01-21 18:15:00','5','8','3','22/23','Torneo Apertura','Jornada 10',1);
INSERT INTO Games VALUES (NULL,'Los Guerreros','Sansugus FC','2023-01-29 18:15:00','0','3','2','22/23','Torneo Apertura','Jornada 11',0);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Calvix Team','2023-02-12 09:15:00','5','2','1','22/23','Torneo Clausura','Jornada 2',1);
INSERT INTO Games VALUES (NULL,'Élite FC','Sansugus FC','2023-02-19 09:15:00','4','3','2','22/23','Torneo Clausura','Jornada 3',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Texas Guadarrama','2023-02-26 09:15:00','5','4','1','22/23','Torneo Clausura','Jornada 4',1);
INSERT INTO Games VALUES (NULL,'Manchester Piti ','Sansugus FC','2023-03-05 10:15:00','3','5','2','22/23','Torneo Clausura','Jornada 5',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Valhalla Club','2023-03-11 16:45:00','3','7','3','22/23','Torneo Clausura','Jornada 6',1);
INSERT INTO Games VALUES (NULL,'Leyendas FC','Sansugus FC','2023-03-19 09:15:00','3','4','1','22/23','Torneo Clausura','Jornada 7',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Buniatis Cleb','2023-03-26 09:15:00','2','3','2','22/23','Torneo Clausura','Jornada 8',1);
INSERT INTO Games VALUES (NULL,'Paketenaikos FC','Sansugus FC','2023-04-02 09:15:00','4','6','2','22/23','Torneo Clausura','Jornada 9',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Manza Football Club','2023-04-16 09:15:00','3','4','3','22/23','Torneo Clausura','Jornada 10',1);
INSERT INTO Games VALUES (NULL,'Latinos FC','Sansugus FC','2023-04-23 09:15:00','1','7','3','22/23','Torneo Clausura','Jornada 11',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Scissors FC','2023-05-07 10:15:00','3','0','3','22/23','Fase Previa Copa','1/16 de Final',0);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Internacionales FC','2023-05-14 09:30:00','4','1','2','22/23','Champions League','1/8 de Final',1);
INSERT INTO Games VALUES (NULL,'Ínter Strada','Sansugus FC','2023-05-21 10:00:00','1','2','2','22/23','Champions League','Cuartos de final',1);
INSERT INTO Games VALUES (NULL,'Élite FC','Sansugus FC','2023-05-28 10:00:00','3','2','2','22/23','Champions League','Semifinal',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Descansa',null,null,null,null,'22/23','Torneo Apertura','Jornada 3',0);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Descansa',null,null,null,null,'22/23','Torneo Clausura','Jornada 1',0);
INSERT INTO Games VALUES (NULL,'Sporting Brugal','Sansugus FC','2023-10-12 12:30:00','2','5','3','23/24','Torneo Apertura','Jornada 1',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Team Perú','2023-10-29 10:30:00','6','2','3','23/24','Torneo Apertura','Jornada 2',1);
INSERT INTO Games VALUES (NULL,'The Gorronalboys','Sansugus FC','2023-11-05 9:30:00','5','4','3','23/24','Torneo Apertura','Jornada 3',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Internacionales FC','2023-11-12 9:30:00','6','2','3','23/24','Torneo Apertura','Jornada 4',1);
INSERT INTO Games VALUES (NULL,'Manchester Piti ','Sansugus FC','2023-11-19 19:15:00','6','2','3','23/24','Torneo Apertura','Jornada 5',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Aston Birra','2023-11-26 9:30:00','1','4','2','23/24','Torneo Apertura','Jornada 6',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Talleres Pinho','2023-12-03 10:30:00','1','1','2','23/24','Torneo Apertura','Jornada 7',1);
INSERT INTO Games VALUES (NULL,'Texas Guadarrama','Sansugus FC','2023-12-17 9:30:00','4','5','1','23/24','Torneo Apertura','Jornada 8',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Enfurbaos CF','2024-01-14 10:30:00','4','1','1','23/24','Torneo Apertura','Jornada 9',1);
INSERT INTO Games VALUES (NULL,'Olimpiakojos FC','Sansugus FC','2024-01-21 10:30:00','4','4','1','23/24','Torneo Apertura','Jornada 10',1);
INSERT INTO Games VALUES (NULL,'Sansugus FC','Real Suciedad','2024-01-27 15:15:00','3','1','3','23/24','Torneo Apertura','Jornada 11',1);
INSERT INTO Games VALUES (NULL,'Real Astrazeneca ','Sansugus FC','2024-02-04 9:30:00','0','3','2','23/24','Torneo Clausura','Jornada 1',1);

DELETE FROM Player_Game;

INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',2,1,1,0,1,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',1,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),1,'Defensa',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Defensa',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),0,'Defensa',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),0,'Defensa',1,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),0,'Medio',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (52,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',0,2,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),1,'Delantero',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),1,'Medio',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),0,'Defensa',0,2,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),0,'Delantero',4,0,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (53,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),0,'Medio',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),1,'Medio',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (54,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',2,2,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),1,'Delantero',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),1,'Medio',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Defensa',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),1,'Portero',0,2,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),0,'Delantero',2,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (55,(SELECT Player_ID FROM Players WHERE Player_Name = 'P.P'),0,'',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),0,'Medio',1,1,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),1,'Medio',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (56,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),1,'Medio',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),1,'Delantero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),1,'Medio',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),0,'Delantero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (57,(SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),0,'Medio',1,0,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Medio',1,0,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'David Berdiales'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',0,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (58,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',1,2,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'David Berdiales'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (59,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),0,'Medio',2,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Delantero',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Medio',0,0,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),0,'Defensa',0,2,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',1,0,1,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Heras'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (60,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),1,'Defensa',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),1,'Delantero',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),1,'Medio',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',1,0,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),1,'Defensa',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Portero',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),0,'Delantero',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (61,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Delantero',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',2,1,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),1,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'David Berdiales'),1,'Portero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),0,'Delantero',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),0,'Medio',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (62,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),1,'Portero',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),1,'Medio',1,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),1,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),0,'Defensa',0,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),1,'Defensa',0,1,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),1,'Delantero',1,0,0,0,0,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),0,'Defensa',1,0,0,0,1,'23/24');
INSERT INTO Player_Game VALUES (63,(SELECT Player_ID FROM Players WHERE Player_Name = 'Fernando Oteo'),1,'Medio',0,0,0,0,0,'23/24');

DELETE FROM Player_Stats;
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),'21/22',9,null,14,2,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Fernando Oteo'),'21/22',6,null,21,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),'21/22',14,null,19,4,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),'21/22',7,null,7,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),'21/22',1,null,21,1,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),'21/22',10,null,19,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),'21/22',0,null,9,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),'21/22',1,null,15,3,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Diego López'),'21/22',0,null,4,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),'21/22',1,null,11,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),'21/22',1,null,12,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'P.P'),'21/22',1,null,0,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),'21/22',3,null,15,1,1,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Gabriel Valle Silva'),'21/22',1,null,15,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Álvaro Cea'),'21/22',6,null,5,0,0,null);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Pepe Mesas'),'21/22',3,null,6,0,0,null);

INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),'22/23',25,4,14,2,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Fernando Oteo'),'22/23',16,11,21,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),'22/23',9,15,19,4,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),'22/23',5,4,7,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),'22/23',5,1,21,1,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),'22/23',4,3,19,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),'22/23',2,null,5,1,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),'22/23',2,4,9,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),'22/23',2,2,15,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),'22/23',1,2,3,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Diego López'),'22/23',1,null,4,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Jose Delgado'),'22/23',1,1,5,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),'22/23',1,2,11,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),'22/23',1,1,12,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'P.P'),'22/23',1,null,0,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),'22/23',0,3,15,1,1,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Pepe Mesas'),'22/23',0,1,6,0,0,0);

INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Miguel Ángel Rodríguez'),'23/24',7,6,10,1,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Fernando Oteo'),'23/24',0,null,1,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),'23/24',6,3,8,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Marcos Herrero'),'23/24',12,6,12,2,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),'23/24',2,1,10,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Daniel Sanz'),'23/24',0,2,11,1,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Jorge Muñoz'),'23/24',0,1,10,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico'),'23/24',0,2,4,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),'23/24',5,4,12,1,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Carlos Pérez'),'23/24',3,2,4,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Diego López'),'23/24',0,null,0,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),'23/24',3,2,12,2,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Félix Barragán'),'23/24',1,null,7,2,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),'23/24',1,2,12,0,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'P.P'),'23/24',1,null,0,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Sergio Hernández'),'23/24',2,1,12,2,0,1);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Pepe Mesas'),'23/24',0,null,0,0,0,0);
INSERT INTO Player_Stats VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'David Berdiales'),'23/24',0,null,3,0,0,0);