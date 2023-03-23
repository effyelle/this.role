drop database if exists this_roll;

create database this_roll;

USE this_roll;

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
  foreign key(id_classtable_property) references classtable_property(id)
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
  saving_throw varchar(15),
  slug char(3)
);
create table skill(
  id int unsigned primary key auto_increment,
  id_ability int unsigned,
  name varchar(50),
  foreign key(id_ability) references ability_score(id)
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
  id_reference int unsigned,
  item_type varchar(25),
  cost varchar(15),
  weight varchar(15),
  foreign key(id_reference) references reference(id)
);
create table action(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  action_time varchar(25),
  foreign key(id_reference) references reference(id)
);
create table language(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  lang_type varchar(25),
  script varchar(25),
  foreign key(id_reference) references reference(id)
);
create table spell(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  spell_level tinyint,
  spell_time varchar(15),
  duration varchar(25),
  school varchar(25),
  spell_range varchar(25),
  components varchar(50),
  foreign key(id_reference) references reference(id)
);
create table bestiary(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  CR tinyint default -1, # Negative 1 will mean 'Unknown'
  creature_type varchar(25),
  foreign key(id_reference) references reference(id)
);
create table conditions(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  foreign key(id_reference) references reference(id)
);

########################
# Relationships tables #
########################
create table class_classtable(
  id_class int unsigned,
  id_classtable int unsigned,
  primary key(id_class, id_classtable)
);
create table class_saving_throw(
  id_class int unsigned,
  id_saving_throw int unsigned,
  primary key(id_class, id_saving_throw)
);
create table multiclass_saving_throw(
  id_multiclass int unsigned,
  id_saving_throw int unsigned,
  primary key(id_multiclass, id_saving_throw)
);
create table class_skill(
  id_class int unsigned,
  id_skill int unsigned,
  primary key(id_class, id_skill)
);
create table multiclass_skill(
  id_multiclass int unsigned,
  id_skill int unsigned,
  primary key(id_multiclass, id_skill)
);
create table class_item(
  id_class int unsigned,
  id_item int unsigned,
  primary key(id_class, id_item)
);
create table multiclass_item(
  id_multiclass int unsigned,
  id_item int unsigned,
  primary key(id_multiclass, id_item)
);
create table class_language(
  id_class int unsigned,
  id_language int unsigned,
  primary key(id_class, id_language)
);
create table multiclass_language(
  id_multiclass int unsigned,
  id_language int unsigned,
  primary key(id_multiclass, id_language)
);
create table class_spell(
  id_class int unsigned,
  id_spell int unsigned,
  primary key(id_class, id_spell)
);
create table class_feat(
  id_class int unsigned,
  id_feat int unsigned,
  primary key(id_class, id_feat)
);
create table class_rule(
  id_class int unsigned,
  id_rule int unsigned,
  primary key(id_class, id_rule)
);
create table race_ability_score(
  id_race int unsigned,
  id_ability_score int unsigned,
  primary key(id_race, id_ability_score)
);
create table race_language(
  id_race int unsigned,
  id_language int unsigned,
  primary key(id_race, id_language)
);
create table race_rule(
  id_race int unsigned,
  id_rule int unsigned,
  primary key(id_race, id_rule)
);
create table bg_rule(
  id_bg int unsigned,
  id_rule int unsigned,
  primary key(id_bg, id_rule)
);
create table bg_skill(
  id_bg int unsigned,
  id_skill int unsigned,
  primary key(id_bg, id_skill)
);
create table reference_rule(
  id_reference int unsigned,
  id_rule int unsigned,
  primary key(id_reference, id_rule)
);
create table feat_ability_score(
  id_feat int unsigned,
  id_ability_score int unsigned,
  primary key(id_feat, id_ability_score)
);

-- Current tables:
SELECT COUNT(*) AS total_number_of_tables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'this_roll';