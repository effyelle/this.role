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
	game_layer_selected INT DEFAULT -1,
	game_folder VARCHAR(200),
	game_deleted DATETIME DEFAULT NULL,
	FOREIGN KEY(game_creator) REFERENCES users(user_id)
);

CREATE TABLE game_player(
	game_player_id_user INT UNSIGNED,
	game_player_id_game INT UNSIGNED,
	game_display_username VARCHAR(50),
	FOREIGN KEY(game_player_id_user) REFERENCES users(user_id),
	FOREIGN KEY(game_player_id_game) REFERENCES games(game_id)
);

CREATE TABLE game_chat(
	chat_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	chat_game_id INT UNSIGNED,
	chat_sender VARCHAR(50),
	chat_msg LONGTEXT,
	chat_icon VARCHAR(100),
	chat_msg_type VARCHAR(50),
	chat_datetime DATETIME DEFAULT NOW(),
	FOREIGN KEY(chat_game_id) REFERENCES games(game_id)
);

CREATE TABLE game_journal(
	item_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	item_id_game INT UNSIGNED,
	item_icon VARCHAR(100),
	item_name VARCHAR(50),
	item_type VARCHAR(20),
	item_viewers JSON DEFAULT '[]', -- ID users
	item_editors JSON DEFAULT '[]', -- ID users
	info JSON,
	xp INT,
	ability_scores JSON,
	skill_proficiencies JSON,
	health JSON,
	attacks LONGTEXT,
	global_modifiers LONGTEXT,
	bag LONGTEXT,
	custom_features LONGTEXT,
	notes LONGTEXT,
	backstory LONGTEXT
);

CREATE TABLE game_layers(
	layer_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	layer_name VARCHAR(50),
	layer_id_game INT UNSIGNED,
	layer_bg TEXT,
	layer_tokens JSON DEFAULT '[]',
	FOREIGN KEY (layer_id_game) REFERENCES games(game_id)
);

CREATE TABLE invite_url(
	url VARCHAR(200) PRIMARY KEY,
	id_game INT UNSIGNED,
	url_expires DATETIME DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
	FOREIGN KEY(id_game) REFERENCES games(game_id)
);

INSERT INTO users(user_username, user_avatar, user_fname, user_email, user_pwd, user_confirmed)
VALUES
	('effs', '/assets/media/avatars/blank.png', 'Effy', 'ericapastorgracia@gmail.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('marioe23', '/assets/media/avatars/blank.png', 'Mario Sancho', 'nore.zgz@mail.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('si-si-si-simba', '/assets/media/avatars/blank.png', 'Simba Villano', 'simba@villano.com', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('FF15', '/assets/media/avatars/blank.png', 'Fernando Fernandez', 'ffmail@email.f', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW()),
	('el.pepi.7', '/assets/media/avatars/blank.png', 'Pepito Grillo 21', 'pepi.grillo.7@mail.es', '$2y$10$dyfwQ78Udrf23ZtJ2eq5BuiVtP1NuzqDPcXTbXr.7t65PKFTEJ1eC', NOW());

UPDATE users SET user_rol='masteradmin' WHERE user_email='ericapastorgracia@gmail.com';
UPDATE users SET user_rol='admin' WHERE user_email='nore.zgz@mail.com';