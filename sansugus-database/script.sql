DROP TABLE IF EXISTS Players_Info;
DROP TABLE IF EXISTS Players;
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