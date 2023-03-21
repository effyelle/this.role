drop database if exists this_roll;

create database this_roll;

# ################### #
# Non heritage tables #
# ################### #

create table class(
  id int unsigned primary key auto_increment,
  hit_dice varchar(4),
  hit_points varchar(20),
  hit_points_heigher_levels varchar(40),
  starting_equipment text,
  skills_profs_allowed tinyint default -1 -- negative 1 means no skill profs are allowed
);
create table classtable_property(
  id int unsigned primary key auto_increment,
  name varchar(50)
);
create table classtable_detail(
  id int unsigned primary key auto_increment,
  id_classtable_property int unsigned,
  details varchar(50),
  level tinyint,
  foreign key(id_classtable_property) references classtable_propoerty(id)
);
create table multiclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  ability_score_minimum tinyint unsigned,
  skills_profs_allowed tinyint default -1,
  foreign key(id_class) references class(id)
);
create table ability_score(
  id int unsigned primary key auto_increment,
  saving_throw varchar(15)
);
create table skill(
  id int unsigned primary key auto_increment,
  id_ability_score int unsigned,
  name varchar(50),
  foreign key(id_ability_score) references ability_score(id)
);
create table feat(
  id int unsigned primary key auto_increment,
  description longtext,
  ability_score_allowed tinyint default -1,
  name varchar(50),
  prequisite varchar(50)
);
create table race(
  id int unsigned primary key auto_increment,
  size varchar(15),
  languages varchar(50),
  speed varchar(50)
);
create table background(
  id int unsigned primary key auto_increment,
  name varchar(50),
  languages_choice varchar(50),
  equipment text,
  skill_profs_allowed tinyint default -1
);
create table rule(
  id int unsigned primary key auto_increment,
  title varchar(50),
  description text,
  origin varchar(15)
); # origin means if it's class origin, race, background...

# ############### #
# Heritage father #
# ############### #
create table reference(
  id int unsigned primary key auto_increment,
  name varchar(50),
  description text
);
# Heritage children #
create table item(
  id int unsigned primary key auto_increment,
  id_reference int unsiged,
  type varchar(25),
  cost varchar(15),
  weight varchar(15),
  foreign key(id_reference) references reference(id)
);
create table action(
  id int unsigned primary key auto_increment,
  id_reference int unsiged,
  time varchar(25),
  foreign key(id_reference) references reference(id)
);
create table language(
  id int unsigned primary key auto_increment,
  id_reference int unsiged,
  type varchar(25),
  script varchar(25),
  foreign key(id_reference) references reference(id)
);
create table spell(
  id int unsigned primary key auto_increment,
  id_reference int unsiged,
  level tinyint,
  time varchar(15),
  duration varchar(25),
  school varchar(25),
  range varchar(25),
  components varchar(50),
  foreign key(id_reference) references reference(id)
);
create table bestiary(
  id int unsigned primary key auto_increment,
  id_reference int unsiged,
  CR tinyint default -1, # Negative 1 will mean 'Unknown'
  type varchar(25),
  foreign key(id_reference) references reference(id)
);
create table condition(
  id int unsigned primary key auto_increment,
  id_reference int unsiged,
  foreign key(id_reference) references reference(id)
);

########################
# Relationships tables #
########################
create table class_classtable(
  id_class int unsigned,
  id_classtable int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_classtable) references classtable_property(id)
);
create table class_saving_throw(
  id_class int unsigned,
  id_saving_throw int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_saving_throw) references ability_score(id)
);
create table multiclass_saving_throw(
  id_multiclass int unsigned,
  id_saving_throw int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_saving_throw) references ability_score(id)
);
create table class_skill(
  id_class int unsigned,
  id_skill int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_skill) references skill(id)
);
create table multiclass_skill(
  id_multiclass int unsigned,
  id_skill int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_skill) references skill(id)
);
create table class_item(
  id_class int unsigned,
  id_item int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_item) references item(id)
);
create table multiclass_item(
  id_multiclass int unsigned,
  id_item int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_item) references item(id)
);
create table class_language(
  id_class int unsigned,
  id_language int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_language) references language(id)
);
create table multiclass_language(
  id_multiclass int unsigned,
  id_language int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_language) references language(id)
);
create table class_spell(
  id_class int unsigned,
  id_spell int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_spell) references spell(id)
);
create table class_feat(
  id_class int unsigned,
  id_feat int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_feat) references feat(id)
);
create table class_rule(
  id_class int unsigned,
  id_rule int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_rule) references rule(id)
);
create table race_ability_score(
  id_race int unsigned,
  id_ability_score int unsigned,
  foreign key(id_race) references race(id),
  foreign key(id_ability_score) references ability_score(id)  
);
create table race_language(
  id_race int unsigned,
  id_language int unsigned,
  foreign key(id_race) references race(id),
  foreign key(id_language) references language(id)
);
create table race_rule(
  id_race int unsigned,
  id_rule int unsigned,
  foreign key(id_race) references race(id),
  foreign key(id_rule) references rule(id)
);
create table bg_rule(
  id_bg int unsigned,
  id_rule int unsigned,
  foreign key(id_bg) references background(id),
  foreign key(id_rule) references rule(id)
);
create table bg_skill(
  id_bg int unsigned,
  id_skill int unsigned,
  foreign key(id_bg) references background(id),
  foreign key(id_skill) references skill(id)
);
create table reference_rule(
  id_reference int unsigned,
  id_rule int unsigned,
  foreign key(id_reference) references reference(id),
  foreign key(id_rule) references rule(id)
);
create table feat_ability_score(
  id_feat int unsigned,
  id_ability_score int unsigned,
  foreign key(id_feat) references feat(id),
  foreign key(id_ability_score) references rule(id)
);