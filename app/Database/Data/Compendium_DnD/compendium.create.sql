DROP DATABASE if EXISTS this_roll;
CREATE DATABASE this_roll; USE this_roll;

# ################### #
# Non heritage tables #
# ################### #
CREATE TABLE ability_score(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 saving_throw VARCHAR(15),
 slug CHAR(3), KEY(slug)
);
CREATE TABLE skill(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 ability_score CHAR(3),
 name VARCHAR(50), FOREIGN KEY(ability_score) REFERENCES ability_score(slug)
);
CREATE TABLE class(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(25),
 hit_dice VARCHAR(4),
 hit_points VARCHAR(20),
 hit_points_heigher_levels VARCHAR(40),
 starting_equipment TEXT,
 skills_profs_allowed TINYINT DEFAULT 0,
 classtable LONGTEXT,
 features LONGTEXT
);
CREATE TABLE multiclass(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_class INT UNSIGNED,
 ability_score_minimum TINYINT UNSIGNED,
 skills_profs_allowed TINYINT DEFAULT 0,
 item_proficiencies TEXT, FOREIGN KEY(id_class) REFERENCES class(id)
);
CREATE TABLE subclass(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_class INT UNSIGNED,
 name VARCHAR(50),
 skills_profs_allowed TINYINT DEFAULT 0,
 features LONGTEXT, FOREIGN KEY(id_class) REFERENCES class(id)
);
CREATE TABLE feat(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(50),
 features LONGTEXT,
 ability_score_allowed TINYINT DEFAULT 0,
 prequisite VARCHAR(50)
);
CREATE TABLE race(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(50),
 size VARCHAR(15),
 languages VARCHAR(50),
 speed VARCHAR(50),
 lineage VARCHAR(50),
 features LONGTEXT
);
CREATE TABLE background(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(50),
 equipment TEXT,
 languages VARCHAR(50),
 skill_profs_allowed TINYINT DEFAULT 0,
 features LONGTEXT
);
CREATE TABLE LANGUAGE(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(50),
 lang_type ENUM('standard', 'secret', 'rare', 'exotic', 'ethnic'),
 script VARCHAR(50),
 description TEXT
);
CREATE TABLE common_features(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 title VARCHAR(50),
 description TEXT
);

# ############### #
# Heritage father #
# ############### #
CREATE TABLE reference(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(50),
 description TEXT
);
# Heritage children #
CREATE TABLE item(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_reference INT UNSIGNED,
 item_type VARCHAR(25),
 cost VARCHAR(15),
 weight VARCHAR(15)
);
CREATE TABLE ACTION(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_reference INT UNSIGNED,
 action_time VARCHAR(25)
);
CREATE TABLE spell(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_reference INT UNSIGNED,
 spell_level TINYINT,
 spell_time VARCHAR(15),
 components VARCHAR(50),
 duration VARCHAR(25),
 school VARCHAR(25),
 spell_range VARCHAR(25)
);
CREATE TABLE bestiary(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_reference INT UNSIGNED,
 CR TINYINT DEFAULT -1, -- Negative 1 will mean 'Unknown'
 creature_type
VARCHAR(25)
);
CREATE TABLE conditions(
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 id_reference INT UNSIGNED
);

########################
# Relationships tables #
########################
# Class
CREATE TABLE class_saving_throw(
 id_class INT UNSIGNED,
 id_saving_throw INT UNSIGNED, FOREIGN KEY(id_class) REFERENCES class(id), FOREIGN KEY(id_saving_throw) REFERENCES ability_score(id), PRIMARY KEY(id_class,id_saving_throw)
);
CREATE TABLE class_skill(
 id_class INT UNSIGNED,
 id_skill INT UNSIGNED, FOREIGN KEY(id_class) REFERENCES class(id), FOREIGN KEY(id_skill) REFERENCES skill(id), PRIMARY KEY(id_class,id_skill)
);
CREATE TABLE class_language(
 id_class INT UNSIGNED,
 id_language INT UNSIGNED, FOREIGN KEY(id_class) REFERENCES class(id), FOREIGN KEY(id_language) REFERENCES LANGUAGE(id), PRIMARY KEY(id_class,id_language)
);
CREATE TABLE class_feat(
 id_class INT UNSIGNED,
 id_feat INT UNSIGNED, FOREIGN KEY(id_class) REFERENCES class(id), FOREIGN KEY(id_feat) REFERENCES feat(id), PRIMARY KEY(id_class,id_feat)
);
CREATE TABLE class_item(
 id_class INT UNSIGNED,
 id_item INT UNSIGNED, FOREIGN KEY(id_class) REFERENCES class(id), FOREIGN KEY(id_item) REFERENCES item(id), PRIMARY KEY(id_class,id_item)
);
CREATE TABLE class_spell(
 id_class INT UNSIGNED,
 id_spell INT UNSIGNED, FOREIGN KEY(id_class) REFERENCES class(id), FOREIGN KEY(id_spell) REFERENCES spell(id), PRIMARY KEY(id_class,id_spell)
);
# Multiclass
CREATE TABLE multiclass_skill(
 id_multiclass INT UNSIGNED,
 id_skill INT UNSIGNED, FOREIGN KEY(id_multiclass) REFERENCES multiclass(id), FOREIGN KEY(id_skill) REFERENCES skill(id), PRIMARY KEY(id_multiclass,id_skill)
);
# Race
CREATE TABLE race_ability_score(
 id_race INT UNSIGNED,
 id_ability_score INT UNSIGNED, FOREIGN KEY(id_race) REFERENCES race(id), FOREIGN KEY(id_ability_score) REFERENCES ability_score(id), PRIMARY KEY(id_race,id_ability_score)
);
CREATE TABLE race_language(
 id_race INT UNSIGNED,
 id_language INT UNSIGNED, FOREIGN KEY(id_race) REFERENCES race(id), FOREIGN KEY(id_language) REFERENCES LANGUAGE(id), PRIMARY KEY(id_race,id_language)
);
# Background
CREATE TABLE background_skill(
 id_bg INT UNSIGNED,
 id_skill INT UNSIGNED, FOREIGN KEY(id_bg) REFERENCES background(id), FOREIGN KEY(id_skill) REFERENCES skill(id), PRIMARY KEY(id_bg,id_skill)
);
# Feats
CREATE TABLE feat_ability_score(
 id_feat INT UNSIGNED,
 id_ability_score INT UNSIGNED, FOREIGN KEY(id_feat) REFERENCES feat(id), FOREIGN KEY(id_ability_score) REFERENCES ability_score(id), PRIMARY KEY(id_feat,id_ability_score)
);
CREATE TABLE feat_spell(
 id_feat INT UNSIGNED,
 id_spell INT UNSIGNED, FOREIGN KEY(id_feat) REFERENCES feat(id), FOREIGN KEY(id_spell) REFERENCES spell(id), PRIMARY KEY(id_feat,id_spell)
);
# Common features
CREATE TABLE common_feature_class(
 id_feature INT UNSIGNED,
 id_class INT UNSIGNED, FOREIGN KEY(id_feature) REFERENCES common_features(id), FOREIGN KEY(id_class) REFERENCES class(id), PRIMARY KEY(id_feature,id_class)
);
CREATE TABLE common_feature_subclass(
 id_feature INT UNSIGNED,
 id_subclass INT UNSIGNED, FOREIGN KEY(id_feature) REFERENCES common_features(id), FOREIGN KEY(id_subclass) REFERENCES subclass(id), PRIMARY KEY(id_feature,id_subclass)
);
CREATE TABLE common_feature_feat(
 id_feature INT UNSIGNED,
 id_feat INT UNSIGNED, FOREIGN KEY(id_feature) REFERENCES common_features(id), FOREIGN KEY(id_feat) REFERENCES feat(id), PRIMARY KEY(id_feature,id_feat)
);
CREATE TABLE common_feature_race(
 id_feature INT UNSIGNED,
 id_race INT UNSIGNED, FOREIGN KEY(id_feature) REFERENCES common_features(id), FOREIGN KEY(id_race) REFERENCES race(id), PRIMARY KEY (id_feature,id_race)
);
CREATE TABLE common_feature_background(
 id_feature INT UNSIGNED,
 id_bg INT UNSIGNED, FOREIGN KEY(id_feature) REFERENCES common_features(id), FOREIGN KEY(id_bg) REFERENCES background(id), PRIMARY KEY(id_feature,id_bg)
);
SELECT COUNT(*) AS total_number_of_tables
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'this_roll';
INSERT INTO ability_score(saving_throw, slug) VALUES
 ('strength', 'str'),
 ('dexterity', 'dex'),
 ('constitution', 'con'),
 ('intelligence', 'int'),
 ('wisdom', 'wis'),
 ('charisma', 'char');
INSERT INTO skill(ability_score, name) VALUES
 ('DEX', 'acrobatics'),
 ('WIS', 'animal handling'),
 ('INT', 'arcana'),
 ('STR', 'athletics'),
 ('CHAR', 'deception'),
 ('INT', 'history'),
 ('WIS', 'insight'),
 ('CHAR', 'intimidation'),
 ('INT', 'investigation'),
 ('WIS', 'medicine'),
 ('INT', 'nature'),
 ('WIS', 'perception'),
 ('CHAR', 'performance'),
 ('CHAR', 'persuasion'),
 ('INT', 'religion'),
 ('DEX', 'sleight of hand'),
 ('DEX', 'stealth'),
 ('WIS', 'survival');


-- rare is more special than exotic
INSERT INTO LANGUAGE(id, name, lang_type, script) VALUES
 (1, 'aarakocra', NULL, NULL),
 (2, 'abanasinian', 'standard', 'common'),
 (3, 'abyssal', 'standard', 'infernal'),
 (4, 'alzhedo', 'ethnic', 'thorass'),
 (5, 'blink dog', NULL, NULL),
 (6, 'bothii', NULL, NULL),
 (7, 'bullywug', NULL, NULL),
 (8, 'celestial', 'exotic', 'celestial'),
 (9, 'chessentan', 'ethnic', 'thorass'),
 (10, 'chondathan', 'ethnic', 'thorass'),
 (11, 'common', 'standard', 'common'),
 (12, 'daelkyr', 'exotic', 'daelkyr'),
 (13, 'damaran', 'ethnic', 'dethek'),
 (14, 'dambrathan', 'ethnic', 'espruar'),
 (15, 'deep crow', NULL, NULL),
 (16, 'deep speech', 'exotic', 'none'),
 (17, 'draconic', 'rare', 'draconic'), -- only dragons
 (18, 'draconic', 'exotic', 'draconic'), -- dragons & dragonborns
 (19, 'druidic', 'secret',
NULL), -- druids, treants
 (20, 'dwarvish', 'standard', 'dwarvish'), -- dwarves
 (21, 'elvish', 'standard', 'elvish'), -- elves
 (22, 'ergot', 'standard', 'common'), -- Northern Ergoth (no race)
 (23, 'giant', 'standard', 'giant, dwarvish'), -- ogres, giants, cyclopes
 (24, 'giant eagle',
NULL, NULL),
 (25, 'giant elf', NULL, NULL),
 (26, 'giant owl', NULL, NULL),
 (27, 'gith', NULL, "tir'su"), -- githzerai monks, githyanki warriors, githzerai zerths, githyanki knights
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
  (83, "thieves' cant", 'secret',
NULL), -- assassins, rogues
 (84, 'thri-kreen',
NULL, NULL), -- thri-kreen
 (85, 'tlincalli',
NULL, NULL), -- tlincalli
 (86, 'troglodytes',
NULL, NULL), -- troglodytes
 (87, 'tuigan', 'ethnic', 'thorass'), -- humans
 (88, 'turmic', 'ethnic', 'thorass'), -- humans
 (89, 'uluik', 'ethnic', 'thorass'), -- humans
 (90, 'umber hulk',
NULL, NULL), -- umber hulks
 (91, 'undercommon', 'exotic', 'elvish'), -- underdark traders
 (92, 'untheric', 'ethnic', 'thorass'), -- humans
 (93, 'vedalken', 'standard', 'vedalken'), -- vedalken
 (94, 'vegepygmy',
NULL, NULL), -- vegepygmies, vegepygmy chiefs
 (95, 'waelan', 'ethnic', 'thorass'), -- humans
 (96, 'winter wolf',
NULL, NULL), -- winter wolves
 (97, 'worg',
NULL, NULL), -- worgs
 (98, 'yeti',
NULL, NULL), -- yetis, abominable yetis
 (99, 'yikaria',
NULL, NULL), -- yakfolk priests, yakfolk warriors
 (100, 'zemnian',
NULL, NULL), -- the people of Zemniaz in the Age of Arcanum (ancient culture)
 (101, 'aquan', 'exotic', 'primordial, common, dwarvish'),
 (102, 'auran', 'exotic', 'primordial, common, dwarvish'),
 (103, 'ignan', 'exotic', 'primordial, common, dwarvish'),
 (104, 'terran', 'exotic', 'primordial, common, dwarvish');
INSERT INTO race(id, name, size, languages, speed, lineage) VALUES
 (1, 'Aarakocra', 'medium', 'You can speak, read, and write Common, Aarakocra, and Auran.', '25 feet, fly 50 feet', 'exotic'),
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
 (12, 'Pallid Elf', 'medium', 'You can speak, read, and write Common and Elvish.', '30 feet', "explorer's guide TO wildemount"),
  (13, 'Sea Elf', 'medium', 'You can speak, READ, AND WRITE Common AND Elvish.', '30 feet, swim 30 feet', 'exotic'),
  (14, 'Woof Elf', 'medium', 'You can speak, READ, AND WRITE Common AND Elvish.', '35 feet', 'standard'),
  (15, 'Hill Dwarf', 'medium', 'You can speak, READ, AND WRITE Common AND Dwarvish OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Dwarvish IS FULL of hard consonants AND guttural sounds, AND those characteristics spill over INTO whatever other LANGUAGE a dwarf might speak.', '25 feet', 'standard'),
  (16, 'Mountain Dwarf', 'medium', 'You can speak, READ, AND WRITE Common AND Dwarvish OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Dwarvish IS FULL of hard consonants AND guttural sounds, AND those characteristics spill over INTO whatever other LANGUAGE a dwarf might speak.', '25 feet', 'standard'),
  (17, 'Air Genasi', 'medium', 'You can speak, READ, AND WRITE Common AND Primordial OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Primordial IS a guttural LANGUAGE, filled WITH harsh syllables AND hard consonants.', '35 feet', 'exotic'),
  (18, 'Earth Genasi', 'medium', 'You can speak, READ, AND WRITE Common AND Primordial OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Primordial IS a guttural LANGUAGE, filled WITH harsh syllables AND hard consonants.', '30 feet', 'exotic'),
  (19, 'Fire Genasi', 'medium', 'You can speak, READ, AND WRITE Common AND Primordial OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Primordial IS a guttural LANGUAGE, filled WITH harsh syllables AND hard consonants.', '30 feet', 'exotic'),
  (20, 'Water Genasi', 'medium', 'You can speak, READ, AND WRITE Common AND Primordial OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Primordial IS a guttural LANGUAGE, filled WITH harsh syllables AND hard consonants.', '30 feet, swim always EQUALS TO your walking speed', 'exotic'),
  (21, 'Deep Gnome', 'small', 'You can speak, READ, AND WRITE Common, Gnomish OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your CHARACTER, AND Undercommon.', '25 feet', 'exotic'),
  (22, 'Forest Gnome', 'small', 'You can speak, READ, AND WRITE Common AND Gnomish OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. The Gnomish LANGUAGE, which uses the Dwarvish script, IS renowned FOR its technical treatises AND its catalogs of knowledge about the
NATURAL world.', '25 feet', 'standard'),
  (23, 'Rock Gnome', 'small', 'You can speak, READ, AND WRITE Common AND Gnomish OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. The Gnomish LANGUAGE, which uses the Dwarvish script, IS renowned FOR its technical treatises AND its catalogs of knowledge about the
NATURAL world.', '25 feet', 'standard'),
  (24, 'Goblin', 'small', 'You can speak, READ, AND WRITE Common AND Goblin OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character. Goblin IS a simplistic LANGUAGE WITH a limited vocabulary AND fluid features of grammar, unsuited FOR ANY sophisticated conversation.', '30 feet', 'monstrous'),
  (25, 'Goliath', 'medium', 'You can speak, READ, AND WRITE Common AND Giant OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (26, 'Hadozee', 'small/medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet, climb equal TO your walking speed', 'spelljammer'),
  (27, 'Half-Elf', 'medium', 'You can speak, READ, AND WRITE Common, Elvish, AND one extra LANGUAGE of your choice.', '30 feet', 'standard'),
  (28, 'Half-Orc', 'medium', 'You can speak, READ, AND WRITE Common AND Orc. Orc IS a harsh, grating LANGUAGE WITH hard consonants. It has NO script of its own but IS written in the Dwarvish script.', '30 feet', 'standard'),
  (29, 'Ghostwise Halfling', 'small', "You can speak, READ, AND WRITE Common AND Halfling. The Halfling LANGUAGE isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, IS very strong. Almost ALL halflings speak Common TO converse WITH the people in whose lands they dwell OR through which they are traveling.", '25 feet', 'standard'),
  (30, 'Lightfoot Halfling', 'small', "You can speak, READ, AND WRITE Common AND Halfling. The Halfling LANGUAGE isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, IS very strong. Almost ALL halflings speak Common TO converse WITH the people in whose lands they dwell OR through which they are traveling.", '25 feet', 'standard'),
  (31, 'Lotusden Halfling', 'small', "You can speak, READ, AND WRITE Common AND Halfling. The Halfling LANGUAGE isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, IS very strong. Almost ALL halflings speak Common TO converse WITH the people in whose lands they dwell OR through which they are traveling.", '25 feet', 'standard'),
  (32, 'Stout Halfling', 'small', "You can speak, READ, AND WRITE Common AND Halfling. The Halfling LANGUAGE isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, IS very strong. Almost ALL halflings speak Common TO converse WITH the people in whose lands they dwell OR through which they are traveling.", '25 feet', 'standard'),
  (33, 'Bugbear', 'medium', 'You can speak, READ, AND WRITE Common AND Goblin OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous'),
  (34, 'Githyanki', 'medium', 'You can speak, READ, AND WRITE Common AND Gith OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (35, 'Githzerai', 'medium', 'You can speak, READ, AND WRITE Common AND Gith OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (36, 'Grung', 'small', 'You can speak, READ, AND WRITE Grung.', '25 feet', 'monstrous'),
  (37, 'Harengon', 'small', 'You can speak, READ, AND WRITE Common AND Sylvan OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (38, 'Hobgoblin', 'medium', 'You can speak, READ, AND WRITE Common AND Goblin.', '30 feet', 'monstrous'),
  (39, 'Human', 'small/medium', 'You can speak, READ, AND WRITE Common AND one extra LANGUAGE of your choice. Humans typically learn the languages of other peoples they deal WITH, including obscure dialects. They are fond of sprinkling their speech WITH words borrowed
FROM other tongues: Orc curses, Elvish musical expressions, Dwarvish military phrases, AND so on.', '30 feet', 'standard'),
  (40, 'Kenku', 'medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (41, 'Kobold', 'small', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous'),
  (42, 'Lizardfolg', 'medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet, swim equal TO your walking speed', 'monstrous'),
  (43, 'Locathah', 'medium', 'You can speak, READ, AND WRITE Aquan AND Common.', '30 feet, AND you have a swim speed of 30 feet.', 'exotic'),
  (44, 'Minotaur', 'medium', 'You can speak, READ, AND WRITE Common AND Minotaur.', '30 feet', 'monstrous'),
  (45, 'Orc', 'medium', 'You can speak, READ, AND WRITE Common AND Orc.', '30 feet', 'monstrous'),
  (46, 'Owlin', 'small/medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your CHARACTER', '30 feet, fly equal TO your walking speed', 'exotic'),
  (47, 'Satyr', 'medium', 'You can speak, READ, AND WRITE Common AND Sylvan.', '35 feet', 'exotic'),
  (48, 'Shadar-Kai', 'medium', 'You can speak, READ, AND WRITE Common AND Elvish OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (49, 'Beasthide Shifter', 'medium', 'You can speak, READ, AND WRITE Common AND Quori OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous'),
  (50, 'Longtooth Shifter', 'medium', 'You can speak, READ, AND WRITE Common AND Quori OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous'),
  (51, 'Swiftstride Shifter', 'medium', 'You can speak, READ, AND WRITE Common AND Quori OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous'),
  (52, 'Wildhunt Shifter', 'medium', 'You can speak, READ, AND WRITE Common AND Quori OR one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous'),
  (53, 'Tabaxi', 'medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE of your choice.', '30 feet, climb 20 feet', 'exotic'),
  (54, 'Tiefling', 'medium', 'You can speak, READ, AND WRITE Common AND Infernal.', '30 feet', 'standard'),
  (55, 'Tortle', 'small/medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'exotic'),
  (56, 'Triton', 'medium', 'You can speak, READ, AND WRITE Common AND Primordial.', '30 feet, swim 30 feet', 'exotic'),
  (57, 'Verdan', 'varies', 'You speak, READ, AND WRITE Common, Goblin, AND one additional LANGUAGE of your choice. This LANGUAGE typically has SOME CONNECTION TO one of the areas OR cultures that has been part of your life.', '30 feet', 'exotic'),
  (58, 'Yuan-Ti', 'small/medium', 'You can speak, READ, AND WRITE Common AND one other LANGUAGE that you AND your DM agree IS appropriate FOR your character.', '30 feet', 'monstrous');

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
  (18,11), (18,68),
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