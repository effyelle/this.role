drop database if exists this_roll;

create database this_roll;

USE this_roll;

# ################### #
# Non heritage tables #
# ################### #

create table class(
  id int unsigned primary key auto_increment,
  classname varchar(25),
  hit_dice varchar(4),
  hit_points varchar(20),
  hit_points_heigher_levels varchar(40),
  starting_equipment text,
  skills_profs_allowed tinyint default -1 -- negative 1 means no skill profs are allowed
);
create table subclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  subclassname varchar(50),
  description text
);
create table classtable_property(
  id int unsigned primary key auto_increment,
  name varchar(50)
);
create table classtable_detail(
  id int unsigned primary key auto_increment,
  id_classtable_property int unsigned,
  details varchar(50),
  level tinyint
);
create table multiclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  ability_score_minimum tinyint unsigned,
  skills_profs_allowed tinyint default -1
);
create table ability_score(
  id int unsigned primary key auto_increment,
  saving_throw varchar(15),
  slug char(3)
);
create table skill(
  id int unsigned primary key auto_increment,
  id_ability int unsigned, -- ability_score(slug)
  name varchar(50)
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
  origin varchar(15) # origin means if it's class origin, race, background...
);
create table language(
  id int unsigned primary key auto_increment,
  name varchar(25),
  lang_type enum('standard', 'secret', 'rare', 'exotic', 'ethnic') default null,
  script varchar(25) default 'unknown'
);

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
  weight varchar(15)
);
create table action(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  action_time varchar(25)
);
create table spell(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  spell_level tinyint,
  spell_time varchar(15),
  duration varchar(25),
  school varchar(25),
  spell_range varchar(25),
  components varchar(50)
);
create table bestiary(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  CR tinyint default -1, # Negative 1 will mean 'Unknown'
  creature_type varchar(25)
);
create table conditions(
  id int unsigned primary key auto_increment,
  id_reference int unsigned
);

########################
# Relationships tables #
########################
create table class_classtable(
  id_class int unsigned,
  id_classtable int unsigned
);
create table class_saving_throw(
  id_class int unsigned,
  id_saving_throw int unsigned
);
create table multiclass_saving_throw(
  id_multiclass int unsigned,
  id_saving_throw int unsigned
);
create table class_skill(
  id_class int unsigned,
  id_skill int unsigned
);
create table multiclass_skill(
  id_multiclass int unsigned,
  id_skill int unsigned
);
create table class_item(
  id_class int unsigned,
  id_item int unsigned
);
create table multiclass_item(
  id_multiclass int unsigned,
  id_item int unsigned
);
create table class_language(
  id_class int unsigned,
  id_language int unsigned
);
create table multiclass_language(
  id_multiclass int unsigned,
  id_language int unsigned
);
create table class_spell(
  id_class int unsigned,
  id_spell int unsigned
);
create table subclass_spell(
  id_subclass int unsigned,
  id_spell int unsigned
);
create table class_feat(
  id_class int unsigned,
  id_feat int unsigned
);
create table class_rule(
  id_class int unsigned,
  id_rule int unsigned
);
create table subclass_rule(
  id_subclass int unsigned,
  id_rule int unsigned
);
create table race_ability_score(
  id_race int unsigned,
  id_ability_score int unsigned
);
create table race_language(
  id_race int unsigned,
  id_language int unsigned
);
create table race_rule(
  id_race int unsigned,
  id_rule int unsigned
);
create table bg_rule(
  id_bg int unsigned,
  id_rule int unsigned
);
create table bg_skill(
  id_bg int unsigned,
  id_skill int unsigned
);
create table reference_rule(
  id_reference int unsigned,
  id_rule int unsigned
);
create table feat_ability_score(
  id_feat int unsigned,
  id_ability_score int UNSIGNED
);

SELECT COUNT(*) AS total_number_of_tables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'this_roll';

insert into ability_score(saving_throw, slug)
values
  ('strength', 'str'),
  ('dexterity', 'dex'),
  ('constitution', 'con'),
  ('intelligence', 'int'),
  ('wisdom', 'wis'),
  ('charisma', 'char');

insert into skill(id_ability, name)
values
  (2, 'acrobatics'),
  (5, 'animal handling'),
  (4, 'arcana'),
  (1, 'athletics'),
  (6, 'deception'),
  (4, 'history'),
  (5, 'insight'),
  (6, 'intimidation'),
  (4, 'investigation'),
  (5, 'medicine'),
  (4, 'nature'),
  (5, 'perception'),
  (6, 'performance'),
  (6, 'persuasion'),
  (4, 'religion'),
  (2, 'sleight of hand'),
  (2, 'stealth'),
  (5, 'survival');


-- rare is more special than exotic

insert into language(id, name, lang_type, script)
values
  (1, 'aarakocra', null, NULL),
  (2, 'abanasinian', 'standard', 'common'),
  (3, 'abyssal', 'standard', 'infernal'),
  (4, 'alzhedo', 'ethnic', 'thorass'),
  (5, 'blink dog', null, null),
  (6, 'bothii', null, null),
  (7, 'bullywug', null, null),
  (8, 'celestial', 'exotic', 'celestial'),
  (9, 'chessentan', 'ethnic', 'thorass'),
  (10, 'chondathan', 'ethnic', 'thorass'),
  (11, 'common', 'standard', 'common'),
  (12, 'daelkyr', 'exotic', 'daelkyr'),
  (13, 'damaran', 'ethnic', 'dethek'),
  (14, 'dambrathan', 'ethnic', 'espruar'),
  (15, 'deep crow', null, null),
  (16, 'deep speech', 'exotic', 'none'),
  (17, 'draconic', 'rare', 'draconic'), -- only dragons
  (18, 'draconic', 'exotic', 'draconic'), -- dragons & dragonborns
  (19, 'druidic', 'secret', null), -- druids, treants
  (20, 'dwarvish', 'standard', 'dwarvish'), -- dwarves
  (21, 'elvish', 'standard', 'elvish'), -- elves
  (22, 'ergot', 'standard', 'common'), -- Northern Ergoth (no race)
  (23, 'giant', 'standard', 'giant, dwarvish'), -- ogres, giants, cyclopes
  (24, 'giant eagle', null, null),
  (25, 'giant elf', null, null),
  (26, 'giant owl', null, null),
  (27, 'gith', null, "tir'su"), -- githzerai monks, githyanki warriors, githzerai zerths, githyanki knights
  (28, 'gnoll', null, null), -- gnolls, gnoll pack lords, gnoll fangs of yeenoghu
  (29, 'gnomish', 'standard', 'common, dwarvish'), -- gnomes
  (30, 'goblin', 'rare', 'dwarvish'), -- Zone of Taman Busuk
  (31, 'goblin', 'standard', 'goblin, common, dwarvish'), -- goblins,  goblinoids, monsters of Khorvaire
  (32, 'grell', null, null), -- grells
  (33, 'grung', null, null), -- grungs, grung wildlings, grung elite warriors
  (34, 'guran', 'ethnic', 'thorass'), -- humans
  (35, 'halfling', 'standard', 'common'), -- halflings
  (36, 'halruaan', 'ethnic', 'draconic'), -- humans
  (37, 'hook horror', null, null), -- hook horrors
  (38, 'ice toad', null, null), -- ice toads
  (39, 'illuskan', 'ethnic', 'thorass'), -- humans
  (40, 'infernal', 'exotic', 'infernal'), -- fiends, devils
  (41, 'istarian', 'rare', 'istarian'), -- ancient istarians
  (42, 'ixitxachitl', null, null), --  ixitxachitl, ixitxachitl clerics, vampiric ixitxachitl, vampiric ixitxachitl clerics
  (43, 'kenderspeak', 'standard', 'common'),
  (44, 'kharolian', 'standard', 'common'),
  (45, 'khur', 'standard', 'istarian'),
  (46, 'kothian', 'rare', 'kothian'), -- minotaurs
  (47, 'kraul', 'standard', 'kraul'), -- kraul, kraul warriors, kraul death priests, devkarin liches
  (48, 'kruthik', null, null), -- young kruthiks, adult kruthiks, kruthik hive lords
  (49, 'leonin', null, 'common'),
  (50, 'loross', null, 'draconic'), -- spoken by the Netherese, deadtongue
  (51, 'loxodon', 'standard', 'elvish'), -- loxodons
  (52, 'marquesian', null, null), -- pirates
  (53, 'merfolk', 'standard', 'merfolk'), -- merfolk
  (54, 'midani', 'ethnic', 'thorass'),
  (55, 'minotaur', 'standard', 'minotaur'), -- minotaurs
  (56, 'modron', null, null), -- monodrones, duodrones, tridrones, quadrones, pentadrones
  (57, 'mulhorandi', 'ethnic', 'tohrass'),
  (58, 'naush', null, null), -- sailors
  (59, 'nerakese', 'rare', 'istarian'),
  (60, 'netherese', null, 'draconic'),
  (61, 'nordmaarian', 'standard', 'istarian'),
  (62, 'ogre', 'rare', 'ogre'), -- ogres? it only says zones
  (63, 'olman', null, null),
  (64, 'orc', 'exotic', 'goblin'), -- isolated orc tribes
  (65, 'orc', 'standard', 'dwarvish'), -- orcs
  (66, 'otyugh', null, null), -- otyughs
  (67, 'primordial', 'rare', 'primordial'), -- elementals
  (68, 'primordial', 'exotic', 'common, dwarvish'), -- tritons, genasi
  (69, 'qualith', null, 'qualith'), -- mind flayers
  (70, 'quori', 'exotic', 'quori'), -- inspired, kalashtar, quori
  (71, 'rashemi', 'ethnic', 'thorass'), -- humans
  (72, 'riedran', 'standard', 'common'),
  (73, 'roushoum', 'ethnic', 'thorass'),
  (74, 'sahuagin', null, null), -- sahuagin, sahuagin priestesses, sahuagin barons
  (75, 'shaaran', 'ethnic', 'dethek'), -- humans
  (76, 'shou', 'ethnic', 'thorass'), -- humans
  (77, 'slaad', null, null), -- slaad tadpoles, red slaads, blue slaads, green slaads, gray slaads, death slaads
  (78, 'solamnic', 'standard', 'common'),
  (79, 'sphinx', 'standard', 'none'), -- sphinxes, gynosphinxes, androsphinxes
  (80, 'sylvan', 'rare', 'sylvan'), -- fey creatures, centaurs, satyrs, dryads
  (81, 'sylvan', 'exotic', 'elvish'), -- fey creatures see above
  (82, 'thayan', 'ethnic', 'thorass'), -- humans
  (83, "thieves' cant", 'secret', null), -- assassins, rogues
  (84, 'thri-kreen', null, null), -- thri-kreen
  (85, 'tlincalli', null, null), -- tlincalli
  (86, 'troglodytes', null, null), -- troglodytes
  (87, 'tuigan', 'ethnic', 'thorass'), -- humans
  (88, 'turmic', 'ethnic', 'thorass'), -- humans
  (89, 'uluik', 'ethnic', 'thorass'), -- humans
  (90, 'umber hulk', null, null), -- umber hulks
  (91, 'undercommon', 'exotic', 'elvish'), -- underdark traders
  (92, 'untheric', 'ethnic', 'thorass'), -- humans
  (93, 'vedalken', 'standard', 'vedalken'), -- vedalken
  (94, 'vegepygmy', null, null), -- vegepygmies, vegepygmy chiefs
  (95, 'waelan', 'ethnic', 'thorass'), -- humans
  (96, 'winter wolf', null, null), -- winter wolves
  (97, 'worg', null, null), -- worgs
  (98, 'yeti', null, null), -- yetis, abominable yetis
  (99, 'yikaria', null, null), -- yakfolk priests, yakfolk warriors
  (100, 'zemnian', null, null); -- the people of Zemniaz in the Age of Arcanum (ancient culture)