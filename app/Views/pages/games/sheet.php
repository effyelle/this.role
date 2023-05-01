<!--begin::Character content-->
<div id="draggable_1-character" class="py-8 px-2 tab-pane fade show active">
    <button value="10" name="item_id" id="item_id" class="d-none"></button>
    <div class="flex-row-wrap gap-5 justify-content-center align-items-center">
        <div class="column">
            <div class="flex-row-wrap this-outline justify-content-center mt-5 p-4 gap-5">
                <!--begin::Col-->
                <div class="flex-column justify-content-center gap-5">
                    <!--begin::Character name-->
                    <div class="form-control-solid">
                        <div class="flex-column">
                            <input type="text" value="Character name" id="item_title" name="item_title"
                                   class="form-control form-control-sm this-role-form-field ff-poiret fs-5 fw-boldest"/>
                            <label for="item_title">Character name</label>
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
                                            <label for="item_icon" class="btn btn-sm btn-link fs-7 p-0">Change</label>
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
                            <div class="flex-row-nowrap gap-12">
                                <!--begin::Inspiration-->
                                <div class="this-double-outline combat-item cursor-pointer circle">
                                    <div class="flex-column justify-content-center align-items-center gap-2">
                                        <div class="symbol symbol-25px">
                                            <button class="d-none" id="this-init" name="this-init" value="0"></button>
                                            <span class="symbol-label"
                                                  style="background: url(/assets/media/games/journal/insp.png); background-size:contain">
                                            </span>
                                        </div>
                                        <label for="this-init" class="combat-item_title">INSPIRATION</label>
                                    </div>
                                </div>
                                <!--end::Inspiration-->
                                <!--begin::Proficiency bonus-->
                                <div class="this-outline combat-item circle">
                                    <div class="flex-column justify-content-center align-items-center gap-2">
                                        <input type="text" id="this-profbonus" name="this-profbonus" value="0"
                                               class="combat-item_content form-control this-role-form-field"/>
                                        <label for="this-profbonus" class="combat-item_title">PROFICIENCY</label>
                                    </div>
                                </div>
                                <!--end::Proficiency bonus-->
                            </div>
                            <!--end::Col-->
                        </div>
                        <!--end::Col-->
                        <!--begin::Col-->
                        <div class="flex-column gap-12 justify-content-between max-w-500px">
                            <!--begin::Row-->
                            <div class="flex-column gap-3">
                                <!--begin::Character origin details (class, race, etc.)-->
                                <div class="flex-row-wrap justify-content-between row-cols-3">
                                    <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-4 pe-4">
                                        <label for="">Class</label>
                                        <select id="" name="" class="this-role-form-field ms-3">
                                            <option>Artificer</option>
                                            <option>Barbarian</option>
                                            <option>Bard</option>
                                            <option>Cleric</option>
                                            <option>Druid</option>
                                            <option>Fighter</option>
                                            <option>Monk</option>
                                            <option>Paladin</option>
                                            <option>Ranger</option>
                                            <option>Rogue</option>
                                            <option>Sorcerer</option>
                                            <option>Warlock</option>
                                            <option>Wizard</option>
                                        </select>
                                    </div>
                                    <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-5 px-4">
                                        <label for="">Subclass</label>
                                        <input type="text" id="" name="" value=""
                                               class="this-role-form-field ms-3 w-50"/>
                                    </div>
                                    <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-3 pe-4">
                                        <label for="">Level</label>
                                        <input type="text" id="" name="" value=""
                                               class="this-role-form-field ms-3 w-25"/>
                                    </div>
                                </div>
                                <div class="flex-row-wrap justify-content-between row-cols-3">
                                    <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-4 pe-4">
                                        <label for="">Race</label>
                                        <select id="" name="" class="this-role-form-field ms-3">
                                            <option>Dragonborn</option>
                                            <option>Dwarf</option>
                                            <option>Elf</option>
                                            <option>Gnome</option>
                                            <option>Half-Elf</option>
                                            <option>Half-Orc</option>
                                            <option>Halfling</option>
                                            <option>Human</option>
                                            <option>Tiefling</option>
                                        </select>
                                    </div>
                                    <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-5 pe-4">
                                        <label for="">Background</label>
                                        <input type="text" id="" name="" value=""
                                               class="this-role-form-field ms-3 w-50"/>
                                    </div>
                                    <div class="flex-row-wrap align-content-center justify-content-center align-items-end col-3 pe-4">
                                        <label for="">XP</label>
                                        <input type="text" id="" name="" value=""
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
                                            <input type="text" id="this-ca" value="13"
                                                   class="combat-item_content form-control this-role-form-field"/>
                                            <label for="this-ca" class="combat-item_title">CA</label>
                                        </div>
                                    </div>
                                    <!--end::Class Armor (CA)-->
                                    <!--begin::Initiative bonus-->
                                    <div class="this-outline combat-item">
                                        <div class="flex-column justify-content-center align-items-center gap-2">
                                            <input type="text" id="this-init" value="0"
                                                   class="combat-item_content form-control this-role-form-field"/>
                                            <label for="this-init" class="combat-item_title">INITIATIVE</label>
                                        </div>
                                    </div>
                                    <!--end::Initiative bonus-->
                                    <!--begin::Speed-->
                                    <div class="this-outline combat-item">
                                        <div class="flex-column justify-content-center align-items-center gap-2">
                                            <input type="text" id="this-walkspeed" name="this-walkspeed" value="0"
                                                   class="combat-item_content form-control this-role-form-field"/>
                                            <label for="this-walkspeed" class="combat-item_title">WALK SPEED</label>
                                        </div>
                                    </div>
                                    <!--end::Speed-->
                                    <!--begin::Hit dice-->
                                    <div class="this-outline combat-item">
                                        <div class="flex-column justify-content-center align-items-center gap-2">
                                            <input type="text" id="this-hitdice" name="this-hitdice" value="0"
                                                   class="combat-item_content form-control this-role-form-field"/>
                                            <label for="this-hitdice" class="combat-item_title">HIT DICE</label>
                                        </div>
                                    </div>
                                    <!--end::Hit dice-->
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
            <div class="flex-row-wrap this-outline justify-content-center mt-5 p-4 gap-5">asdasdasd
            </div>
        </div>
        <div class="column">
            <div class="flex-row-wrap this-outline justify-content-center mt-5 p-4 gap-5">asdasdasd
            </div>
            <div class="flex-row-wrap this-outline justify-content-center mt-5 p-4 gap-5">asdasdasd
            </div>
        </div>
    </div>
</div>
<!--end::Character content-->