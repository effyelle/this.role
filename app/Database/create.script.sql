drop database if exists this_roll;

create database this_roll;

use this_roll;

/*
 * DB creation
 */

-- Single id tables --

create table player(
  id int unsigned primary key auto_increment,
  username varchar(30) unique,
  publicname varchar(30) not null,
  avatar varchar(40),
  email varchar(50) not null,
  passwd varchar(15) not null,
  key(username)
);

create table deleted_player(
  id int unsigned primary key auto_increment,
  username varchar(30) unique,
  publicname varchar(30) not null,
  avatar varchar(40),
  email varchar(50) not null,
  passwd varchar(15) not null,
  key(username)
);

create table permission(
  id int unsigned primary key auto_increment,
  permission varchar(15)
);

create table game(
  id int unsigned primary key auto_increment
);

create table deleted_game(
  id int unsigned primary key auto_increment
);

create table sheet(
  id int unsigned primary key auto_increment,
  id_game int unsigned,
  foreign key(id_game) references game(id)
);

create table ability(
  id int unsigned primary key auto_increment,
  macro varchar(100)
);

-- Multiple id relationship tables -

create table player_permission(
  id_player int unsigned,
  foreign key(id_player) references player(id),
  id_permission int unsigned,
  foreign key(id_permission) references permission(id),
  primary key(id_player, id_permission)
);

create table player_game(
  id_player int unsigned,
  foreign key(id_player) references player(id),
  id_game int unsigned,
  foreign key(id_game) references game(id),
  primary key(id_player, id_game)
);


/*
 * Data inserts
 */

insert into permission (permission)
values ('admin'), ('premium'), ('basic');