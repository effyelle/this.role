DROP DATABASE IF EXISTS this_role_app;

CREATE DATABASE this_role_app;

USE this_role_app;

CREATE TABLE user(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	fname VARCHAR(100),
	username VARCHAR(25) UNIQUE,
	prof_pic VARCHAR(200),
	email VARCHAR(100),
	pwd VARCHAR(100)
);

CREATE TABLE permissions(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	rol VARCHAR(25) UNIQUE
);

CREATE TABLE user_permission(
	id_user INT UNSIGNED,
	id_permission INT UNSIGNED,
	FOREIGN KEY(id_user) REFERENCES user(id),
	FOREIGN KEY(id_permission) REFERENCES permissions(id),
	PRIMARY KEY(id_user, id_permission)
);

INSERT INTO permissions(rol)
VALUES ('admin'), ('master'), ('user');

INSERT INTO user_permission(id_user, id_permission)
VALUES (1, 1), (1, 2), (1, 3);