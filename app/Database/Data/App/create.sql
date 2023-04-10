DROP DATABASE IF EXISTS this_role_app;

CREATE DATABASE this_role_app;

USE this_role_app;

CREATE TABLE users(
	user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	user_fname VARCHAR(100),
	user_username VARCHAR(25) UNIQUE,
	user_avatar VARCHAR(200) DEFAULT '/assets/media/avatars/blank.png',
	user_email VARCHAR(100),
	user_pwd VARCHAR(200),
	user_rol ENUM('user', 'admin', 'master') DEFAULT "user",
	user_bday DATE DEFAULT NULL,
	user_confirmed DATETIME DEFAULT NULL,
	user_deleted DATETIME DEFAULT NULL
);

CREATE TABLE games(
	game_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	game_user_creator INT UNSIGNED,
	FOREIGN KEY(game_user_creator) REFERENCES users(user_id),
	game_title VARCHAR(50),
	game_icon VARCHAR(200),
	game_is_public TINYINT(1) DEFAULT 0,
	game_deleted DATETIME DEFAULT NULL
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
  issue_user INT UNSIGNED,
  issue_msg JSON,
  FOREIGN KEY(issue_user) REFERENCES users(user_id)
);

INSERT INTO users(user_fname, user_username, user_email, user_pwd, user_confirmed)
VALUES
	('Mario Sancho', 'mario', 'mail@mail.mail', '$2y$10$AGx4O3bw8QhdhatZxETiJuuUiR.sRLBx5zwxYu9.fwj6LipePLag2', NOW()),
	('Jose Luis El Bizco', 'joseluis.ak.elbizco', 'com@com.com', '$2y$10$AGx4O3bw8QhdhatZxETiJuuUiR.sRLBx5zwxYu9.fwj6LipePLag2', NOW()),
	('La Effy', 'effy', 'effy@mail.co', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('Fernando Fernandez', 'ff_98', 'ffmail@email.f', '$2y$10$AGx4O3bw8QhdhatZxETiJuuUiR.sRLBx5zwxYu9.fwj6LipePLag2', NOW());

UPDATE users SET user_rol='master' WHERE user_username='effy';