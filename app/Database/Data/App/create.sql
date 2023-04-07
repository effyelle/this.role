this_role_appDROP DATABASE IF EXISTS this_role_app;

CREATE DATABASE this_role_app;

USE this_role_app;

CREATE TABLE users(
	user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	user_fname VARCHAR(100),
	user_username VARCHAR(25) UNIQUE,
	user_avatar VARCHAR(200),
	user_email VARCHAR(100),
	user_pwd VARCHAR(200),
	user_confirmed_acc DATETIME DEFAULT NULL,
	user_deleted DATETIME DEFAULT NULL
);

CREATE TABLE permissions(
	permission_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	permission_rol VARCHAR(25) UNIQUE
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
	url VARCHAR(200),
	url_expires DATETIME DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
	id_game INT UNSIGNED,
	FOREIGN KEY(id_game) REFERENCES games(game_id)
);

CREATE TABLE user_permission(
	id_user INT UNSIGNED,
	id_permission INT UNSIGNED,
	FOREIGN KEY(id_user) REFERENCES users(user_id),
	FOREIGN KEY(id_permission) REFERENCES permissions(permission_id),
	PRIMARY KEY(id_user, id_permission)
);

INSERT INTO users(user_fname, user_username, user_email, user_pwd, user_confirmed_acc)
VALUES
	('Mario Sancho', 'escrotocolgante', 'mail@mail.mail', 

INSERT INTO permissions(permission_rol)
VALUES ('admin'), ('master');

