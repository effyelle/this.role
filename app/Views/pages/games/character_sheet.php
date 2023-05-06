<?php if (isset($sheet)) { ?>
    <div class="modal-header flex-row-wrap justify-content-between align-items-center cursor-move">
        <div class="" data-from="item_title">
            <!--Autofill-->
        </div>
        <div class="flex-row-wrap gap-5 align-items-end justify-content-end align-self-start">
            <button type="button" value="<?= $sheet['item_id'] ?>" class="btn p-0 minmax-btn text-hover-dark">
                <i class="fa-solid fa-minus fs-3"></i>
            </button>
            <button type="button" value="<?= $sheet['item_id'] ?>" class="btn p-0 close_item-btn text-hover-dark">
                <i class="fa-solid fa-close fs-1"></i>
            </button>
        </div>
    </div>
    <div class="modal-body">
        <div class="flex-column align-content-center align-items-center justify-content-center">
            <!--begin::Tabs-->
            <ul class="nav nav-tabs w-100 pt-2 justify-content-start fs-7">
                <li class="nav-item">
                    <a class="nav-link py-2 px-3 active" data-bs-toggle="tab"
                       href="#draggable_<?= $sheet['item_id'] ?>-character">
                        <i class="fa fa-dragon f-lg text-this-role-light"></i>
                        <span>Character</span>
                    </a>
                </li>
                <li class="nav-item d-none">
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab"
                       href="#draggable_<?= $sheet['item_id'] ?>-spells">
                        <i class="fa fa-book f-lg text-this-role-light"></i>
                        <span>Spells</span>
                    </a>
                </li>
            </ul>
            <!--end::Tabs-->
            <!--begin::Character content-->
            <div id="draggable_<?= $sheet['item_id'] ?>-character" class="py-8 px-2 tab-pane fade show active">
                <button value="10" id="<?= $sheet['item_id'] ?>" class="d-none this-item-id"></button>
                <div class="flex-row-wrap gap-5 justify-content-center align-items-center" style="width: 800px">
                    <div class="column this-outline w-100">
                        <div class="flex-row-wrap justify-content-center p-4 gap-5">
                            <!--begin::Col-->
                            <div class="flex-column justify-content-center gap-5">
                                <!--begin::Character name-->
                                <div class="form-control-solid">
                                    <div class="flex-column">
                                        <input type="text" value="<?= $sheet['item_title'] ?>"
                                               id="item_title" name="item_title"
                                               class="form-control form-control-sm this-role-form-field ff-poiret fs-5 fw-boldest"/>
                                        <label for="item_title">Character Name</label>
                                    </div>
                                </div>
                                <!--end::Character name-->
                                <!--begin::Row-->
                                <div class="flex-row-wrap justify-content-center gap-8">
                                    <!--begin::Col-->
                                    <div class="flex-column gap-2">
                                        <!--begin::Col-->
                                        <div class="avatar-container">
                                            <!--begin::Avatar-->
                                            <div class="d-flex flex-column align-items-center">
                                                <div class="symbol icon-hover symbol-125px symbol-xl-150px circle position-relative">
                                                    <div class="d-flex justify-content-center align-items-center icon-hover-label position-absolute top-0 left-0">
                                                        <label for="item_icon"
                                                               class="btn btn-sm btn-link fs-7 p-0">Change</label>
                                                    </div>
                                                    <input id="item_icon" name="item_icon" type="file"
                                                           class="d-none this-role-form-field"/>
                                                    <span class="symbol-label circle item_icon-holder"
                                                          style="background: url(/assets/media/avatars/blank.png); background-size: cover;">
                                        </span>
                                                </div>
                                            </div>
                                            <!--end::Avatar-->
                                        </div>
                                        <!--end::Col-->
                                        <!--begin::Col-->
                                        <div class="flex-row-nowrap gap-12 justify-content-end">
                                            <!--begin::Inspiration-->
                                            <div class="this-double-outline combat-item cursor-pointer circle">
                                                <div class="flex-column justify-content-center align-items-center gap-2">
                                                    <div class="symbol symbol-25px">
                                                        <button class="d-none" id="this-init" name="this-init"
                                                                value="0"></button>
                                                        <span class="symbol-label"
                                                              style="background: url(/assets/media/games/journal/insp.png); background-size:contain">
                                            </span>
                                                    </div>
                                                    <label for="this-init" class="combat-item_title">INSPIRATION</label>
                                                </div>
                                            </div>
                                            <!--end::Inspiration-->
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                    <!--end::Col-->
                                    <!--begin::Col-->
                                    <div class="flex-column gap-12 justify-content-between">
                                        <!--begin::Row-->
                                        <div class="flex-column gap-3">
                                            <!--begin::Character origin details (class, race, etc.)-->
                                            <div class="flex-row-wrap justify-content-between row-cols-3">
                                                <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-4 pe-4 form-control-solid">
                                                    <label for="class">Class</label>
                                                    <select id="class" name="class"
                                                            aria-selected="<?= $sheet['class'] ?? '-1' ?>"
                                                            class="this-role-form-field px-3 ms-3 form-control form-control-sm">
                                                        <option value="-1" disabled selected>Select one</option>
                                                        <option value="artificer">Artificer</option>
                                                        <option value="barbarian">Barbarian</option>
                                                        <option value="bard">Bard</option>
                                                        <option value="cleric">Cleric</option>
                                                        <option value="druid">Druid</option>
                                                        <option value="fighter">Fighter</option>
                                                        <option value="monk">Monk</option>
                                                        <option value="paladin">Paladin</option>
                                                        <option value="ranger">Ranger</option>
                                                        <option value="rogue">Rogue</option>
                                                        <option value="sorcerer">Sorcerer</option>
                                                        <option value="warlock">Warlock</option>
                                                        <option value="wizard">Wizard</option>
                                                    </select>
                                                </div>
                                                <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-5 px-4">
                                                    <label for="subclass">Subclass</label>
                                                    <input type="text" id="subclass" name="subclass"
                                                           value="<?= $sheet['subclass'] ?? '' ?>"
                                                           class="this-role-form-field ms-3 w-50"/>
                                                </div>
                                                <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-3 pe-4">
                                                    <label for="">Level</label>
                                                    <span class="ps-3 w-25" data-from="xp">888</span>
                                                </div>
                                            </div>
                                            <div class="flex-row-wrap justify-content-between row-cols-3">
                                                <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-4 pe-4 form-control-solid">
                                                    <label for="race">Race</label>
                                                    <select id="race" name="race"
                                                            aria-selected="<?= $sheet['race'] ?? '-1' ?>"
                                                            class="this-role-form-field ms-3 px-3 form-control form-control-sm">
                                                        <option value="-1" disabled selected>Select one</option>
                                                        <option value="dragonborn">Dragonborn</option>
                                                        <option value="dwarf">Dwarf</option>
                                                        <option value="elf">Elf</option>
                                                        <option value="gnome">Gnome</option>
                                                        <option value="half-elf">Half-Elf</option>
                                                        <option value="half-orc">Half-Orc</option>
                                                        <option value="halfling">Halfling</option>
                                                        <option value="human">Human</option>
                                                        <option value="tiefling">Tiefling</option>
                                                    </select>
                                                </div>
                                                <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-5 pe-4">
                                                    <label for="background">Background</label>
                                                    <input type="text" id="background" name="background"
                                                           value="<?= $sheet['background'] ?? '' ?>"
                                                           class="this-role-form-field ms-3 w-50"/>
                                                </div>
                                                <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-3 pe-4">
                                                    <label for="xp">XP</label>
                                                    <input type="number" id="xp" name="xp"
                                                           value="<?= $sheet['xp'] ?? '0' ?>"
                                                           class="this-role-form-field ms-3 w-50"/>
                                                </div>
                                            </div>
                                            <!--end::Character origin details (class, race, etc.)-->
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="flex-column gap-6 justify-content-between">
                                            <!--begin::Row-->
                                            <!--begin::Row - Combat (general)-->
                                            <div class="flex-row-wrap justify-content-center align-items-center gap-5">
                                                <!--begin::Class Armor (CA)-->
                                                <div class="this-ca combat-item">
                                                    <div class="flex-column justify-content-center align-items-center gap-2">
                                                        <span type="text" data-from="this-ac"
                                                              class="combat-item_content">10</span>
                                                        <label for="this-ac" class="combat-item_title">AC</label>
                                                        <input type="text" id="this-ac" name="this-ac"
                                                               class="d-none this-role-form-field"/>
                                                    </div>
                                                </div>
                                                <!--end::Class Armor (CA)-->
                                                <!--begin::Initiative bonus-->
                                                <div class="this-outline combat-item">
                                                    <div class="flex-column justify-content-center align-items-center gap-2">
                                                        <span type="text" data-from="this-init"
                                                              class="combat-item_content">0</span>
                                                        <input type="text" id="this-init" name="this-init"
                                                               class="d-none this-role-form-field"/>
                                                        <label for="this-init"
                                                               class="combat-item_title">INITIATIVE</label>
                                                    </div>
                                                </div>
                                                <!--end::Initiative bonus-->
                                                <!--begin::Speed-->
                                                <div class="this-outline combat-item">
                                                    <div class="flex-column justify-content-center align-items-center gap-2">
                                                        <input type="text" id="this-walkspeed" name="this-walkspeed"
                                                               value="0"
                                                               class="combat-item_content this-role-form-field"/>
                                                        <label for="this-walkspeed" class="combat-item_title">WALK
                                                            SPEED</label>
                                                    </div>
                                                </div>
                                                <!--end::Speed-->
                                                <!--begin::Proficiency bonus-->
                                                <div class="this-outline combat-item">
                                                    <div class="flex-column justify-content-center align-items-center gap-2">
                                                        <span type="text" class="combat-item_content">
                                                            +<span data-from="this-prof">0</span>
                                                        </span>
                                                        <input type="text" id="this-prof" name="this-prof"
                                                               value="0"
                                                               class="d-none this-role-form-field"/>
                                                        <label for="this-prof"
                                                               class="combat-item_title">PROFICIENCY</label>
                                                    </div>
                                                </div>
                                                <!--end::Proficiency bonus-->
                                            </div>
                                            <!--end::Row - Combat (general)-->
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Col-->
                                </div>
                                <!--end::Row-->
                            </div>
                            <!--end::Col-->
                        </div>
                    </div>
                    <!--begin::Row-->
                    <div class="flex-row gap-3">
                        <!--begin::Ability scores-->
                        <div class="column this-outline" style="width: 350px;">
                            <div class="fs-3 p-3 w-100">Ability Scores & Saving Throws</div>
                            <div class="flex-row-wrap row-cols-2 justify-content-center mt-5 p-4">
                                <!--begin::Col-->
                                <div class="flex-column justify-content-end align-items-center">
                                    <!--begin::Strength-->
                                    <div class="flex-column align-items-center justify-content-start position-relative w-70px h-100px">
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                            <button type="button" class="btn p-0 combat-item_title text-hover-primary">
                                                STRENGTH
                                            </button>
                                            <label for="this-score-str" class="fs-3">0</label>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                            <input type="text" id="this-score-str" name="this-score-str" value="10"
                                                   class="combat-item_content this-score this-role-form-field"/>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                            <label for="this-score-str-is-prof"
                                                   data-from="this-score-str-is-prof">0</label>
                                            <input type="checkbox" id="this-score-str-is-prof"
                                                   name="this-score-str-is-prof"
                                                   class="form-control form-check-input this-role-form-field b-0 position-absolute ms-9 score-prof"/>
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Strength-->
                                </div>
                                <!--end::Col-->
                                <!--begin::Col-->
                                <div class="flex-column justify-content-start align-items-center">
                                    <!--begin::Dexterity-->
                                    <div class="flex-column align-items-center justify-content-start position-relative w-70px h-100px">
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                            <button type="button" class="btn p-0 combat-item_title text-hover-primary">
                                                DEXTERITY
                                            </button>
                                            <label for="this-score-dex" class="fs-3">0</label>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                            <input type="text" id="this-score-dex" name="this-score-dex" value="10"
                                                   class="combat-item_content this-score this-role-form-field"/>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                            <label for="this-score-dex-is-prof">0</label>
                                            <input type="checkbox" id="this-score-dex-is-prof"
                                                   name="this-score-dex-is-prof"
                                                   class="form-control form-check-input this-role-form-field b-0 position-absolute ms-9 score-prof"/>
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Dexterity-->
                                </div>
                                <!--end::Col-->
                                <!--begin::Col-->
                                <div class="flex-column justify-content-end align-items-center">
                                    <!--begin::Constitution-->
                                    <div class="flex-column align-items-center justify-content-start position-relative w-70px h-100px">
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                            <button type="button" class="btn p-0 combat-item_title text-hover-primary">
                                                CONSTITUTION
                                            </button>
                                            <label for="this-score-con" class="fs-3">0</label>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                            <input type="text" id="this-score-con" name="this-score-con" value="10"
                                                   class="combat-item_content this-score this-role-form-field"/>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                            <label for="this-score-con-is-prof">0</label>
                                            <input type="checkbox" id="this-score-con-is-prof"
                                                   name="this-score-con-is-prof"
                                                   class="form-control form-check-input this-role-form-field b-0 position-absolute ms-9 score-prof"/>
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Constitution-->
                                </div>
                                <!--end::Col-->
                                <!--begin::Col-->
                                <div class="flex-column justify-content-start align-items-center">
                                    <!--begin::Intelligence-->
                                    <div class="flex-column align-items-center justify-content-start position-relative w-70px h-100px">
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                            <button type="button" class="btn p-0 combat-item_title text-hover-primary">
                                                INTELLIGENCE
                                            </button>
                                            <label for="this-score-int" class="fs-3">0</label>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                            <input type="text" id="this-score-int" name="this-score-int" value="10"
                                                   class="combat-item_content this-score this-role-form-field"/>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                            <label for="this-score-int-is-prof">0</label>
                                            <input type="checkbox" id="this-score-int-is-prof"
                                                   name="this-score-int-is-prof"
                                                   class="form-control form-check-input this-role-form-field b-0 position-absolute ms-9 score-prof"/>
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Intelligence-->
                                </div>
                                <!--end::Col-->
                                <!--begin::Col-->
                                <div class="flex-column justify-content-end align-items-center">
                                    <!--begin::Wisdom-->
                                    <div class="flex-column align-items-center justify-content-start position-relative w-70px h-100px">
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                            <button type="button" class="btn p-0 combat-item_title text-hover-primary">
                                                WISDOM
                                            </button>
                                            <label for="this-score-wis" class="fs-3">0</label>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                            <input type="text" id="this-score-wis" name="this-score-wis" value="10"
                                                   class="combat-item_content this-score this-role-form-field"/>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                            <label for="this-score-wis-is-prof">0</label>
                                            <input type="checkbox" id="this-score-wis-is-prof"
                                                   name="this-score-wis-is-prof"
                                                   class="form-control form-check-input this-role-form-field b-0 position-absolute ms-9 score-prof"/>
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Wisdom-->
                                </div>
                                <!--end::Col-->
                                <!--begin::Col-->
                                <div class="flex-column justify-content-start align-items-center">
                                    <!--begin::Charisma-->
                                    <div class="flex-column align-items-center justify-content-start position-relative w-70px h-100px">
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                            <button type="button" class="btn p-0 combat-item_title text-hover-primary">
                                                CHARISMA
                                            </button>
                                            <label for="this-score-cha" class="fs-3">0</label>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                            <input type="text" id="this-score-cha" name="this-score-cha" value="10"
                                                   class="combat-item_content this-score this-role-form-field"/>
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row-->
                                        <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                            <label for="this-score-cha-is-prof">0</label>
                                            <input type="checkbox" id="this-score-cha-is-prof"
                                                   name="this-score-cha-is-prof"
                                                   class="form-control form-check-input this-role-form-field b-0 position-absolute ms-9 score-prof"/>
                                        </div>
                                        <!--end::Row-->
                                    </div>
                                    <!--end::Charisma-->
                                </div>
                                <!--end::Col-->
                            </div>
                        </div>
                        <!--end::Ability scores-->
                        <!--begin::Skills-->
                        <div class="column this-outline" style="width: 135px;">
                            <div class="fs-3 p-3 w-100">Skill Proficiencies</div>
                            <div class="flex-column justify-content-start align-items-start p-3">
                                <!--begin::Arcana-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="arcana" name="arcana"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="arcana" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Arcana
                                    </label>
                                </div>
                                <!--end::Arcana-->
                                <!--begin::Acrobatics-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="acrobatics" name="acrobatics"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="acrobatics" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Acrobatics
                                    </label>
                                </div>
                                <!--end::Acrobatics-->
                                <!--begin::Athletics-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="athletics" name="athletics"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="athletics" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Athletics
                                    </label>
                                </div>
                                <!--end::Athletics-->
                                <!--begin::Deception-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="deception" name="deception"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="deception" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Deception
                                    </label>
                                </div>
                                <!--end::Deception-->
                                <!--begin::Insight-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="insight" name="insight"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="insight" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Insight
                                    </label>
                                </div>
                                <!--end::Insight-->
                                <!--begin::Intimidation-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="intimidation" name="intimidation"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="intimidation" type="button"
                                           class="btn p-0 text-hover-primary fs-8 skill">
                                        Intimidation
                                    </label>
                                </div>
                                <!--end::Intimidation-->
                                <!--begin::Investigation-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="investigation" name="investigation"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="investigation" type="button"
                                           class="btn p-0 text-hover-primary fs-8 skill">
                                        Investigation
                                    </label>
                                </div>
                                <!--end::Investigation-->
                                <!--begin::History-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="history" name="history"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="history" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        History
                                    </label>
                                </div>
                                <!--end::History-->
                                <!--begin::Medicine-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="medicine" name="medicine"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="medicine" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Medicine
                                    </label>
                                </div>
                                <!--end::Medicine-->
                                <!--begin::Nature-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="nature" name="nature"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="nature" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Nature
                                    </label>
                                </div>
                                <!--end::Nature-->
                                <!--begin::Perception-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="perception" name="perception"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="perception" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Perception
                                    </label>
                                </div>
                                <!--end::Perception-->
                                <!--begin::Performance-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="performance" name="performance"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="performance" type="button"
                                           class="btn p-0 text-hover-primary fs-8 skill">
                                        Performance
                                    </label>
                                </div>
                                <!--end::Performance-->
                                <!--begin::Persuasion-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="persuasion" name="persuasion"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="persuasion" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Persuasion
                                    </label>
                                </div>
                                <!--end::Persuasion-->
                                <!--begin::Religion-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="religion" name="religion"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="religion" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Religion
                                    </label>
                                </div>
                                <!--end::Religion-->
                                <!--begin::Sleight of Hand-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="sleight_of_hand" name="sleight_of_hand"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="sleight_of_hand" type="button"
                                           class="btn p-0 text-hover-primary fs-8 skill">
                                        Sleight of Hand
                                    </label>
                                </div>
                                <!--end::Sleight of Hand-->
                                <!--begin::Stealth-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="stealth" name="stealth"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="stealth" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Stealth
                                    </label>
                                </div>
                                <!--end::Stealth-->
                                <!--begin::Survival-->
                                <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                    <input type="checkbox" id="survival" name="survival"
                                           class="form-control form-check-input skill-prof this-role-form-field"/>
                                    <label for="survival" type="button" class="btn p-0 text-hover-primary fs-8 skill">
                                        Survival
                                    </label>
                                </div>
                                <!--end::Survival-->
                            </div>
                        </div>
                        <!--end::Skills-->
                        <!--begin::Health & Conditions-->
                        <div class="column this-outline w-300px">
                            <div class="flex-column w-300px justify-content-center align-items-center gap-3">
                                <div class="fs-3 p-3 w-100">Health</div>
                                <!--begin::Hit Points-->
                                <div class="position-relative w-180px h-125px p-3">
                                    <div class="hit_points this-outline">
                                        <input type="text" id="cur_hp" name="cur_hp" value="50"
                                               class="combat-item_content this-hp this-role-form-field w-50 fs-1"/>
                                        <label for="cur_hp" class="fs-8">CURRENT HIT POINTS</label>
                                    </div>
                                    <div class="hit_points hit_points-sm this-outline start-0">
                                        <input type="text" id="total_hp" name="total_hp" value="50"
                                               class="combat-item_content this-hp this-role-form-field w-75 fs-6"/>
                                        <label for="total_hp">TOTAL HIT POINTS</label>
                                    </div>
                                    <div class="hit_points hit_points-sm this-outline end-0">
                                        <input type="text" id="temp_hp" name="temp_hp" value="0"
                                               class="combat-item_content this-hp this-role-form-field w-75 fs-6"/>
                                        <label for="temp_hp">TEMPORARY HIT POINTS</label>
                                    </div>
                                </div>
                                <!--end::Hit Points-->
                                <!--begin::Exhaustion-->
                                <div class="flex-row row-cols-3 justify-content-center align-items-center w-200px gap-3">
                                    <div class="flex-row row-cols-3 justify-content-center align-items-center form-control-solid form-check p-0 gap-2">
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                    </div>
                                    <div class="fs-8 fw-bolder col-5">EXHAUSTION</div>
                                    <div class="flex-row row-cols-3 justify-content-center align-items-center form-control-solid form-check p-0 gap-2">
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                    </div>
                                </div>
                                <!--end::Exhaustion-->
                                <!--begin::Death Saves-->
                                <div class="flex-row row-cols-3 justify-content-center align-items-center w-200px gap-3">
                                    <div class="flex-row row-cols-3 justify-content-center align-items-center form-control-solid form-check p-0 gap-2">
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                    </div>
                                    <div class="fs-8 fw-bolder col-5">DEATH SAVES</div>
                                    <div class="flex-row row-cols-3 justify-content-center align-items-center form-control-solid form-check p-0 gap-2">
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                        <input type="checkbox" id="" name="" value=""
                                               class="form-control form-check-input skill-prof this-role-form-field m-0"/>
                                    </div>
                                </div>
                                <!--end::Death Saves-->
                                <div class="fs-3 p-3 w-100">Conditions</div>
                                <!--begin::Conditions-->
                                <div class="flex-row row-cols-2 w-180px mb-5">
                                    <div class="column">
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                    </div>
                                    <div class="column">
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                        <!--begin::Blinded-->
                                        <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                            <input type="checkbox" id="blinded" name="blinded"
                                                   class="form-control form-check-input skill-prof this-role-form-field"/>
                                            <label for="blinded" type="button"
                                                   class="btn p-0 text-hover-primary fs-8 skill">
                                                Blinded
                                            </label>
                                        </div>
                                        <!--end::Blinded-->
                                    </div>
                                </div>
                                <!--end::Conditions-->
                            </div>
                        </div>
                        <!--begin::Health & Conditions-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <div class="flex-row gap-3 row-cols-2 w-100">
                        <!--begin::Attacks & Spells-->
                        <div class="column this-outline">
                            <!--begin::Title-->
                            <div class="flex-row justify-content-between align-items-center w-100">
                                <label for="" class="fs-3 p-3">Attacks & Spells</label>
                                <button class="btn btn-sm" id="">
                                    <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                </button>
                            </div>
                            <!--end::Title-->
                            <!--begin::Table-->
                            <table id="attacks_spells-table" class="table dataTable fs-8 p-3">
                                <thead class="text-gray-700 fw-bolder text-capitalize border-bottom border-gray-300">
                                <tr>
                                    <th>NAME</th>
                                    <th>ATTACK</th>
                                    <th>DAMAGE & TYPE</th>
                                    <th>SAVING THROW</th>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            <!--end::Table-->
                        </div>
                        <!--end::Attacks & Spells-->
                        <!--begin::Row-->
                        <div class="flex-column gap-3">
                            <!--begin::Global Modifiers-->
                            <div class="column this-outline">
                                <!--begin::Title-->
                                <div class="flex-row justify-content-between align-items-center w-100">
                                    <label for="" class="fs-3 p-3">Global Modifiers</label>
                                    <button class="btn btn-sm" id="">
                                        <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                    </button>
                                </div>
                                <!--end::Title-->
                                <!--begin::Table-->
                                <table id="global_modifiers-table" class="table dataTable fs-8 p-3">
                                    <thead class="text-gray-700 fw-bolder text-capitalize border-bottom border-gray-300">
                                    <tr>
                                        <th class="col-4">NAME</th>
                                        <th>ATTACK</th>
                                        <th>DAMAGE</th>
                                        <th>SAVE</th>
                                        <th>CA</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                <!--end::Table-->
                            </div>
                            <!--end::Global Modifiers-->
                            <!--begin::Tools & Custom Skills-->
                            <div class="column this-outline">
                                <!--begin::Title-->
                                <div class="flex-row justify-content-between align-items-center w-100">
                                    <label for="" class="fs-3 p-3">Tools & Custom Skills</label>
                                    <button class="btn btn-sm" id="">
                                        <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                    </button>
                                </div>
                                <!--end::Title-->
                                <!--begin::Table-->
                                <table id="tools_custom-table" class="table dataTable fs-8 p-3">
                                    <thead class="text-gray-700 fw-bolder text-capitalize border-bottom border-gray-300">
                                    <tr>
                                        <th class="col-4">TOOL</th>
                                        <th>PROFICIENCY</th>
                                        <th>ATTRIBUTE</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                <!--end::Table-->
                            </div>
                            <!--end::Tools & Custom Skills-->
                        </div>
                        <!--end::Row-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <div class="flex-row gap-3 row-cols-2 w-100">
                        <!--begin::Bag-->
                        <div class="column this-outline">
                            <!--begin::Title-->
                            <div class="flex-row justify-content-between align-items-center w-100">
                                <label for="" class="fs-3 p-3">Bag</label>
                                <button class="btn btn-sm" id="">
                                    <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                </button>
                            </div>
                            <!--end::Title-->
                            <!--begin::Table-->
                            <table id="tools_custom-table" class="table dataTable fs-8 px-3">
                                <thead class="text-gray-700 fw-bolder text-capitalize border-bottom border-gray-300">
                                <tr>
                                    <th class="col-2">UNITS</th>
                                    <th class="col-8">ITEM NAME</th>
                                    <th class="col-3 p-0">WEIGHT</th>
                                </tr>
                                </thead>
                                <tbody class="py-1">
                                <tr>
                                    <td class="form-control-solid flex-row">
                                        <input type="number" id="" value="0"
                                               class="form-control this-role-form-field text-center"/>
                                        <label for=""></label>
                                    </td>
                                    <td>
                                        <input type="text" id="" value="Dragon Egg"
                                               class="form-control this-role-form-field"/>
                                    </td>
                                    <td class="text-center form-control-solid flex-row p-0">
                                        <input type="number" id="" class="form-control this-role-form-field w-75">
                                        <label for="">kg</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="form-control-solid flex-row">
                                        <input type="number" id="" value="0"
                                               class="form-control this-role-form-field text-center"/>
                                        <label for=""></label>
                                    </td>
                                    <td>
                                        <input type="text" id="" value="Dragon Egg"
                                               class="form-control this-role-form-field"/>
                                    </td>
                                    <td class="text-center form-control-solid flex-row p-0">
                                        <input type="number" id="" class="form-control this-role-form-field w-75">
                                        <label for="">kg</label>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <!--end::Table-->
                            <!--begin::Footer-->
                            <div class="border-top border-1 border-gray-300 p-3 fs-8 text-gray-700 fw-bolder text-capitalize">
                                <div class="flex-row align-items-center justify-content-between w-100">
                                    <div>TOTAL WEIGHT</div>
                                    <div class="col-2 ps-5 text-center">0kg</div>
                                </div>
                                <div class="flex-row align-items-center justify-content-between w-100">
                                    <div>OVERWEIGHT</div>
                                    <div class="col-2 ps-5 text-center">0kg</div>
                                </div>
                            </div>
                            <!--end::Footer-->
                        </div>
                        <!--end::Bag-->
                        <!--begin::Other Features-->
                        <div class="column this-outline" style="overflow-y: scroll">
                            <!--begin::Title-->
                            <div class="flex-row justify-content-between align-items-center w-100">
                                <label for="" class="fs-3 p-3">
                                    Other Features</label>
                                <button class="btn btn-sm" id="">
                                    <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                </button>
                            </div>
                            <!--end::Title-->
                            <!--begin::Table-->
                            <table></table>
                            <!--end::Table-->
                        </div>
                        <!--end::Other Features-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <div class="flex-row gap-3 row-cols-2 w-100">
                        <!--begin::Treasures & Notes-->
                        <div class="column this-outline" style="overflow-y: scroll">
                            <label for="notes" class="fs-3 p-3 border-bottom border-1 border-gray-300 w-100">
                                Treasures, Notes & Alliances</label>
                            <div class="p-3">
                    <textarea rows="10" id="notes" name="notes" style="resize: none;"
                              class="w-100 form-control this-role-form-field border-0"></textarea>
                            </div>
                        </div>
                        <!--end::Treasures & Notes-->
                        <!--begin::Backstory-->
                        <div class="column this-outline">
                            <label for="backstory" class="fs-3 p-3 border-bottom border-1 border-gray-300 w-100">
                                Backstory</label>
                            <div class="p-3">
                    <textarea rows="10" id="backstory" name="backstory" style="resize: none;"
                              class="w-100 form-control this-role-form-field border-0"></textarea>
                            </div>
                        </div>
                        <!--end::Backstory-->
                    </div>
                    <!--end::Row-->
                </div>
            </div>
            <!--end::Character content-->
            <!--begin::Spells content-->
            <div id="draggable_<?= $sheet['item_id'] ?>-spells" class="py-8 px-2 tab-pane fade"></div>
            <!--end::Spells content-->

        </div>
    </div>
<?php } ?>