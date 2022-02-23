DROP DATABASE IF EXISTS `daaexample`;
CREATE DATABASE `daaexample`;

CREATE TABLE `daaexample`.`people` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(50) NOT NULL,
	`surname` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `daaexample`.`users` (
	`login` varchar(100) NOT NULL,
	`password` varchar(64) NOT NULL,
	`role` varchar(10) NOT NULL,
	PRIMARY KEY (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `daaexample`.`pets` (
                                      `pet_id` int NOT NULL AUTO_INCREMENT,
                                      `name` varchar(100) NOT NULL,
                                      `type` varchar(100) NOT NULL,
                                      `id` int NOT NULL,
                                      PRIMARY KEY (`pet_id`),
                                      FOREIGN KEY (`id`) REFERENCES `daaexample`.`people`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE USER IF NOT EXISTS 'daa'@'localhost' IDENTIFIED WITH mysql_native_password BY 'daa';
GRANT ALL ON `daaexample`.* TO 'daa'@'localhost';

INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Antón','Pérez');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Manuel','Martínez');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Laura','Reboredo');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Perico','Palotes');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Ana','María');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'María','Nuevo');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Alba','Fernández');
INSERT INTO `daaexample`.`people` (`id`,`name`,`surname`) VALUES (0,'Asunción','Jiménez');

INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Augustin','Cormorant, great', 1);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Mylo','Red meerkat', 2);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Hadrian','Vervet monkey', 2);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Amery','Partridge, coqui',4);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Gregorio','Burchell''s gonolek',3);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Eberto','Gnu, brindled',6);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Barny','Common long-nosed armadillo',5);
INSERT INTO `daaexample`.`pets` (id,`name`,`type`,ownerId) VALUES (0,'Buckie','Screamer, crested',4);

-- The password for each user is its login suffixed with "pass". For example, user "admin" has the password "adminpass".
INSERT INTO `daaexample`.`users` (`login`,`password`,`role`)
VALUES ('admin', '713bfda78870bf9d1b261f565286f85e97ee614efe5f0faf7c34e7ca4f65baca','ADMIN');
INSERT INTO `daaexample`.`users` (`login`,`password`,`role`)
VALUES ('normal', '7bf24d6ca2242430343ab7e3efb89559a47784eea1123be989c1b2fb2ef66e83','USER');
