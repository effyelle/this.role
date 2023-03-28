drop database if exists this_roll;
create database this_roll;
use this_roll;

# ################### #
# Non heritage tables #
# ################### #
create table ability_score(
  id int unsigned primary key auto_increment,
  saving_throw varchar(15),
  slug char(3), key(slug)
);
create table skill(
  id int unsigned primary key auto_increment,
  ability_score char(3),
  name varchar(50),
  description varchar(200),
  foreign key(ability_score) references ability_score(slug)
);
create table class(
  id int unsigned primary key auto_increment,
  name varchar(25),
  hit_dice varchar(4),
  starting_equipment text,
  skills_profs_allowed tinyint default 0,
  classtable longtext,
  features longtext
);
create table multiclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  skills_profs_allowed tinyint default 0,
  foreign key(id_class) references class(id)
);
create table subclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  name varchar(50),
  description text,
  features longtext,
  foreign key(id_class) references class(id)
);
create table feat(
  id int unsigned primary key auto_increment,
  name varchar(50),
  prequisite varchar(50),
  features longtext
);
create table race(
  id int unsigned primary key auto_increment,
  name varchar(50),
  size varchar(15),
  languages varchar(50),
  speed varchar(50),
  lineage varchar(50),
  features longtext
);
create table background(
  id int unsigned primary key auto_increment,
  name varchar(50),
  equipment text,
  languages varchar(50),
  skill_profs_allowed tinyint default 0,
  features longtext
);
create table language(
  id int unsigned primary key auto_increment,
  name varchar(50),
  lang_type enum('standard', 'secret', 'rare', 'exotic', 'ethnic'),
  script varchar(50),
  description text
);
create table common_features(
  id int unsigned primary key auto_increment,
  title varchar(50),
  description text
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
  components varchar(50),
  duration varchar(25),
  school varchar(25),
  spell_range varchar(25)
);
create table bestiary(
  id int unsigned primary key auto_increment,
  id_reference int unsigned,
  CR tinyint default -1, -- Negative 1 will mean 'Unknown'
  creature_type varchar(25)
);
create table conditions(
  id int unsigned primary key auto_increment,
  id_reference int unsigned
);

########################
# Relationships tables #
########################
# Class
create table class_saving_throw(
  id_class int unsigned,
  id_saving_throw int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_saving_throw) references ability_score(id),
  primary key(id_class,id_saving_throw)
);
create table class_skill(
  id_class int unsigned,
  id_skill int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_skill) references skill(id),
  primary key(id_class,id_skill)
);
create table class_language(
  id_class int unsigned,
  id_language int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_language) references language(id),
  primary key(id_class,id_language)
);
create table class_prof_item(
  id_class int unsigned,
  id_item int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_item) references item(id),
  primary key(id_class,id_item)
);
create table class_startsw_item(
  id_class int unsigned,
  id_item int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_item) references item(id),
  primary key(id_class,id_item)
);
create table class_spell(
  id_class int unsigned,
  id_spell int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_spell) references spell(id),
  primary key(id_class,id_spell)
);
# Multiclass
create table multiclass_item(
  id_multiclass int unsigned,
  id_item int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_item) references item(id),
  primary key(id_multiclass,id_item)
);
create table multiclass_ability_score(
  id_multiclass int unsigned,
  id_ability_score int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_ability_score) references ability_score(id),
  primary key(id_multiclass,id_ability_score)
);
# Race
create table race_ability_score(
  id_race int unsigned,
  id_ability_score int unsigned,
  foreign key(id_race) references race(id),
  foreign key(id_ability_score) references ability_score(id),
  primary key(id_race,id_ability_score)
);
create table race_language(
  id_race int unsigned,
  id_language int unsigned,
  foreign key(id_race) references race(id),
  foreign key(id_language) references language(id),
  primary key(id_race,id_language)
);
# Background
create table background_skill(
  id_bg int unsigned,
  id_skill int unsigned,
  foreign key(id_bg) references background(id),
  foreign key(id_skill) references skill(id),
  primary key(id_bg,id_skill)
);
# Feats
create table feat_ability_score(
  id_feat int unsigned,
  id_ability_score int unsigned,
  foreign key(id_feat) references feat(id),
  foreign key(id_ability_score) references ability_score(id),
  primary key(id_feat,id_ability_score)
);
create table feat_spell(
  id_feat int unsigned,
  id_spell int unsigned,
  foreign key(id_feat) references feat(id),
  foreign key(id_spell) references spell(id),
  primary key(id_feat,id_spell)
);
# Common features
create table common_feature_class(
  id_feature int unsigned,
  id_class int unsigned,
  foreign key(id_feature) references common_features(id),
  foreign key(id_class) references class(id),
  primary key(id_feature,id_class)
);
create table common_feature_subclass(
  id_feature int unsigned,
  id_subclass int unsigned,
  foreign key(id_feature) references common_features(id),
  foreign key(id_subclass) references subclass(id),
  primary key(id_feature,id_subclass)
);
create table common_feature_feat(
  id_feature int unsigned,
  id_feat int unsigned,
  foreign key(id_feature) references common_features(id),
  foreign key(id_feat) references feat(id),
  primary key(id_feature,id_feat)
);
create table common_feature_race(
  id_feature int unsigned,
  id_race int unsigned,
  foreign key(id_feature) references common_features(id),
  foreign key(id_race) references race(id),
  primary key  (id_feature,id_race)
);
create table common_feature_background(
  id_feature int unsigned,
  id_bg int unsigned,
  foreign key(id_feature) references common_features(id),
  foreign key(id_bg) references background(id),
  primary key(id_feature,id_bg)
);

insert into ability_score(saving_throw, slug) 
values
  ('strength', 'str'),
  ('dexterity', 'dex'),
  ('constitution', 'con'),
  ('intelligence', 'int'),
  ('wisdom', 'wis'),
  ('charisma', 'char');
insert into skill(ability_score, name)
values
  ('DEX', 'acrobatics'),
  ('Wis', 'animal handling'),
  ('int', 'arcana'),
  ('STR', 'athletics'),
  ('char', 'deception'),
  ('int', 'history'),
  ('Wis', 'insight'),
  ('char', 'intimidation'),
  ('int', 'investigation'),
  ('Wis', 'medicine'),
  ('int', 'nature'),
  ('Wis', 'perception'),
  ('char', 'performance'),
  ('char', 'persuasion'),
  ('int', 'religion'),
  ('DEX', 'sleight of hand'),
  ('DEX', 'stealth'),
  ('Wis', 'survival');
  
insert into class(id, name, hit_dice, skills_profs_allowed)
values
  (1, "Artificer", "1d8", 2),
  (2, "Barbarian", "1d12", 2),
  (3, "Bard", "1d8", 3),
  (4, "Cleric", "1d8", 2),
  (5, "Druid", "1d8", 2),
  (6, "Fighter", "1d10", 2),
  (7, "Monk", "1d8", 2),
  (8, "Paladin", "1d10", 2),
  (9, "Ranger", "1d10", 3),
  (10, "Rogue", "1d8", 4),
  (11, "Sorcerer", "1d6", 2),
  (12, "Warlock", "1d8", 2),
  (13, "Wizard", "1d6", 2);

insert into multiclass(id, id_class, skills_profs_allowed)
values
  (1, 1, 0),
  (2, 2, 0),
  (3, 3, 1),
  (4, 4, 0),
  (5, 5, 0),
  (6, 5, 0),
  (7, 5, 0),
  (8, 5, 0),
  (9, 5, 1),
  (10, 5, 0),
  (11, 5, 0),
  (12, 5, 0),
  (13, 5, 0);

insert into subclass(id, id_class, name)
values
  (1, "Alchemist"),
  (1, "Artillerist"),
  (2, "Path of the Berserker"),
  (2, "Path of the Totem Warrior"),
  (3, "College of Creation"),
  (3, "College of Lore"),
  (4, "Peace Domain"),
  (4, "War Domain"),
  (5, "Circle of the Moon"),
  (5, "Circle of Stars"),
  (6, "Battle Master"),
  (6, "Champion"),
  (7, "Way of the Drunken Master"),
  (7, "Way of the Open Hand"),
  (8, "Oath of Devotion"),
  (8, "Oath of Redemption"),
  (9, "Beast Master Conclave"),
  (9, "Gloom Stalker Conclave"),
  (10, "Assassin"),
  (10, "Thief"),
  (11, "Lunar Sorcery"),
  (11, "Wild Magic"),
  (12, "The Archfey"),
  (12, "The Genie"),
  (13, "School of Conjuration"),
  (13, "School of Divination");

insert into feat(id, name, prequisite)
values
  (1, "Actor", null),
  (2, "Alert", null),
  (3, "Athlete", null),
  (4, "Charger", null),
  (5, "Crossbow Expert", null),
  (6, "Defensive Duelist", "DEX 13+"),
  (7, "Dual Wielder", null),
  (8, "", null),
  (9, "", null),
  (10, "", null),
  (11, "", null),
  (12, "", null),
  (13, "", null),
  (14, "", null),
  (15, "", null),
  (16, "", null),
  (17, "", null),
  (18, "", null),
  (19, "", null),
  (20, "", null),
  (21, "", null),
  (22, "", null),
  (23, "", null),
  (24, "", null),
  (25, "", null),
  (26, "", null),
  (27, "", null),
  (28, "", null),
  (29, "", null),
  (30, "", null),
  (31, "", null),
  (32, "", null),
  (33, "", null),
  (34, "", null),
  (35, "", null),
  (36, "", null),
  (37, "", null),
  (38, "", null),
  (39, "", null),
  (40, "", null),


-- race

insert into race(id, name, size, languages, speed, lineage) values
  (1, "Aarakocra", 'medium', 'You can speak, read, and write Common, Aarakocra, and Auran.', '25 feet, fly 50 feet', 'exotic'),
  (2, 'Aasimar', 'medium', 'You can speak, read, and write Common and Celestial.', '30 feet', 'exotic'),
  (3, 'Centaur', 'medium', 'You can speak, read, and write Common and Sylvan. Sylvan is widely spoken in the Selesnya Conclave, for it is rich in vocabulary to descriptionribe natural phenomena and spiritual forces.', '40 feet', 'monstrous'),
  (4, 'Changeling', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (5, 'Dragonborn', 'medium', 'You can speak, read, and write Common and Draconic. Draconic is thought to be one of the oldest languages and is often used in the study of magic. The language sounds harsh to most other creatures and includes numerous hard consonants and sibilants.', '30feet', 'standard'),
  (6, 'Drow', 'medium', 'You can speak, read, and write Common and Elvish or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'standard'),
  (7, 'Duergar', 'medium', 'You can speak, read, and write Common and Dwarvish or one other language that you and your DM agree is appropriate for your character.', '25 feet', 'exotic'),
  (8, 'Eladrin', 'medium', 'You can speak, read, and write Common and Elvish.', '30 feet', 'exotic'),
  (9, 'Fairy', 'small', 'You can speak, read, and write Common and Sylvan or one other language that you and your DM agree is appropriate for your character.', '30 feet, fly always equals to your walking speed', 'exotic'),
  (10, 'Firbolg', 'medium', 'You can speak, read, and write Common, Elvish, and Giant, or Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'standard'),
  (11, 'High Elf', 'medium', 'You can speak, read, and write Common and Elvish.', '30 feet', 'standard'),
  (12, 'Pallid Elf', 'medium', 'You can speak, read, and write Common and Elvish.', '30 feet', "explorer's guide to wildemount"),
  (13, 'Sea Elf', 'medium', 'You can speak, read, and write Common and Elvish.', '30 feet, swim 30 feet', 'exotic'),
  (14, 'Woof Elf', 'medium', 'You can speak, read, and write Common and Elvish.', '35 feet', 'standard'),
  (15, 'Hill Dwarf', 'medium', 'You can speak, read, and write Common and Dwarvish or one other language that you and your DM agree is appropriate for your character. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.', '25 feet', 'standard'),
  (16, 'Mountain Dwarf', 'medium', 'You can speak, read, and write Common and Dwarvish or one other language that you and your DM agree is appropriate for your character. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.', '25 feet', 'standard'),
  (17, 'Air Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '35 feet', 'exotic'),
  (18, 'Earth Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 feet', 'exotic'),
  (19, 'Fire Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 feet', 'exotic'),
  (20, 'Water Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 feet, swim always EQUALS to your walking speed', 'exotic'),
  (21, 'Deep Gnome', 'small', 'You can speak, read, and write Common, Gnomish or one other language that you and your DM agree is appropriate for your character, and Undercommon.', '25 feet', 'exotic'),
  (22, 'forest Gnome', 'small', 'You can speak, read, and write Common and Gnomish or one other language that you and your DM agree is appropriate for your character. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world.', '25 feet', 'standard'),
  (23, 'Rock Gnome', 'small', 'You can speak, read, and write Common and Gnomish or one other language that you and your DM agree is appropriate for your character. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world.', '25 feet', 'standard'),
  (24, 'Goblin', 'small', 'You can speak, read, and write Common and Goblin or one other language that you and your DM agree is appropriate for your character. Goblin is a simplistic language with a limited vocabulary and fluid features of grammar, unsuited for any sophisticated conversation.', '30 feet', 'monstrous'),
  (25, 'Goliath', 'medium', 'You can speak, read, and write Common and Giant or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (26, 'Hadozee', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet, climb equal to your walking speed', 'spelljammer'),
  (27, 'Half-Elf', 'medium', 'You can speak, read, and write Common, Elvish, and one extra language of your choice.', '30 feet', 'standard'),
  (28, 'Half-Orc', 'medium', 'You can speak, read, and write Common and Orc. Orc is a harsh, grating language with hard consonants. It has NO script of its own but is written in the Dwarvish script.', '30 feet', 'standard'),
  (29, 'Ghostwise Halfling', 'small', "You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.", '25 feet', 'standard'),
  (30, 'Lightfoot Halfling', 'small', "You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.", '25 feet', 'standard'),
  (31, 'Lotusden Halfling', 'small', "You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.", '25 feet', 'standard'),
  (32, 'Stout Halfling', 'small', "You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.", '25 feet', 'standard'),
  (33, 'Bugbear', 'medium', 'You can speak, read, and write Common and Goblin or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous'),
  (34, 'Githyanki', 'medium', 'You can speak, read, and write Common and Gith or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (35, 'Githzerai', 'medium', 'You can speak, read, and write Common and Gith or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (36, 'Grung', 'small', 'You can speak, read, and write Grung.', '25 feet', 'monstrous'),
  (37, 'Harengon', 'small', 'You can speak, read, and write Common and Sylvan or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (38, 'Hobgoblin', 'medium', 'You can speak, read, and write Common and Goblin.', '30 feet', 'monstrous'),
  (39, 'Human', 'small/medium', 'You can speak, read, and write Common and one extra language of your choice. Humans typically learn the languages of other peoples they deal with, including obscure dialects. They are fond of sprinkling their speech with words borrowed from other tongues: Orc curses, Elvish musical expressions, Dwarvish military phrases, and so on.', '30 feet', 'standard'),
  (40, 'Kenku', 'medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (41, 'Kobold', 'small', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous'),
  (42, 'Lizardfolg', 'medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet, swim equal to your walking speed', 'monstrous'),
  (43, 'Locathah', 'medium', 'You can speak, read, and write Aquan and Common.', '30 feet, and you have a swim speed of 30 feet.', 'exotic'),
  (44, 'Minotaur', 'medium', 'You can speak, read, and write Common and Minotaur.', '30 feet', 'monstrous'),
  (45, 'Orc', 'medium', 'You can speak, read, and write Common and Orc.', '30 feet', 'monstrous'),
  (46, 'Owlin', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character', '30 feet, fly equal to your walking speed', 'exotic'),
  (47, 'Satyr', 'medium', 'You can speak, read, and write Common and Sylvan.', '35 feet', 'exotic'),
  (48, 'Shadar-Kai', 'medium', 'You can speak, read, and write Common and Elvish or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (49, 'Beasthide Shifter', 'medium', 'You can speak, read, and write Common and Quori or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous'),
  (50, 'Longtooth Shifter', 'medium', 'You can speak, read, and write Common and Quori or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous'),
  (51, 'Swiftstride Shifter', 'medium', 'You can speak, read, and write Common and Quori or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous'),
  (52, 'Wildhunt Shifter', 'medium', 'You can speak, read, and write Common and Quori or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous'),
  (53, 'Tabaxi', 'medium', 'You can speak, read, and write Common and one other language of your choice.', '30 feet, climb 20 feet', 'exotic'),
  (54, 'Tiefling', 'medium', 'You can speak, read, and write Common and Infernal.', '30 feet', 'standard'),
  (55, 'Tortle', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (56, 'Triton', 'medium', 'You can speak, read, and write Common and Primordial.', '30 feet, swim 30 feet', 'exotic'),
  (57, 'Verdan', 'varies', 'You speak, read, and write Common, Goblin, and one additional language of your choice. This language typically has SOME CONNECTION to one of the areas or cultures that has been part of your life.', '30 feet', 'exotic'),
  (58, 'Yuan-Ti', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous');

-- background

-- language
-- rare is more special than exotic
insert into language(id, name, lang_type, script) values
  (1, 'aarakocra', null, null),
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
  (22, 'ergot', 'standard', 'common'), -- Northern Ergoth  (no race)
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
  (65, 'orc', 'standard', 'dwarvish'), -- Orcs
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
  (83, "thieves' cant", "secret", null), -- assassins, rogues
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
  (100, 'zemnian', null, null), -- the people of Zemniaz in the Age of Arcanum  (ancient culture)
  (101, 'aquan', 'exotic', 'primordial, common, dwarvish'),
  (102, 'auran', 'exotic', 'primordial, common, dwarvish'),
  (103, 'ignan', 'exotic', 'primordial, common, dwarvish'),
  (104, 'terran', 'exotic', 'primordial, common, dwarvish');

-- common_features

# Heritage

# Relationship tables

insert into class_saving_throw(id_class,id_saving_throw)
values
  (1, 3),  (1, 4),
  (2, 1),  (2, 3),
  (3, 2),  (3, 6),
  (4, 5),  (4, 6),
  (5, 4),  (5, 5),
  (6, 1),  (6, 3),
  (7, 1),  (7, 2),
  (8, 5),  (8, 6),
  (9, 1),  (9, 2),
  (10, 2),  (10, 4),
  (11, 3),  (11, 6),
  (12, 5),  (12, 6),
  (13, 4),  (13, 5);
  
insert into class_skill(id_class,id_skill)
values
  (1, 3),  (1, 6),  (1, 9),  (1, 10),  (1, 11),  (1, 12),  (1, 16),
  (2, 2),  (2, 4),  (2, 8),  (2, 11),  (2, 12),  (2, 18),
  (3, 1),  (3, 2),  (3, 3),  (3, 4),  (3, 5),  (3, 6),  (3, 7),  (3, 8),  (3, 9),  (3, 10),  (3, 11),  (3, 12),  (3, 13),  (3, 14),  (3, 15),  (3, 16),  (3, 17),  (3, 18),
  (4, 6),  (4, 7),  (4, 10),  (4, 14),  (4, 15),
  (5, 2),  (5, 3),  (5, 7),  (5, 10),  (5, 11),  (5, 12),  (5, 15),  (5, 18),
  (6, 1),  (6, 2),  (6, 4),  (6, 6),  (6, 7),  (6, 8),  (6, 12),  (6, 18),
  (7, 1),  (7, 4),  (7, 6),  (7, 7),  (7, 15),  (7, 17),
  (8, 4),  (8, 7),  (8, 8),  (8, 10),  (8, 14),  (8, 15),
  (9, 2),  (9, 4),  (9, 7),  (9, 9),  (9, 11),  (9, 12),  (9, 17),  (9, 18),
  (10, 1),  (10, 4),  (10, 5),  (10, 7),  (10, 8),  (10, 9),  (10, 12),  (10, 13),  (10, 14),  (10, 16),  (10, 17),
  (11, 3),  (11, 5),  (11, 7),  (11, 8),  (11, 14),  (11, 15),
  (12, 3),  (12, 5),  (12, 6),  (12, 8),  (12, 9),  (12, 11),  (12, 15),
  (13, 3),  (13, 6),  (13, 7),  (13, 9),  (13, 10),  (13, 15);

-- class_prof_item, class_startsw_item and class_spell -> when spell and items are added

insert into race_language(id_race, id_language)
values
  (1,11),  (1,1),  (1,102),
  (2,11),  (2,8),
  (3,11),  (3,81), -- sylvan
  (4,11),  (4,80),
  (5,11),  (5,18),
  (6,11),  (6,21),
  (7,11),  (7,20),  (7,91),
  (8,11),  (8,21),
  (9,11),  (9,81),
  (10,11),  (10,21),  (10,23),
  (11,11),  (11,21), -- elvish
  (12,11),  (12,21),
  (13,11),  (13,21),
  (14,11),  (14,21),
  (15,11),  (15,20), -- dwarven
  (16,11),  (16,20),
  (17,11),  (17,68), -- primordial
  (18,11),  (18,68),
  (19,11),  (19,68),
  (20,11),  (20,68),
  (21,11),  (21,29), -- gnomish
  (22,11),  (22,29),
  (23,11),  (23,29),
  (24,11),  (24,31), -- goblin comun
  (25,11),  (25,23), -- giant
  (26,11), -- estos son los monos
  (27,11),  (27,21),
  (28,11),  (28,65), -- standard Orc
  (29,11),  (29,35), -- halfling
  (30,11),  (30,35),
  (31,11),  (31,35),
  (32,11),  (32,35),
  (33,11),  (33,31),
  (34,11),  (34,27),
  (35,11),  (35,27),
  (36,33),
  (37,11),  (37,81),
  (38,11),  (28,31),
  (39,11), -- !IMPorTANT #### -- Rest of human ethnic languages
  (40,11),  (41,11),  (42,11),
  (43,11),  (43,101),
  (44,11),  (44,55),
  (45,11),  (45,65),
  (46,11),  (47,11),  (47,81),
  (48,11),  (48,21),
  (49,11),  (50,11),  (51,11),  (52,11),
  (49,70),  (50,70),  (51,70),  (52,70),
  (53,11),  (54,11),  (54,40),
  (55,11),  (56,11),  (56,68),
  (57,11),  (57,31),  (58,11);

select count(*) as total_number_of_tables
FROM information_schema.tables
where TABLE_SCHEMA = 'this_roll';