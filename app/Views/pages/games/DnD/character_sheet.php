<?php if (isset($data)) {
    $info = json_decode($data['info'], true);
    $xp = $data['xp'];
    $scores = json_decode($data['ability_scores'], true);
    $skill_proficiencies = json_decode($data['skill_proficiencies'], true);
    $health = json_decode($data['health'], true);
    $attacks = $data['attacks'];
    $global_modifiers = $data['global_modifiers'];
    $tools = $data['tools_n_custom'];
    $bag = $data['bag'];
    $custom_features = $data['custom_features'];
    $notes = $data['notes'];
    $backstory = $data['backstory'];
    ?>

    <div class="draggable_close">
        <!--begin::Draggable item-->
        <div id="draggable_<?= $data['item_id'] ?>" class="journal_item_modal show">
            <div class="modal-content bg-white">
                <div class="modal-header flex-row-wrap justify-content-between align-items-center cursor-move">
                    <div class="h6" data-from="item_name">
                        <!--Autofill-->
                    </div>
                    <div class="flex-row-wrap gap-5 align-items-end justify-content-end align-self-start">
                        <button type="button" class="btn p-0 max-btn text-hover-dark d-none">
                            <i class="fa-solid fa-window-maximize fs-3"></i>
                        </button>
                        <button type="button" class="btn p-0 min-btn text-hover-dark">
                            <i class="fa-solid fa-window-minimize fs-3"></i>
                        </button>
                        <button type="button" value="<?= $data['item_id'] ?? "" ?>"
                                class="btn p-0 close_item-btn text-hover-dark">
                            <i class="fa-solid fa-close fs-1"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="flex-column align-content-start align-items-start justify-content-start tab-content">
                        <!--begin::Tabs-->
                        <ul class="nav nav-tabs w-100 pt-2 justify-content-start fs-7">
                            <li class="nav-item">
                                <a class="nav-link py-2 px-3 active" data-bs-toggle="tab"
                                   href="#draggable_<?= $data['item_id'] ?? "" ?>-character">
                                    <i class="fa fa-dice f-lg text-this-role-light"></i>
                                    <span>Character</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link py-2 px-3" data-bs-toggle="tab"
                                   href="#draggable_<?= $data['item_id'] ?? "" ?>-atks_modifiers">
                                    <i class="fa fa-dragon f-lg text-this-role-light"></i>
                                    <span>Bag, Attacks & Modifiers</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link py-2 px-3" data-bs-toggle="tab"
                                   href="#draggable_<?= $data['item_id'] ?? "" ?>-backstory_notes">
                                    <i class="fa fa-book f-lg text-this-role-light"></i>
                                    <span>Backstory & Notes</span>
                                </a>
                            </li>
                        </ul>
                        <!--end::Tabs-->
                        <!--begin::Character content-->
                        <div id="draggable_<?= $data['item_id'] ?? "" ?>-character"
                             class="py-8 px-2 tab-pane fade show active">
                            <div class="flex-row-wrap gap-5 justify-content-start align-items-stretch">
                                <!--begin::Basic info-->
                                <div class="column this-outline">
                                    <div class="flex-column justify-content-between align-items-center gap-6 p-4 h-100">
                                        <!--begin::Row-->
                                        <div class="flex-row-wrap justify-content-center align-items-stretch gap-12">
                                            <!--begin::Col-->
                                            <div class="flex-column gap-5 max-w-150px">
                                                <!--begin::Row (Character name)-->
                                                <div class="form-control-solid">
                                                    <div class="flex-column">
                                                        <input type="text" value="<?= $data['item_name'] ?? "" ?>"
                                                               id="item_name"
                                                               name="item_name"
                                                               class="form-control form-control-sm this-role-form-field ff-poiret fs-5 fw-boldest"/>
                                                        <label for="item_name">Character Name</label>
                                                    </div>
                                                </div>
                                                <!--end::Row (Character name)-->
                                                <!--begin::Row (Avatar)-->
                                                <div class="avatar-container">
                                                    <div class="d-flex flex-column align-items-center">
                                                        <div class="symbol icon-hover symbol-125px symbol-xl-150px circle position-relative">
                                                            <div class="d-flex justify-content-center align-items-center icon-hover-label position-absolute top-0 left-0">
                                                                <label for="<?= $data['item_id'] ?? ""; ?>-item_icon"
                                                                       class="btn btn-sm btn-link fs-7 p-0">Change</label>
                                                            </div>
                                                            <input id="<?= $data['item_id'] ?? ""; ?>-item_icon"
                                                                   name="item_icon"
                                                                   type="file" class="d-none this-role-form-field"/>
                                                            <span class="symbol-label circle item_icon-holder"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end::Row (Avatar)-->
                                                <!--begin::Row-->
                                                <div class="flex-row gap-12 justify-content-end position-relative mt--50px">
                                                    <!--begin::Inspiration-->
                                                    <div class="this-double-outline combat-item inspiration cursor-pointer bg-white circle">
                                                        <div class="flex-column justify-content-center align-items-center gap-2">
                                                            <button type="button" name="inspiration" id="inspiration"
                                                                    class="symbol symbol-25px btn p-0 circle bg-transparent">
                                                                <span class="symbol-label bg-transparent"></span>
                                                            </button>
                                                            <label for="inspiration"
                                                                   class="combat-item_title">INSPIRATION</label>
                                                        </div>
                                                    </div>
                                                    <!--end::Inspiration-->
                                                </div>
                                                <!--end::Col-->
                                            </div>
                                            <!--end::Col-->
                                            <!--begin::Col (Character Origin Details)-->
                                            <div class="flex-column justify-content-start align-items-stretch max-w-200px">
                                                <!--begin::Row-->
                                                <div class="row justify-content-evenly">
                                                    <!--begin::Row Class-->
                                                    <div class="flex-row form-control-solid mb-5">
                                                        <label for="class">Class</label>
                                                        <input type="text" name="class"
                                                               placeholder="Warlock"
                                                               id="" value=""
                                                               class="form-control this-role-form-field ms-3"/>
                                                    </div>
                                                    <!--end::Row Class-->
                                                    <!--begin::Row Subclass-->
                                                    <div class="flex-row form-control-solid mb-5">
                                                        <label for="">Subclass</label>
                                                        <input type="text" name="subclass"
                                                               placeholder="Circle of Hellfire"
                                                               id="" value=""
                                                               class="form-control this-role-form-field ms-3"/>
                                                    </div>
                                                    <!--end::Row Subclass-->
                                                    <!--begin::Row Level-->
                                                    <div class="flex-row form-control-solid mb-5">
                                                        <label for="lvl">Level</label>
                                                        <input type="number" id="lvl" name="lvl" value="1"
                                                               style="width: 40px;" placeholder="1"
                                                               class="form-control this-role-form-field ms-3"/>
                                                    </div>
                                                    <!--end::Row Level-->
                                                    <!--begin::Row Race-->
                                                    <div class="flex-row form-control-solid mb-5">
                                                        <label for="race">Race</label>
                                                        <input type="text" id="race" name="race"
                                                               value="<?= $info['race'] ?? "" ?>"
                                                               class="form-control this-role-form-field ms-3"/>
                                                    </div>
                                                    <!--end::Row Race-->
                                                    <!--begin::Row Background-->
                                                    <div class="flex-row form-control-solid mb-5">
                                                        <label for="background">Background</label>
                                                        <input type="text" id="background" name="background"
                                                               value="<?= $info['background'] ?? '' ?>"
                                                               class="form-control this-role-form-field ms-3"/>
                                                    </div>
                                                    <!--end::Row Background-->
                                                    <!--begin::Row XP-->
                                                    <div class="flex-row form-control-solid mb-5">
                                                        <div class="flex-row form-control-solid">
                                                            <label for="xp">XP</label>
                                                            <input type="number" id="xp" name="xp"
                                                                   value="<?= $data['xp'] ?? '0' ?>"
                                                                   class="form-control this-role-form-field ms-3"/>
                                                        </div>
                                                    </div>
                                                    <!--end::Row XP-->
                                                </div>
                                                <!--end::Row-->
                                            </div>
                                            <!--end::Col (Character Origin Details)-->
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row Spellcasting modifiers-->
                                        <div class="flex-row-wrap justify-content-center align-items-center gap-3 my-3">
                                            <!--begin::Select spellcasting modifier-->
                                            <div class="form-control-solid flex-column gap-3">
                                                <select id="spellcasting_ability" name="spellcasting"
                                                        class="this-outline form-select form-select-sm">
                                                    <option value="none">None</option>
                                                    <?php foreach ($scores as $short => $score) { ?>
                                                        <option value="<?= $short; ?>"><?= ucfirst($score['fname']); ?></option>
                                                    <?php } ?>
                                                </select>
                                                <label for="spellcasting_ability" class="combat-item_title">
                                                    SPELLCASTING ABILITY</label>
                                            </div>
                                            <div class="flex-row justify-content-center align-items-center">
                                                <div class="flex-column justify-content-center align-items-center gap-3">
                                                <span type="text" id="spell_save_dc"
                                                      class="combat-item_content py-2 px-3 this-outline">+0</span>
                                                    <label for="spell_save_dc" class="combat-item_title">
                                                        SPELL SAVE DC</label>
                                                </div>
                                                <div class="flex-column justify-content-center align-items-center gap-3">
                                                <span type="text" id="spell_atk_bonus"
                                                      class="combat-item_content py-2 px-3 this-outline">+0</span>
                                                    <label for="spell_atk_bonus" class="combat-item_title">
                                                        SPELL ATK BONUS</label>
                                                </div>
                                            </div>
                                        </div>
                                        <!--end::Row Spellcasting modifiers-->
                                        <!--begin::Row - Combat (general)-->
                                        <div class="flex-row-wrap justify-content-center align-items-center gap-3 mt-3 mb-6">
                                            <div class="flex-row justify-content-center align-items-center gap-3">
                                                <!--begin::Class Armor (CA)-->
                                                <div class="this-ca combat-item">
                                                    <div class="flex-column justify-content-center align-items-center">
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
                                                    <div class="flex-column justify-content-center align-items-center">
                                                    <span type="text" data-from="this_init"
                                                          class="combat-item_content">+0</span>
                                                        <input type="text" id="this_init" name="this_init"
                                                               class="d-none this-role-form-field"/>
                                                        <label for="this_init"
                                                               class="combat-item_title cursor-pointer text-hover-primary">
                                                            INITIATIVE
                                                        </label>
                                                    </div>
                                                </div>
                                                <!--end::Initiative bonus-->
                                            </div>
                                            <div class="flex-row justify-content-center align-items-center gap-3">
                                                <!--begin::Speed-->
                                                <div class="this-outline combat-item">
                                                    <div class="flex-column justify-content-center align-items-center">
                                                        <input type="text" id="walkspeed" name="walkspeed"
                                                               value="<?= $info['walkspeed'] ?? "0" ?>"
                                                               class="combat-item_content this-role-form-field"/>
                                                        <label for="walkspeed" class="combat-item_title">WALK
                                                            SPEED</label>
                                                    </div>
                                                </div>
                                                <!--end::Speed-->
                                                <!--begin::Proficiency bonus-->
                                                <div class="this-outline combat-item">
                                                    <div class="flex-column justify-content-center align-items-center">
                                                <span type="text" class="combat-item_content">
                                                    +<span data-from="this-prof">+0</span>
                                                </span>
                                                        <input type="text" id="this-prof" name="this-prof" value="0"
                                                               class="d-none this-role-form-field"/>
                                                        <label for="this-prof" class="combat-item_title">PROF</label>
                                                    </div>
                                                </div>
                                                <!--end::Proficiency bonus-->
                                            </div>
                                        </div>
                                        <!--end::Row - Combat (general)-->
                                    </div>
                                </div>
                                <!--end::Basic info-->
                                <!--begin::Ability Scores-->
                                <div class="column this-outline p-3">
                                    <!--begin::Title-->
                                    <div class="fs-3 p-3 w-100">Ability Scores<br/>& Saving Throws</div>
                                    <!--end::Title-->
                                    <div class="flex-row-wrap justify-content-center">
                                        <!--begin::Ability scores-->
                                        <div class="flex-column justify-content-between p-3 scores-container">
                                            <div class="flex-row-wrap max-w-200px">
                                                <?php foreach ($scores as $short => $score) { ?>
                                                    <!--begin::Col-->
                                                    <div class="flex-column justify-content-end align-items-center">
                                                        <!--begin::Strength-->
                                                        <div class="flex-column align-items-center justify-content-start position-relative w-90px h-120px">
                                                            <!--begin::Row-->
                                                            <div class="this-outline combat-item flex-column align-items-center justify-content-center position-absolute top-15px">
                                                                <button type="button"
                                                                        class="btn p-0 combat-item_title text-hover-primary">
                                                                    <?= strtoupper($score['fname']); // Name in CAPS                                                                                                                                                              ?>
                                                                </button>
                                                                <label for="this_score_<?= $short; ?>"
                                                                       class="fs-3">0</label>
                                                            </div>
                                                            <!--end::Row-->
                                                            <!--begin::Row-->
                                                            <div class="this-outline combat-item combat-item-sm position-absolute top-0 bg-white">
                                                                <input type="text" id="this_score_<?= $short; ?>"
                                                                       name="this_score_<?= $short; ?>"
                                                                       value="10"
                                                                       class="combat-item_content this-score this-role-form-field"/>
                                                            </div>
                                                            <!--end::Row-->
                                                            <!--begin::Row-->
                                                            <div class="this-outline form-control-solid form-check combat-item combat-item-sm flex-column align-items-center justify-content-center gap-3 position-absolute top-65px bg-white">
                                                                <label for="this_prof_<?= $short; ?>"
                                                                       class="me-3">+0</label>
                                                                <input type="checkbox" id="this_prof_<?= $short; ?>"
                                                                       name="this_prof_<?= $short; ?>"
                                                                       class="form-control form-check-input b-0 position-absolute ms-9 score_prof"/>
                                                            </div>
                                                            <!--end::Row-->
                                                            <!--begin::Row (Saving Throw Button)-->
                                                            <button type="button" name="this_save_<?= $short; ?>"
                                                                    class="btn p-0 combat-item_title text-hover-primary position-absolute top-90px bg-white this-role-form-field">
                                                                SAVING THROW +0
                                                            </button>
                                                            <!--begin::Row (Saving Throw Button)-->
                                                        </div>
                                                        <!--end::Strength-->
                                                    </div>
                                                    <!--end::Col-->
                                                <?php } ?>
                                            </div>
                                        </div>
                                        <!--end::Ability scores-->
                                    </div>
                                </div>
                                <!--end::Ability Scores-->
                                <!--begin::Skills-->
                                <div class="column flex-column justify-content-between this-outline p-3">
                                    <!--begin::Row - Skill Proficiencies-->
                                    <div class="flex-column justify-content-between p-3 pt-0">
                                        <!--begin::Row - Title-->
                                        <div class="fs-3 p-3 ps-0 w-100">Skill Proficiencies</div>
                                        <!--end::Row - Title-->
                                        <?php foreach ($skill_proficiencies as $skill_name => $skill_details) {
                                            $name = strtolower($skill_name);
                                            $title = strtosentence(get_title($skill_name));
                                            ?>
                                            <!--begin::<?= $title; ?>-->
                                            <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                                <input type="checkbox" id="this_skill_<?= $name ?>"
                                                       name="this_skill_<?= $name ?>"
                                                       class="form-control form-check-input skill_prof"/>
                                                <button type="button"
                                                        class="btn p-0 text-hover-primary fs-8 <?= $name ?>">
                                                    <?= $title ?>
                                                </button>
                                            </div>
                                            <!--end::<?= $title; ?>-->
                                        <?php } ?>
                                    </div>
                                    <!--end::Row - Skill Proficiencies-->
                                    <!--begin::Row - Info Legend-->
                                    <div class="flex-row justify-content-between p-3">
                                    <span class="badge badge-primary text-uppercase fs-9">
                                        PROFICIENCY
                                    </span>
                                        <span class="badge badge-ocher text-uppercase fs-9">
                                        EXPERTISE
                                    </span>
                                    </div>
                                    <!--end::Row - Info Legend-->
                                </div>
                                <!--end::Skills-->
                                <!--begin::Health & Conditions-->
                                <div class="column this-outline p-3">
                                    <div class="flex-column justify-content-center align-items-center gap-3">
                                        <div class="fs-3 p-3 pb-0 w-100">Health</div>
                                        <!--begin::Row - Hit Points-->
                                        <div class="position-relative w-180px h-125px p-3">
                                            <div class="hit_points this-outline flex-column justify-content-start">
                                                <input type="text" id="cur_hp" name="cur_hp" value="0"
                                                       class="combat-item_content this-hp this-role-form-field w-50 fs-2"/>
                                                <label for="cur_hp" class="fs-8">CURRENT HIT POINTS</label>
                                            </div>
                                            <div class="flex-row gap-3">
                                                <div class="hit_points hit_points-sm this-outline start-0">
                                                    <input type="text" id="total_hp" name="total_hp" value="0"
                                                           class="combat-item_content this-hp this-role-form-field w-75 fs-6"/>
                                                    <label for="total_hp">TOTAL HIT POINTS</label>
                                                </div>
                                                <div class="hit_points hit_points-sm this-outline end-0">
                                                    <input type="text" id="temp_hp" name="temp_hp" value="0"
                                                           class="combat-item_content this-hp this-role-form-field w-75 fs-6"/>
                                                    <label for="temp_hp">TEMPORARY HIT POINTS</label>
                                                </div>
                                            </div>
                                        </div>
                                        <!--end::Row - Hit Points-->
                                        <!--begin::Row-->
                                        <div class="flex-row-wrap justify-content-evenly align-items-center">
                                            <!--begin::Col - Hit dices-->
                                            <div class="position-relative w-180px h-125px p-3">
                                                <div class="hit_points this-outline form-control-solid">
                                                    <div class="flex-column justify-content-center align-items-center">
                                                        <div class="this-outline bg-white flex-row justify-content-center align-items-center col-10 gap-1 position-relative mt--10px fs-8">
                                                            <span class="">Total</span>
                                                            <span class="total_hd" data-from="cur_hd">1</span>
                                                        </div>
                                                        <label for="cur_hd" class="fs-8">Current</label>
                                                        <input type="number" id="cur_hd" name="cur_hd" value="1"
                                                               class="combat-item_content this-hp this-role-form-field w-50 fs-4 ms-3"/>
                                                        <div class="flex-row w-100 gap-1 fs-8 this-outline bg-white position-relative mt-3">
                                                            <button type="button" name="this_hit_dice_btn"
                                                                    class="btn btn-sm p-0 text-hover-primary col-5">
                                                                Hit dice
                                                            </button>
                                                            <select id="" name="this_hit_dice"
                                                                    class="col-6 border-0 bg-transparent">
                                                                <?php $dices = ['1d6', '1d8', '1d10', '1d12'];
                                                                foreach ($dices as $dice) { ?>
                                                                    <option value="<?= substr($dice, 1); ?>"><?= $dice; ?></option>
                                                                <?php } ?>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--end::Col - Hit dices-->
                                            <!--begin::Col-->
                                            <div class="column">
                                                <!--begin::Row - Death Saves-->
                                                <div class="flex-column align-items-center justify-content-center gap-2 ms-3 fs-9">
                                                    <button type="button" name="death_saving_throw"
                                                            class="btn btn-sm p-0 text-hover-danger fs-9 fw-bolder">
                                                        DEATH SAVES
                                                    </button>
                                                    <div class="flex-row justify-content-between gap-3 text-center col-12">
                                                        <span class="text-uppercase">SUCCESSES</span>
                                                        <div class="flex-row gap-2">
                                                            <?php for ($i = 0; $i < 3; $i++) { ?>
                                                                <input type="checkbox" id=""
                                                                       name="this_death_save_successes"
                                                                       value="<?= $i + 1; ?>"
                                                                       class="form-control form-check-input death_saves success m-0 cursor-pointer"/>
                                                            <?php } ?>
                                                        </div>
                                                    </div>
                                                    <div class="flex-row justify-content-between gap-3 text-center col-12">
                                                        <span class="text-uppercase">FAILURES</span>
                                                        <div class="flex-row gap-2">
                                                            <?php for ($i = 0; $i < 3; $i++) { ?>
                                                                <input type="checkbox" id=""
                                                                       name="this_death_save_failures"
                                                                       value="<?= $i + 1; ?>"
                                                                       class="form-control form-check-input death_saves danger m-0 cursor-pointer"/>
                                                            <?php } ?>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end::Row - Death Saves-->
                                            </div>
                                            <!--end::Col-->
                                        </div>
                                        <!--end::Row-->
                                        <!--begin::Row - Exhaustion-->
                                        <div class="flex-column justify-content-center align-items-center text-start col-12">
                                            <div class="flex-row justify-content-center align-items-center form-control-solid form-check p-0 gap-1 col-12">
                                                <label for="this_exhaustion" class="fs-9 fw-bolder me-2">
                                                    EXHAUSTION
                                                </label>
                                                <?php for ($i = 0; $i < 6; $i++) { ?>
                                                    <input type="checkbox" id="this_exhaustion"
                                                           name="this_exhaustion" value="<?= $i + 1; ?>"
                                                           class="form-control form-check-input exhaustion <?= $i < 3 ? 'warning' : 'danger'; ?> m-0"/>
                                                <?php } ?>
                                            </div>
                                            <span class="ps-5 exhaustion_effects fs-8 col-12"></span>
                                        </div>
                                        <!--end::Row - Exhaustion-->
                                        <div class="fs-3 p-3 pb-0 w-100">Conditions</div>
                                        <!--begin::Conditions-->
                                        <div class="flex-row-wrap row-cols-2 mb-5 px-5">
                                            <?php foreach ($health['conditions'] as $n => $c) {
                                                if ($n !== 'exhaustion') { ?>
                                                    <!--begin::Blinded-->
                                                    <div class="flex-row align-items-center justify-content-start form-control-solid form-check gap-2">
                                                        <input type="checkbox" id="this_cond_<?= $n ?>"
                                                               name="this_cond_<?= $n ?>"
                                                               class="form-control form-check-input warning condition"/>
                                                        <label for="this_cond_<?= $n ?>" type="button"
                                                               class="btn p-0 text-hover-primary fs-8 skill">
                                                            <?= strtosentence($n); ?>
                                                        </label>
                                                    </div>
                                                    <!--end::Blinded-->
                                                <?php }
                                            } ?>
                                        </div>
                                        <!--end::Conditions-->
                                    </div>
                                </div>
                                <!--begin::Health & Conditions-->
                            </div>
                        </div>
                        <!--end::Character content-->
                        <!--begin::Spells & Attacks & Modifiers-->
                        <div id="draggable_<?= $data['item_id'] ?? "" ?>-atks_modifiers"
                             class="py-8 px-2 tab-pane fade w-100">
                            <div class="flex-row-wrap gap-5 justify-content-start align-items-stretch">
                                <!--begin::Bag-->
                                <div class="column this-outline p-3">
                                    <!--begin::Title-->
                                    <div class="flex-row justify-content-between align-items-center">
                                        <label for="" class="fs-3 p-3">Bag</label>
                                        <button class="btn btn-sm" id="bag_btn<?= $data['item_id']; ?>">
                                            <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                        </button>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Table-->
                                    <div id="bag_<?= $data['item_id']; ?>" data-kt-menu="true"
                                         class="menu menu-column menu-rounded fs-8 px-3 bag_table this_table">
                                    </div>
                                    <!--end::Table-->
                                    <!--begin::Footer-->
                                    <div class="px-3 fs-8 text-gray-700 fw-bolder text-capitalize mt-3">
                                        <div class="flex-row align-items-center justify-content-between">
                                            <div>TOTAL WEIGHT</div>
                                            <div class="ps-5 text-center">
                                                <span class="total_weight me-1"> 0 </span>lb
                                            </div>
                                        </div>
                                        <div class="flex-row align-items-center justify-content-between">
                                            <div>OVERWEIGHT</div>
                                            <div class="ps-5 text-center">
                                                <span class="overweight me-1"> 0 </span>lb
                                            </div>
                                        </div>
                                    </div>
                                    <!--end::Footer-->
                                </div>
                                <!--end::Bag-->
                                <!--begin::Attacks & Spells-->
                                <div class="column this-outline p-3">
                                    <!--begin::Title-->
                                    <div class="flex-row justify-content-between align-items-center w-100">
                                        <label for="" class="fs-3 p-3">Attacks & Spells</label>
                                        <button class="btn btn-sm" id="atk_spells_btn<?= $data['item_id']; ?>">
                                            <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                        </button>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Table-->
                                    <div id="attacks_<?= $data['item_id']; ?>" data-kt-menu="true"
                                         class="menu menu-column fs-8 px-3 attacks_spells_table this_table">
                                    </div>
                                    <!--end::Table-->
                                </div>
                                <!--end::Attacks & Spells-->
                                <!--begin::Global Modifiers-->
                                <div class="column this-outline p-3">
                                    <!--begin::Title-->
                                    <div class="flex-row justify-content-between align-items-center w-100">
                                        <label for="" class="fs-3 p-3">Global Modifiers</label>
                                        <button class="btn btn-sm" id="global_mods_btn<?= $data['item_id']; ?>">
                                            <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                        </button>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Table-->
                                    <div id="global_modifiers_<?= $data['item_id']; ?>" data-kt-menu="true"
                                         class="menu menu-column fs-8 px-3 global_modifiers_table this_table">
                                    </div>
                                    <!--end::Table-->
                                </div>
                                <!--end::Global Modifiers-->
                                <!--begin::Tools & Custom Skills-->
                                <div class="column this-outline p-3 d-none">
                                    <!--begin::Title-->
                                    <div class="flex-row justify-content-between align-items-center w-100">
                                        <label for="" class="fs-3 p-3">Tools & Custom Skills</label>
                                        <button class="btn btn-sm" id="tools_custskills_btn<?= $data['item_id']; ?>">
                                            <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                        </button>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Table-->
                                    <div id="tools_n_custom<?= $data['item_id']; ?>" data-kt-menu="true"
                                         class="menu menu-column fs-8 px-3 tools_custom_table this_table">
                                    </div>
                                    <!--end::Table-->
                                </div>
                                <!--end::Tools & Custom Skills-->
                                <!--begin::Other Features-->
                                <div class="column this-outline p-3">
                                    <!--begin::Title-->
                                    <div class="flex-row justify-content-between align-items-center w-100">
                                        <label for="" class="fs-3 p-3">
                                            Other Features</label>
                                        <button class="btn btn-sm" id="other_feats_btn<?= $data['item_id']; ?>">
                                            <i class="fa-solid fa-plus fa-xl text-dark"></i>
                                        </button>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Table-->
                                    <div id="custom_features_<?= $data['item_id']; ?>" data-kt-menu="true"
                                         class="menu menu-column fs-8 px-3 other_feats_table this_table">
                                    </div>
                                    <!--end::Table-->
                                </div>
                                <!--end::Other Features-->
                            </div>
                        </div>
                        <!--end::Spells & Attacks & Modifiers-->
                        <!--begin::Backstory & Notes content-->
                        <div id="draggable_<?= $data['item_id'] ?? "" ?>-backstory_notes"
                             class="py-8 px-2 tab-pane fade w-100">
                            <div class="flex-row-wrap gap-5 justify-content-start align-items-stretch">
                                <!--begin::Treasures & Notes-->
                                <div class="column this-outline p-3 w-100">
                                    <label for="notes" class="fs-3 p-3 border-bottom border-1 border-gray-300 w-100">
                                        Treasures, Notes & Alliances</label>
                                    <div class="p-3">
                                        <textarea rows="10" id="notes" name="notes"
                                                  class="w-100 form-control this-role-form-field border-0"></textarea>
                                    </div>
                                </div>
                                <!--end::Treasures & Notes-->
                                <!--begin::Backstory-->
                                <div class="column this-outline p-3 w-100">
                                    <label for="backstory"
                                           class="fs-3 p-3 border-bottom border-1 border-gray-300 w-100">
                                        Backstory</label>
                                    <div class="p-3">
                                        <textarea rows="10" id="backstory" name="backstory"
                                                  class="w-100 form-control this-role-form-field border-0"></textarea>
                                    </div>
                                </div>
                                <!--end::Backstory-->
                            </div>
                        </div>
                        <!--end::Backstory & Notes content-->
                    </div>
                </div>
            </div>
        </div>
        <!--end::Draggable item-->
    </div>

<?php } ?>