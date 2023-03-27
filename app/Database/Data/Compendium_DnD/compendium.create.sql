drop database if exists this_roll;

create database this_roll;

USE this_roll;

# ################### #
# Non heritage tables #
# ################### #
create table ability_score(
  id int unsigned primary key auto_increment,
  saving_throw varchar(15),
  slug char(3),
  secondary key(slug)
);
create table skill(
  id int unsigned primary key auto_increment,
  ability_score char(3),
  name varchar(50),
  foreign key(ability_score) references ability_score(slug)
);
create table class(
  id int unsigned primary key auto_increment,
  name varchar(25),
  hit_dice varchar(4),
  hit_points varchar(20),
  hit_points_heigher_levels varchar(40),
  starting_equipment text,
  skills_profs_allowed tinyint default 0,
  classtable longtext,
  features longtext
);
create table multiclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  ability_score_minimum tinyint unsigned,
  skills_profs_allowed tinyint default 0,
  item_proficiencies text,
  foreign key(id_class) references class(id)
);
create table subclass(
  id int unsigned primary key auto_increment,
  id_class int unsigned,
  name varchar(50),
  features longtext,
  foreign key(id_class) references class(id)
);
create table feat(
  id int unsigned primary key auto_increment,
  name varchar(50),
  features longtext,
  ability_score_allowed tinyint default 0,
  prequisite varchar(50)
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
  languages_choice varchar(50),
  skill_profs_allowed tinyint default 0,
  features longtext
);
create table language(
  id int unsigned primary key auto_increment,
  name varchar(50),
  lang_type enum('standard', 'secret', 'rare', 'exotic', 'ethnic'),
  script VARCHAR(50),
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
create table class_feat(
  id_class int unsigned,
  id_feat int unsigned,
  foreign key(id_class) references class(id),
  foreign key(id_feat) references feat(id),
  primary key(id_class,id_feat)
);
create table class_item(
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
create table multiclass_skill(
  id_multiclass int unsigned,
  id_skill int unsigned,
  foreign key(id_multiclass) references multiclass(id),
  foreign key(id_skill) references skill(id),
  primary key(id_multiclass,id_skill)
);
# Race
create table race_ability_score(id_race,id_ability_score);
create table race_language(id_race,id_language);
# Background
create table background_skill(id_bg,id_skill);
# Feats
create table feat_ability_score(id_feat,id_ability_score);
create table feat_spell(id_feat,id_spell);
# Common features
create table common_feature_class(id_feature,id_class);
create table common_feature_subclass(id_feature,id_subclass);
create table common_feature_feat(id_feature,id_feat);
create table common_feature_race(id_feature,id_race);
create table common_feature_background(id_feature,id_bg);

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
  (100, 'zemnian', null, null), -- the people of Zemniaz in the Age of Arcanum (ancient culture)
  (101, 'aquan', 'exotic', 'primordial, common, dwarvish'),
  (102, 'auran', 'exotic', 'primordial, common, dwarvish'),
  (103, 'ignan', 'exotic', 'primordial, common, dwarvish'),
  (104, 'terran', 'exotic', 'primordial, common, dwarvish');
  
insert into race(id, name, size, languages, speed, lineage)
values
  (1, 'Aarakocra', 'medium', 'You can speak, read, and write Common, Aarakocra, and Auran.', '25 feet, fly 50 feet', 'exotic'),
  (2, 'Aasimar', 'medium', 'You can speak, read, and write Common and Celestial.', '30 feet', 'exotic'),
  (3, 'Centaur', 'medium', 'You can speak, read, and write Common and Sylvan. Sylvan is widely spoken in the Selesnya Conclave, for it is rich in vocabulary to describe natural phenomena and spiritual forces.', '40 feet', 'monstrous'),
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
  (20, 'Water Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 feet, swim always equals to your walking speed', 'exotic'),
  (21, 'Deep Gnome', 'small', 'You can speak, read, and write Common, Gnomish or one other language that you and your DM agree is appropriate for your character, and Undercommon.', '25 feet', 'exotic'),
  (22, 'Forest Gnome', 'small', 'You can speak, read, and write Common and Gnomish or one other language that you and your DM agree is appropriate for your character. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world.', '25 feet', 'standard'),
  (23, 'Rock Gnome', 'small', 'You can speak, read, and write Common and Gnomish or one other language that you and your DM agree is appropriate for your character. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world.', '25 feet', 'standard'),
  (24, 'Goblin', 'small', 'You can speak, read, and write Common and Goblin or one other language that you and your DM agree is appropriate for your character. Goblin is a simplistic language with a limited vocabulary and fluid features of grammar, unsuited for any sophisticated conversation.', '30 feet', 'monstrous'),
  (25, 'Goliath', 'medium', 'You can speak, read, and write Common and Giant or one other language that you and your DM agree is appropriate for your character.', '30 feet', 'exotic'),
  (26, 'Hadozee', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet, climb equal to your walking speed', 'spelljammer'),
  (27, 'Half-Elf', 'medium', 'You can speak, read, and write Common, Elvish, and one extra language of your choice.', '30 feet', 'standard'),
  (28, 'Half-Orc', 'medium', 'You can speak, read, and write Common and Orc. Orc is a harsh, grating language with hard consonants. It has no script of its own but is written in the Dwarvish script.', '30 feet', 'standard'),
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
  (57, 'Verdan', 'varies', 'You speak, read, and write Common, Goblin, and one additional language of your choice. This language typically has some connection to one of the areas or cultures that has been part of your life.', '30 feet', 'exotic'),
  (58, 'Yuan-Ti', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 feet', 'monstrous');

insert into race_language(id_race, id_language)
values
  (1,11), (1,1), (1,102),
  (2,11), (2,8),
  (3,11), (3,81), -- sylvan
  (4,11), (4,80),
  (5,11), (5,18),
  (6,11), (6,21),
  (7,11), (7,20), (7,91),
  (8,11), (8,21),
  (9,11), (9,81),
  (10,11), (10,21), (10,23),
  (11,11), (11,21), -- elvish
  (12,11), (12,21),
  (13,11), (13,21),
  (14,11), (14,21),
  (15,11), (15,20), -- dwarven
  (16,11), (16,20),
  (17,11), (17,68), -- primordial
  (18,11), (19,68),
  (19,11), (19,68),
  (20,11), (20,68),
  (21,11), (21,29), -- gnomish
  (22,11), (22,29),
  (23,11), (23,29),
  (24,11), (24,31), -- goblin comun
  (25,11), (25,23), -- giant
  (26,11), -- estos son los monos
  (27,11), (27,21),
  (28,11), (28,65), -- standard orc
  (29,11), (29,35), -- halfling
  (30,11), (30,35),
  (31,11), (31,35),
  (32,11), (32,35),
  (33,11), (33,31),
  (34,11), (34,27),
  (35,11), (35,27),
  (36,33),
  (37,11), (37,81),
  (38,11), (28,31),
  (39,11), -- !IMPORTANT #### -- Rest of human ethnic languages
  (40,11), (41,11), (42,11),
  (43,11), (43,101),
  (44,11), (44,55),
  (45,11), (45,65),
  (46,11), (47,11), (47,81),
  (48,11), (48,21),
  (49,11), (50,11), (51,11), (52,11),
  (49,70), (50,70), (51,70), (52,70),
  (53,11), (54,11), (54,40),
  (55,11), (56,11), (56,68),
  (57,11), (57,31), (58,11);