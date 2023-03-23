use this_roll;

insert into race(id, name, size, languages, speed)
values
  (1, 'Aarakocra', 'medium', 'You can speak, read, and write Common, Aarakocra, and Auran.', '25 ft., fly 50 ft.'),
  (2, 'Aasimar', 'medium', 'You can speak, read, and write Common and Celestial.', '30 ft.'),
  (3, 'Centaur', 'medium', 'You can speak, read, and write Common and Sylvan. Sylvan is widely spoken in the Selesnya Conclave, for it is rich in vocabulary to describe natural phenomena and spiritual forces.', '40 ft'.),
  (4, 'Changeling', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 ft.'),
  (5, 'Dragonborn', 'medium', 'You can speak, read, and write Common and Draconic. Draconic is thought to be one of the oldest languages and is often used in the study of magic. The language sounds harsh to most other creatures and includes numerous hard consonants and sibilants.', '30ft.'),
  (6, 'Drow', 'medium', 'You can speak, read, and write Common and Elvish or one other language that you and your DM agree is appropriate for your character.', '30 ft.'),
  (7, 'Duergar', 'medium', 'You can speak, read, and write Common and Dwarvish or one other language that you and your DM agree is appropriate for your character.', '25 ft.'),
  (8, 'Eladrin', 'medium', 'You can speak, read, and write Common and Elvish.', '30 ft.'),
  (9, 'Fairy', 'small', 'You can speak, read, and write Common and Sylvan or one other language that you and your DM agree is appropriate for your character.', '30 ft., fly always equals to your walking speed'),
  (10, 'Firbolg', 'medium', 'You can speak, read, and write Common, Elvish, and Giant, or Common and one other language that you and your DM agree is appropriate for your character.', '30 ft.'),
  (11, 'High Elf', 'You can speak, read, and write Common and Elvish.', '30 ft.'),
  (12, 'Pallid Elf', 'You can speak, read, and write Common and Elvish.', '30 ft.'),
  (13, 'Sea Elf', 'You can speak, read, and write Common and Elvish.', '30 ft., swim 30ft.'),
  (14, 'Woof Elf', 'You can speak, read, and write Common and Elvish.', '35 ft.'),
  (15, 'Hill Dwarf', 'medium', 'You can speak, read, and write Common and Dwarvish or one other language that you and your DM agree is appropriate for your character. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.', '25 ft.'),
  (16, 'Mountain Dwarf', 'medium', 'You can speak, read, and write Common and Dwarvish or one other language that you and your DM agree is appropriate for your character. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.', '25 ft.'),
  (17, 'Air Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '35 ft.'),
  (18, 'Earth Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 ft.'),
  (19, 'Fire Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 ft.'),
  (20, 'Water Genasi', 'medium', 'You can speak, read, and write Common and Primordial or one other language that you and your DM agree is appropriate for your character. Primordial is a guttural language, filled with harsh syllables and hard consonants.', '30 ft., swim always equals to your walking speed'),
  (21, 'Deep Gnome', 'small', 'You can speak, read, and write Common, Gnomish or one other language that you and your DM agree is appropriate for your character, and Undercommon.', '25 ft.'),
  (22, 'Forest Gnome', 'small', 'You can speak, read, and write Common and Gnomish or one other language that you and your DM agree is appropriate for your character. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world.', '25 ft.'),
  (23, 'Rock Gnome', 'small', 'You can speak, read, and write Common and Gnomish or one other language that you and your DM agree is appropriate for your character. The Gnomish language, which uses the Dwarvish script, is renowned for its technical treatises and its catalogs of knowledge about the natural world.', '25 ft.'),
  (24, 'Goblin', 'small', 'You can speak, read, and write Common and Goblin or one other language that you and your DM agree is appropriate for your character. Goblin is a simplistic language with a limited vocabulary and fluid rules of grammar, unsuited for any sophisticated conversation.', '30 ft.'),
  (25, 'Goliath', 'medium', 'You can speak, read, and write Common and Giant or one other language that you and your DM agree is appropriate for your character.', '30 ft.'),
  (26, 'Hadozee', 'small/medium', 'You can speak, read, and write Common and one other language that you and your DM agree is appropriate for your character.', '30 ft., climb equal to your walking speed'),
  (27, 'Half-Elf, 'medium', 'You can speak, read, and write Common, Elvish, and one extra language of your choice.', '30 ft.),
  (28, 'Half-Orc', 'medium', 'You can speak, read, and write Common and Orc. Orc is a harsh, grating language with hard consonants. It has no script of its own but is written in the Dwarvish script.', '30 ft.'),
  (29, 'Ghostwise Halfling', 'small', 'You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.', '25 ft.'),
  (30, 'Lightfoot Halfling', 'small', 'You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.', '25 ft.'),
  (31, 'Lotusden Halfling', 'small', 'You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.', '25 ft.'),
  (32, 'Stout Halfling', 'small', 'You can speak, read, and write Common and Halfling. The Halfling language isn't secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong. Almost all halflings speak Common to converse with the people in whose lands they dwell or through which they are traveling.', '25 ft.'),
  (33, 'Harengon'

insert into race_language(id_race, id_language)
values
  (1,11), (1,1),
  (2,11), (2,8),
  (3,11), (3,81),
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
