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
	user_rol ENUM('user', 'admin', 'masteradmin') DEFAULT "user",
	user_bday DATE DEFAULT NULL,
	user_confirmed DATETIME DEFAULT NULL,
	user_deleted DATETIME DEFAULT NULL
);

CREATE TABLE tokens(
	token VARCHAR(100) PRIMARY KEY,
	token_user VARCHAR(100),
	token_expires DATETIME DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY)
);

CREATE TABLE issues(
  issue_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  issue_user VARCHAR(20),
  issue_title VARCHAR(50),
  issue_type ENUM('suggestion', 'congratulation', 'complaint', 'help'),
  issue_msg JSON
);

CREATE TABLE games(
	game_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	game_creator INT UNSIGNED,
	game_title VARCHAR(50),
	game_details LONGTEXT,
	game_icon VARCHAR(200),
	game_folder VARCHAR(200),
	game_gallery JSON,
	game_deleted DATETIME DEFAULT NULL,
	FOREIGN KEY(game_creator) REFERENCES users(user_id)
);

CREATE TABLE game_player(
	game_player_id_user INT UNSIGNED,
	game_player_id_game INT UNSIGNED,
	FOREIGN KEY(game_player_id_user) REFERENCES users(user_id),
	FOREIGN KEY(game_player_id_game) REFERENCES games(game_id)
);

CREATE TABLE game_chat(
	chat_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	chat_game_id INT UNSIGNED,
	chat_sender VARCHAR(50),
	chat_msg VARCHAR(500),
	chat_msg_type VARCHAR(50),
	chat_datetime DATETIME DEFAULT NOW(),
	FOREIGN KEY(chat_game_id) REFERENCES games(game_id)
);

CREATE TABLE game_journal(
	item_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	item_game_id INT UNSIGNED,
	item_icon VARCHAR(100),
	item_title VARCHAR(50),
	item_type VARCHAR(20),
	item_details JSON,
	item_viewers JSON, -- ID users
	item_editors JSON, -- ID users
	FOREIGN KEY(item_game_id) REFERENCES games(game_id)
);

CREATE TABLE invite_url(
	url VARCHAR(200) PRIMARY KEY,
	id_game INT UNSIGNED,
	url_expires DATETIME DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
	FOREIGN KEY(id_game) REFERENCES games(game_id)
);

INSERT INTO users(user_username, user_fname, user_email, user_pwd, user_confirmed)
VALUES
	('effs', 'La Effy', 'epastor@gmail.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('marioe23', 'Mario Sancho', 'nore.zgz@mail.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('JL.ak.elBizco', 'Jose Luis El Bizco', 'com@com.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('FF15', 'Fernando Fernandez', 'ffmail@email.f', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW());

INSERT INTO games(game_creator, game_title, game_folder, game_icon)
VALUES
	(1, 'Timeless', '/assets/media/games/1682422516/', '/assets/media/games/1682422516/game_icon.jpg');

INSERT INTO game_player(game_player_id_game, game_player_id_user)
VALUES (1,1);

UPDATE users SET user_rol='masteradmin' WHERE user_email='epastor@gmail.com';
UPDATE users SET user_rol='admin' WHERE user_email='nore.zgz@mail.com';

UPDATE users SET user_confirmed=NULL WHERE user_username='effy.elle';