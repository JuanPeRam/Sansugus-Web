USE railway;
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

INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Juan Pereira','Pere');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Iñigo Saenz Mesas','Iñi');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Roberto Lage','Robert');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Javier Delgado','Portu');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('José Delgado','Joselu');
INSERT INTO Players (Player_Name, Player_Aka) VALUES ('Luis Vico GK','Vico');
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

INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Juan Pereira'),'Delantero',9,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Iñigo Saenz Mesas'),'Medio',22,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Roberto Lage'),'Medio',24,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Javier Delgado'),'Defensa',5,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'José Delgado'),'Defensa',2,'23/24');
INSERT INTO Players_Info VALUES ((SELECT Player_ID FROM Players WHERE Player_Name = 'Luis Vico GK'),'Portero',1,'23/24');
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