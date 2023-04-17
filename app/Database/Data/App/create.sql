DROP DATABASE IF EXISTS this_role_app;

CREATE DATABASE this_role_app;

USE this_role_app;

CREATE TABLE users(
	user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	user_username VARCHAR(20) NOT NULL,
	user_fname VARCHAR(100),
	user_avatar VARCHAR(200) DEFAULT '/assets/media/avatars/blank.png',
	user_email VARCHAR(100),
	user_pwd VARCHAR(200),
	user_rol ENUM('user', 'admin') DEFAULT "user",
	user_bday DATE DEFAULT NULL,
	user_confirmed DATETIME DEFAULT NULL,
	user_deleted DATETIME DEFAULT NULL
);

CREATE TABLE tokens(
	token VARCHAR(100) PRIMARY KEY,
	token_user VARCHAR(100),
	token_expires DATETIME DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY)
);

CREATE TABLE games(
	game_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	game_user_creator INT UNSIGNED,
	game_title VARCHAR(50),
	game_details LONGTEXT,
	game_icon VARCHAR(200),
	game_folder VARCHAR(200),
	game_deleted DATETIME DEFAULT NULL,
	FOREIGN KEY(game_user_creator) REFERENCES users(user_id)
);

CREATE TABLE invite_url(
	id_game INT UNSIGNED,
	id_user INT UNSIGNED,
	url VARCHAR(200),
	url_expires DATETIME DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
	FOREIGN KEY(id_game) REFERENCES games(game_id),
	FOREIGN KEY(id_user) REFERENCES users(user_id)
);

CREATE TABLE issues(
  issue_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  issue_user VARCHAR(20),
  issue_title VARCHAR(50),
  issue_type ENUM('suggestion', 'congratulation', 'complaint', 'help'),
  issue_msg JSON
);

INSERT INTO users(user_username, user_fname, user_email, user_pwd, user_confirmed)
VALUES
	('effs', 'La Effy', 'ericapastor@gmail.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('marioe23', 'Mario Sancho', 'mail@mail.mail', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('JL.ak.elBizco', 'Jose Luis El Bizco', 'com@com.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('FF15', 'Fernando Fernandez', 'ffmail@email.f', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW());

UPDATE users SET user_rol='admin' WHERE user_email='ericapastor@gmail.com';