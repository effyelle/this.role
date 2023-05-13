function initGame(dbGame, session) {

    // **************************** //
    // ****** begin::Journal ****** //
    // **************************** //

    // * Journal intance * //
    const journal = new Journal('journal', {
        ajax: {
            url: '/app/games_ajax/get_journal_items/' + dbGame.game_id, dataType: 'json',
        },
        sheetsContainer: 'draggable-modals_container',
        folder: '/assets/media/games/' + dbGame.game_folder + '/players/',
        onLoad: function (data) {
            // Create sheets in
            customSheets(data);
            // If journal item creation exists in html means user is creator
            if (q('#modal_journal-toggle').length > 0) {
                adminJournal(data);
            }

        },
        onError: function (e) {
            console.log(e);
            $('.modal_error_response').html(e);
            $('#modal_error-toggle').click();
        }
    });

    function adminJournal(data) {
        // * Fill creator admin settings journal part * //
        if (q('#change_item').length > 0) {
            loadAdminItems();
        }
        // * Check and uncheck edits * //
        if (q('#include_players').length > 0) {
            switchIncludePlayers();
            q('#item_type')[0].onchange = switchIncludePlayers;
        }
        // * Empty modal when add new journal item button is clicked * //
        q('#modal_journal-toggle').click(emptyJournalModal);
        // * Use modal to edit an item when clicked * //
        q('#edit_item-btn')[0].click(fillJournalModal);
        // * Add or edit journal item when save button clicked * //
        q('#save_journal_item-btn')[0].click(saveJournalItem);
        // * Delete item * //
        q('#delete_item-btn').click(function () {
            openConfirmation(deleteJournalItem);
        });
    }

    function loadAdminItems() {
        // Fill select
        let changeItem = q('#change_item')[0];
        if (journal.items.length > 0) {
            changeItem.innerHTML = '';
            for (let i in journal.items.list) {
                let item = journal.items.list[i].info;
                q('#change_item')[0].innerHTML += '<option value="' + item.item_id + '">' + item.item_name + '</option>';
            }
            return;
        }
        changeItem.innerHTML = '<option value="-1" disabled selected>No journal items available</option>';
    }

    function switchIncludePlayers() {
        let can_see = $('.can_see-can_edit .can_see');
        let can_edit = $('.can_see-can_edit .can_edit');
        switch (q('#item_type')[0].value) {
            case 'character':
                $('.player-can_see').prop('checked', false);
                can_see.hide();
                can_edit.show();
                break;
            case 'handout':
                $('.player-can_edit').prop('checked', false);
                can_edit.hide();
                can_see.show();
                break;
            default:
                can_see.hide();
                can_edit.hide();
        }
    }

    function emptyJournalModal() {
        $('#modal_journal .modal-header h4').html('Add Journal Item');
        q('#save_journal_item-btn')[0].value = "";
        $('#item_name').val("Character or Handout");
        $('#item_type option[value="character"]').prop('selected', true);
        $('#modal_journal input[type=checkbox]').prop('checked', false);
    }

    function fillJournalModal() {
        $('#modal_journal .modal-header h4').html('Edit Journal Item');
        let item = {};
        // Search for item
        for (let i in journal.items.list) {
            let itemHolder = journal.items.list[i].info;
            if (itemHolder.item_id === q('#change_item')[0].value) {
                item = itemHolder;
            }
        }
        // Return if item was not found
        if (!item || item === {}) return;
        // Put id into save button
        q('#save_journal_item-btn')[0].value = item.item_id;
        $('#item_name').val(item.item_name);
        $('#item_type option[value="' + item.item_type + '"]').prop('selected', true);
        switchIncludePlayers();
        if (q('.can_see-can_edit').length > 0) {
            let viewers = item.item_viewers;
            let editors = item.item_editors;
            for (let i = 0; i < q('.can_see-can_edit').length; i++) {
                let checked = false;
                let canSeeCheckbox = q('.player-can_see')[i];
                let canEditCheckbox = q('.player-can_edit')[i];
                // Reset checkboxes
                canSeeCheckbox.checked = checked;
                canEditCheckbox.checked = checked;
                if (viewers) {
                    for (let v of viewers) {
                        if (v == canSeeCheckbox.id.charAt(0)) checked = true;
                    }
                    canSeeCheckbox.checked = checked;
                }
                checked = false;
                if (editors) {
                    for (let e of editors) {
                        if (e == canEditCheckbox.id.charAt(0)) checked = true;
                    }
                    canEditCheckbox.checked = checked;
                }
            }
        }
        //$('#modal_journal input').prop('checked', false);
    }

    function customSheets(data) {
        // Data received is all items for this game,
        // which is what we asked for through AJAX
        // Save button items from DOM
        let itemsDOM = q('.' + journal.itemClass + ' button.menu-link');
        // Check data and items have the same length -> means they have been created accordingly
        if (itemsDOM.length === journal.items.length) {
            // Iterate items
            for (let itemDOM of itemsDOM) {
                // Add a click listener to each item to create a new modal
                itemDOM.click(setItemsClick);
            }
        }
    }

    const getSheetHTML = (info) => {
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/sheet/" + info.item_id,
            data: {item_type: info.item_type},
            dataType: "text",
            success: (data) => {
                return data;
            },
            error: (e) => {
                console.log(e.responseText)
                console.log("Error", e);
            }
        });
    }

    function setItemsClick() {
        // Get item info from Journal
        let item = false;
        for (let i in journal.items.list) {
            if (journal.items.list[i].info.item_id === this.value) item = journal.items.list[i];
        }
        if (item) {
            // Check if container doesn't exist already
            if (q('#' + item.draggableContainerId).length === 0) {
                // If not, create it
                getSheetHTML(item.info).done((htmlText) => {
                    item.openItem(htmlText);
                    // Check it was created correctly
                    if (q('#' + item.draggableContainerId).length !== 1) {
                        // Return message error if length is not 1
                        $('.modal_error_response').html('Item could not be opened');
                        $('#modal_error-toggle').click();
                    }
                    // * Make items dragagble * //
                    new Draggable('.journal_item_modal', '.journal_item_modal .cursor-move');
                    // * Set other interactions * //
                    // Save the necessary html objects to make sheet interactable
                    let modals = q('.journal_item_modal');
                    let bootsModal = q('.modal.manage_class_modal');
                    let closeBtns = q('.journal_item_modal .close_item-btn');
                    let cursorMove = q('.journal_item_modal .cursor-move');
                    // * Check they have the correct lengths * //
                    if (!(modals.length === closeBtns.length && closeBtns.length === cursorMove.length)) {
                        return;
                    }

                    // * Iterate through modals and buttons * //
                    for (let i = 0; i < closeBtns.length; i++) {
                        // * Add a close event * //
                        closeBtns[i].click(() => {
                            modals[i].remove();
                            bootsModal[i].remove();
                        });
                    }

                    listenToSheetChanges(modals);
                });
            }
        }
    }

    function listenToSheetChanges(modals) {
        // * You need to reapply listeners to all opened items when you open a new one * //
        for (let modal of modals) {
            // Search for item
            let item = searchJournalItem(modal.id);
            // Do not do further actions if item was not found
            if (!item) continue;

            let this_draggable_fields = q('#' + item.draggableContainerId + ' .this-role-form-field');
            let this_mngclasses_fields = q('#manage_class_' + item.info.item_id + ' .this-role-form-field');
            //* begin::General Inputs change *//
            [this_draggable_fields, this_mngclasses_fields].forEach(this_fields => {
                getDataFromFields(this_fields, item);
                // Save on field lost of focus
                this_fields.blur(function () {
                    saveField(this, item.info.item_id).done(() => {
                        getDataFromFields(this_fields, item);
                        // Get skill proficiencies
                        getDataFromFields(q('#' + item.draggableContainerId + ' input.skill_prof'), item);
                        // Get hit dices
                        getDataFromFields(q('#' + item.draggableContainerId + ' select[name="this_hit_dices"]'), item);
                    });
                });
            });
            //* end::General Inputs change *//
            //* begin::Image change *//
            setItemImage(item);
            //* end::Image change *//
            //* begin::Inspiration *//
            setInspiration(item);
            //* end::Inspiration *//
            //* begin::Skill proficiencies *//
            setSkills(item);
            //* end::Skill proficiencies *//
            //* begin::Class *//
            // Has to be called AFTER the general filling
            setClassGroup(item);
            //* end::Class *//
            //* begin::Health Container *//
            setHealth(item);
            //* end::Health Container *//
            //* begin::Table content creation *//
            // -> This includes attacks & spells, global modifiers, tools & custom skills, and the bag
            setTables(item);
            //* end::Table content creation *//
        }
    }

    function saveField(object, id) {
        let form = new FormData();
        let objName = object.getAttribute('name');
        let objVal = object.value;
        if (objName === 'item_icon') {
            objName = 'item_icon[]';
            objVal = object.files[0];
        }
        if (objName.match(/this_prof/)) {
            objVal = object.checked ? "1" : "0";
        }
        form.append(objName, objVal);
        form.append('item_id', id);
        console.log('saveField objName= ', objName);
        console.log('saveField objVal= ', objVal)
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/save_sheet/" + dbGame.game_id,
            data: form,
            processData: false,
            contentType: false,
            success: (data) => {
                data = JSON.parse(data);
                console.log("saveField response", data);
                if (data.response) {
                    for (let i in journal.items.list) {
                        if (journal.items.list[i].info.item_id === id) {
                            for (let j in data.params) {
                                journal.items.list[i].info[j] = data.params[j];
                                // Load hit dices
                            }
                        }
                    }
                }
                return data;
            },
            error: (e) => {
                console.log(e);
            }
        });
    }

    function saveTable(t) {
        let name = t.id.substring(0, t.id.length - 2);
        let id = t.id.substring(t.id.length - 1);
        let form = {item_id: id};
        form[name] = t.innerHTML;
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/save_sheet/" + dbGame.game_id,
            data: form,
            dataType: "json",
            success: (data) => {
                console.log(data)
                return data;
            }, error: (e) => {
                console.log(e.responseText);
            }
        });
    }

    function getDataFromFields(inputs, item) {
        let it = searchJournalItem(item.draggableContainerId);
        for (let i of inputs) {
            let divName = i.getAttribute('name');
            this.scoreModifiers = () => {
                let scoreName = divName.substring(11);
                let sc = it.getScore(scoreName);
                i.value = sc.score;
                let check = q('#' + it.draggableContainerId + ' [name="this_prof_' + scoreName + '"]')[0];
                if (check) check.checked = sc.is_prof === "1";
                let label = q('#' + it.draggableContainerId + ' label[for="' + divName + '"')[0];
                let rawScoreModifier = it.getRawScoreModifier(scoreName);
                if (rawScoreModifier || rawScoreModifier == 0 && label) {
                    label.innerHTML = rawScoreModifier;
                }
            }
            this.scoreProfBonuses = () => {
                let label = q('#' + it.draggableContainerId + ' label[for="' + divName + '"')[0];
                if (label) {
                    label.innerHTML = i.checked ? '+' + it.getProficiency() : "+0";
                }
            }
            this.savingThrows = () => {
                let score = divName.substring(10);
                let check = q('#' + it.draggableContainerId + ' [name="this_prof_' + score + '"]')[0];
                let profScoreModifier = check && check.checked ? it.getProfScoreModifier(score) : it.getRawScoreModifier(score);
                if (profScoreModifier) {
                    i.value = profScoreModifier;
                    i.innerHTML = 'SAVING THROW' + (profScoreModifier >= 0 ? '+' : '') + profScoreModifier;
                }
            }
            this.skills = () => {
                // These titles are also the buttons to roll a skill dice
                let skillTitle = q('#' + it.draggableContainerId + ' .skill_prof[name="' + divName + '"] ~ button')[0];
                const skills = JSON.parse(it.info.skill_proficiencies);
                let skillName = divName.substring(11);
                i.value = skills[skillName];
                i.checked = i.value === "1" || i.value === "2";
                i.toggleClass('expertise', i.value === "2");
                it.getProficiency();
                if (skillTitle) {
                    skillTitle.innerHTML = toSentenceCase(skillName) + " +" + parseInt(i.value) * it.getProficiency();
                }
            }
            this.hp = () => {
                // Set total hit dices
                const level = it.getLevel();
                let totalHitDices = q('#' + it.draggableContainerId + ' .total_hd')[0];
                if (totalHitDices) totalHitDices.innerHTML = level;
                // Save hit points and hit dices info
                const itemHealth = JSON.parse(it.info.health);
                if (itemHealth && itemHealth.hit_points) {
                    i.value = itemHealth.hit_points[divName];
                }
                if (divName.match(/_hd/)) {
                    if (i.value > level) {
                        i.value = level;
                    }
                }
            }
            this.hitDices = () => {
                const classes = JSON.parse(it.info.classes);
                let hitDices = [];
                for (let c of classes) {
                    if (c.is_main || c.is_multiclass) {
                        if (!hitDices[c.hit_dice]) {
                            hitDices[c.hit_dice] = c.hit_dice;
                        }
                    }
                }
                if (hitDices) {
                    i.innerHTML = '';
                    for (let h in hitDices) {
                        i.innerHTML += '<option value="' + h + '">' + h + '</option>'
                    }
                } else {
                    i.innerHTML = '<option value="-1" disabled selected>Select a class</option>';
                }
            }
            this.exh = () => {
                const exhaustion = JSON.parse(it.info.health).conditions.exhaustion;
                if (exhaustion) {
                    i.checked = i.value <= exhaustion.lvl;
                    let exhaustionEffects = q('#' + it.draggableContainerId + ' .exhaustion_effects')[0];
                    exhaustionEffects.toggleClass('d-none', exhaustion.lvl == 0);
                    if (exhaustionEffects && i.checked) {
                        exhaustionEffects.innerHTML += "<br/> - " + exhaustion[i.value];
                    }
                }
            }
            this.deathSaves = () => {
                const dSaves = JSON.parse(it.info.health).death_saves;
                let split = divName.split('_');
                let type = split[split.length - 1];
                i.checked = i.value <= dSaves[type];
            }
            this.conditions = () => {
                const conds = JSON.parse(it.info.health).conditions;
                let split = divName.split('_');
                let type = split[split.length - 1];
                i.checked = conds[type] === "1";
            }
            this.getGenericFields = () => {
                switch (divName) {
                    case 'xp':
                        return it.getLevel(i.value);
                    case 'this-ac':
                        return it.getClassArmor();
                    case 'this-prof':
                        // This is the proficiency bonus main square
                        return it.getProficiency();
                    case 'this_init':
                        return it.getInitTierBreaker();
                    default:
                        return i.value;
                }
            }

            let data_from_sheet = q('#' + it.draggableContainerId + ' [data-from="' + divName + '"]');
            let data_from_mngclass_modal = q('#manage_class_' + it.info.item_id + ' [data-from="' + divName + '"]');
            [data_from_sheet, data_from_mngclass_modal].forEach(data_from => {
                for (let el of data_from) {
                    el.innerHTML = this.getGenericFields();
                }
            });
            if (divName && divName !== '') {
                //* begin::Score Modifiers *//
                if (divName.match(/this_score/)) {
                    this.scoreModifiers()
                } //* end::Score Modifiers *//
                //* begin::Score proficiency bonuses *//
                else if (divName.match(/this_prof/)) {
                    this.scoreProfBonuses(divName);
                } // * end::Score proficiency bonuses * //
                // * begin::Saving Throws * //
                else if (divName.match(/this_save/)) {
                    this.savingThrows();
                } // * end::Saving Throws * //
                else if (divName.match(/this_skill/)) {
                    this.skills();
                }
                //* begin::Hit points *//
                else if (divName.match(/_hp|_hd/)) {
                    this.hp();
                }//* end::Hit points *//
                //* begin::Hit dices select *//
                else if (divName.match(/this_hit_dices/)) {
                    this.hitDices();
                }//* end::Hit dices select *//
                //* begin::Exhaustion *//
                else if (divName.match(/exhaustion/)) {
                    this.exh();
                } //* end::Exhaustion *//
                //* begin::Death Saves *//
                else if (divName.match(/death_save/)) {
                    this.deathSaves();
                } //* end::Death Saves *//
                //* begin::Conditions *//
                else if (divName.match(/this_cond/)) {
                    this.conditions();
                } //* end::Conditions *//
                //* begin::Select *//
                else if (i.nodeName === 'SELECT') {
                    i.value = (i.getAttribute('aria-selected'));
                } //* end::Select *//
            }
        }
    }

    function setItemImage(item) {
        let iconInput = q('#' + item.draggableContainerId + ' .this-role-form-field[name="item_icon"]');
        iconInput.change(function () {
            saveField(this, item.info.item_id).done((data) => {
                data = JSON.parse(data);
                if (data.response) {
                    journal.reload();
                    readImageChange(this, q('#' + item.draggableContainerId + ' .item_icon-holder')[0]);
                    return;
                }
                $('.modal_error_response').html('Image could not be uploaded');
                $('#modal_error-toggle').click();
            });
        });
    }

    function setInspiration(item) {
        const inspCont = q('#' + item.draggableContainerId + ' .inspiration')[0];
        const insp = q('#' + item.draggableContainerId + ' [name=inspiration]')[0];
        if (inspCont && insp) {
            function loadInsp() {
                let it = searchJournalItem(item.draggableContainerId);
                if (it.info.info) {
                    let info = JSON.parse(it.info.info);
                    if (info.inspiration) {
                        insp.value = info.inspiration;
                        if (insp.value === "1") {
                            insp.children[0].style.backgroundImage = 'url("/assets/media/games/journal/insp.png")';
                            return;
                        }
                        insp.children[0].style.backgroundImage = 'none';
                        return;
                    }
                    insp.value = "0";
                }
            }

            loadInsp();
            inspCont.click(function () {
                saveField(insp, item.info.item_id).done(loadInsp);
            });
        }
    }

    function setSkills(item) {
        // These checkboxes will save if the character is proficient or expert in a skill
        let skillChecks = q('#' + item.draggableContainerId + ' .skill_prof');
        if (skillChecks) {
            getDataFromFields(skillChecks, item);
            skillChecks.click(function () {
                saveField(this, item.info.item_id).done(() => {
                    getDataFromFields(skillChecks, item);
                });
            });
        }

    }

    function setClassGroup(item) {
        let saveClassesBtn = q('#manage_class_' + item.info.item_id + ' button[name=save_classes]')[0];
        let classSelect = q('#manage_class_' + item.info.item_id + ' select[name=class]')[0];
        let subclass = q('#manage_class_' + item.info.item_id + ' input[name=subclass]')[0];
        let classLvl = q('#manage_class_' + item.info.item_id + ' input[name=lvl]')[0];
        let scoreProfs = q('#' + item.draggableContainerId + ' input.score_prof');
        if (classSelect && subclass && classLvl && saveClassesBtn && scoreProfs) {
            // Get select values
            let c = findClass();
            selectClass(c);
            classSelect.onchange = function () {
                let c = findClass(this.value);
                selectClass(c);
                // Set atributes to related inputs
                // This must always happen onchange
                subclass.setAttribute('name', 'subclass_' + this.value);
                classLvl.setAttribute('name', 'lvl_' + this.value);
            }
            saveClassesBtn.click(function () {
                console.log(this)
                saveClassesBtn.value = classSelect.value;
                saveField(saveClassesBtn, item.info.item_id).done((data) => {
                    let c = findClass();
                    // Load saving throws
                    saveClassSavingThrows(c, item);
                    // Load hit dices
                    let selectHitDice = q('#' + item.draggableContainerId + ' select[name="this_hit_dices"]');
                    if (selectHitDice) getDataFromFields(selectHitDice, item);
                });
            });
            getDataFromFields(scoreProfs, item);
            scoreProfs.click(function () {
                saveField(this, item.info.item_id).done(() => {
                    getDataFromFields(scoreProfs, item);
                });
            });
        }

        function findClass(name) {
            let classes = JSON.parse(item.info.classes);
            if (classes && classes.length > 0) {
                for (let i in classes) {
                    let c = classes[i];
                    if (name) {
                        if (c.class.match(name)) {
                            return c;
                        }
                    } else if (c.is_main) {
                        return c;
                    }
                }
                return null;
            }
        }

        function selectClass(c) {
            if (!c) {
                classSelect.value = "-1";
                subclass.setAttribute("name", "");
                classLvl.setAttribute("name", "");
                subclass.value = "";
                classLvl.value = "";
                return;
            }
            // Set class
            classSelect.value = c.class;
            // Set atributes to related inputs
            subclass.setAttribute('name', 'subclass_' + c.class);
            classLvl.setAttribute('name', 'lvl_' + c.class);
            // Fill data from class if exists
            subclass.value = c.subclass;
            classLvl.value = c.lvl;
        }

        function saveClassSavingThrows(c, item) {
            let saves = false;
            if (c && c.saves) {
                saves = c.saves.split(',');
                // Check the found ones
                for (let i of scoreProfs) {
                    i.checked = false;
                }
                for (let s of saves) {
                    for (let i of scoreProfs) {
                        // If statement is necessary for it would erase the previous ones
                        if (i.id.match(s)) {
                            i.checked = true;
                        }
                    }
                    for (let i of scoreProfs) {
                        saveField(i, item.info.item_id).done(() => {
                            getDataFromFields(scoreProfs, item);
                        });
                    }
                }
            }
            return saves;
        }
    }

    function setHealth(item) {
        const curhd = q('#' + item.draggableContainerId + ' input[name="cur_hd"]')[0];
        const deathSaves = q('#' + item.draggableContainerId + ' .death_saves');
        const deathSavesSuccess = q('#' + item.draggableContainerId + ' .death_saves.success');
        const deathSavesFailure = q('#' + item.draggableContainerId + ' .death_saves.danger');
        const exhaustionsChecks = q('#' + item.draggableContainerId + ' input.exhaustion');
        const conditionChecks = q('#' + item.draggableContainerId + ' .condition');
        this.hitDices = function () {
            let it = searchJournalItem(item.draggableContainerId);
            if (it.getLevel() < this.value) {
                this.value = it.getLevel();
            }
        }
        this.set_checks = function () {
            let exhaustionEffects = q('#' + item.draggableContainerId + ' .exhaustion_effects')[0];
            if (exhaustionEffects) exhaustionEffects.innerHTML = '<b>Exhaustion effects:</b>';
            const checks = [deathSavesSuccess, deathSavesFailure, exhaustionsChecks];
            for (let c of checks) {
                getDataFromFields(c, item);
                c.click(function () {
                    let valueHolder = parseInt(this.value);
                    let limit = this.checked || (this.nextElementSibling && this.nextElementSibling.checked) ? valueHolder : valueHolder - 1;
                    this.value = limit;
                    for (let i = 0; i < limit; i++) {
                        c[i].checked = true;
                    }
                    saveField(this, item.info.item_id).done(() => {
                        this.value = valueHolder;
                        if (exhaustionEffects && this.getAttribute('name').match(/_exh/)) {
                            exhaustionEffects.innerHTML = '<b>Exhaustion effects:</b>';
                        }
                        getDataFromFields(c, item);
                    });
                });
            }
        }
        this.setConditions = function () {
            getDataFromFields(conditionChecks, item);
            conditionChecks.click(function () {
                this.value = this.checked ? "1" : "0";
                saveField(this, item.info.item_id).done(() => {
                    // do things?
                    getDataFromFields(conditionChecks, item);
                });
            });
        }
        //* Current hit dices cannot be more than the available levels *//
        if (curhd) {
            curhd.onchange = this.hitDices;
            curhd.onkeyup = this.hitDices;
        }
        // Available hit dices must match the classes available for character
        const selectHitDice = q('#' + item.draggableContainerId + ' select[name="this_hit_dices"]');
        if (selectHitDice) getDataFromFields(selectHitDice, item);
        //* Death saves *//
        if (deathSaves && exhaustionsChecks) this.set_checks();
        //* Conditions *//
        if (conditionChecks) this.setConditions();
    }

    function setTables(item) {
        // Attacks & Spells
        // Global Modifiers
        // Tools & Custom Skills
        // Bag
        const buttons = [
            q('#atk_spells_btn' + item.info.item_id),
            q('#global_mods_btn' + item.info.item_id),
            q('#tools_custskills_btn' + item.info.item_id),
            q('#bag_btn' + item.info.item_id),
            q('#other_feats_btn' + item.info.item_id)
        ]
        for (let btn of buttons) {
            if (btn[0] && btn[0].parentNode.nextElementSibling) {
                let table = btn[0].parentNode.nextElementSibling;
                if (table) {
                    let tableName = table.id.substring(0, table.id.length - 2);
                    if (table.children[1] && table.children[1].nodeName === "TBODY") {
                        table.children[1].innerHTML = item.info[tableName];
                    } else {
                        table.innerHTML = item.info[tableName];
                    }
                    setMenus(table);
                    setSaveFields(item.draggableContainerId, table);
                    // Set listener to save fields
                    btn[0].click(function () {
                        newRow(table);
                        setMenus(table);
                        setSaveFields(item.draggableContainerId, table);
                    });
                }
            }
        }
    }

    function setMenus(t) {
        let menus = q('#' + t.id + ' .menu-item.menu-accordion');
        for (let m of menus) {
            m.click(function (e) {
                let btn = false;
                for (let child of m.children[0].children) {
                    if (child.nodeName === "BUTTON") {
                        btn = child;
                    }
                }

                if (e.target === btn || e.target === btn.children[0]) {
                    m.toggleClass('hover');
                    m.toggleClass('show');
                    saveTable(t);
                }
            });
        }
    }

    function setSaveFields(id, t) {
        let fields = q('#' + id + ' #' + t.id + ' .this_field');
        for (let f of fields) {
            if (f) {
                if (f.nextElementSibling) f.value = f.nextElementSibling.innerHTML;
                f.blur(function () {
                    if (this.nextElementSibling) this.nextElementSibling.innerHTML = this.value;
                    saveTable(t);
                });
            }
        }
    }

    /**
     *
     * @param t
     * @returns {string}
     */
    function newRow(t) {
        // Attacks and spells
        if (t.classList.contains('attacks_spells_table')) {
            t.innerHTML += rowAttacksSpells();
        } // Global modifiers
        else if (t.classList.contains('global_modifiers_table')) {
            t.innerHTML += rowGlobalModifiers();
        } // Bag
        else if (t.classList.contains('bag_table')) {
            t.innerHTML += rowBag();
        } // Other features
        else if (t.classList.contains('other_feats_table')) {
            // Div to fill ????
            t.innerHTML += rowCustomFeatures();
        }
    }

    function abiliyScoresSelect() {
        return '<select class="this_field form-control form-select w-50px" aria-selected="-1">' +
            '<option value="-1" selected>NONE</option>' +
            '<option value="str">STR</option>' +
            '<option value="dex">DEX</option>' +
            '<option value="con">CON</option>' +
            '<option value="int">INT</option>' +
            '<option value="wis">WIS</option>' +
            '<option value="cha">CHA</option>' +
            '</select>';
    }

    function rowAttacksSpells() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show mb-5">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link ps-0 gap-1">' +
            '        <div class="menu-title gap-1 align-items-center">' +
            '            <div class="menu-title gap-1">Name</div>' +
            '            <div class="menu-title gap-1">Attack</div>' +
            '            <div class="menu-title gap-1">Damage & Type</div>' +
            '        </div>' +
            '        <button class="btn">' +
            '           <span class="menu-arrow" style="width: 1rem;height:1rem;"></span>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu link-->' +
            '    <!--begin:Menu sub-->' +
            '    <div class="menu-sub menu-sub-accordion ps-2 gap-2">' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item">' +
            '           <input type="text" placeholder="Name"' +
            '               class="menu-title this_field form-control ps-2 fs-6"/>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item border-bottom-1px-gray-300 pb-2">' +
            '           <div class="flex-row align-items-center justify-content-start gap-2">' +
            '               <span class="fw-bolder">Attack:</span>' +
            '           ' + abiliyScoresSelect() +
            '               <span class="d-none"></span>' +
            '               + <input type="text" placeholder="0"' +
            '                      class="this_field form-control w-25px"/>' +
            '               <span class="d-none"></span>' +
            '               <input type="checkbox" class="this_field form-control form-check-input">' +
            '               <span class="d-none"></span>' +
            '               <label for="" class="form-check-label fs-9 fw-bolder">PROF</label>' +
            '           </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item border-bottom-1px-gray-300 pb-2">' +
            '            <div class="flex-column">' +
            '                <div class="flex-row align-items-center justify-content-start gap-2">' +
            '                    <span class="fw-bolder">Damage:</span>' +
            '                    <input type="text" placeholder="1d6"' +
            '                         class="this_field form-control w-25px"/>' +
            '                    <span class="d-none"></span>' +
            '                    + ' + abiliyScoresSelect() +
            '                    <span class="d-none"></span>' +
            '                    + <input type="text" placeholder="0"' +
            '                         class="this_field form-control w-20px"/>' +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '                <div class="flex-row align-items-center justify-content-start gap-2">' +
            '                    <label for="" class="form-check-label fs-9 fw-bolder">TYPE</label>' +
            '                    <input type="text" placeholder="Slashing"' +
            '                         class="this_field form-control w-100px">' +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item border-bottom-1px-gray-300 pb-2">' +
            '            <div class="flex-column">' +
            '                <div class="flex-row align-items-center justify-content-start gap-2">' +
            '                <span class="fw-bolder">Saving Throw:</span>' +
            '                ' + abiliyScoresSelect() +
            '                    <span class="d-none"></span>' +
            '                    <label class="fs-9 text-uppercase fw-bolder"> vs dc</label>' +
            '                ' + abiliyScoresSelect() +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '                <div class="flex-row align-items-center justify-content-start gap-2">' +
            '                    <label class="fs-9 text-uppercase fw-bolder"> SAVE EFFECT: </label>' +
            '                    <input type="text" placeholder="Half-damage"' +
            '                         class="this_field form-control w-100px">' +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item d-flex align-self-end">' +
            '            <button class="btn btn-sm btn-danger p-1 delete_row">' +
            '                <i class="fa-solid fa-trash ms-1"></i>' +
            '            </button>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '    </div>' +
            '</div>' +
            '<!--end::Menu Accordion-->' +
            '<!--begin::Sparator-->' +
            '<div class="menu-item">' +
            '    <div class="menu-content p-0">' +
            '        <div class="separator mx-1"></div>' +
            '    </div>' +
            '</div>' +
            '<!--end::Separator-->';
    }

    function rowGlobalModifiers() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show mb-5">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link ps-0 gap-1">' +
            '        <div class="menu-title gap-1 align-items-center">' +
            '            <div class="menu-title gap-1">Name</div>' +
            '            <div class="menu-title gap-1">Attack</div>' +
            '            <div class="menu-title gap-1">Damage</div>' +
            '            <div class="menu-title gap-1">Save</div>' +
            '            <div class="menu-title gap-1">CA</div>' +
            '        </div>' +
            '        <button class="btn">' +
            '           <span class="menu-arrow" style="width: 1rem;height:1rem;"></span>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu link-->' +
            '    <!--begin:Menu sub-->' +
            '    <div class="menu-sub menu-sub-accordion ps-2 gap-2">' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-title">' +
            '           <input type="text" placeholder="Bless"' +
            '                class="menu-title this_field form-control ps-2 fs-6"/>' +
            '           <span class="d-none"></span>' +
            '           <div class="flex-row align-items-center justify-content-start gap-2">' +
            '               <span class="fw-bolder">Attack:</span>' +
            '               <input type="text" placeholder="1d4"' +
            '                    class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '               <span class="d-none"></span>' +
            '               <span class="fw-bolder">Damage:</span>' +
            '               <input type="text" placeholder="1d4"' +
            '                    class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '               <span class="d-none"></span>' +
            '               <span class="fw-bolder">Skills:</span>' +
            '               <input type="text" placeholder="1d4"' +
            '                    class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '               <span class="d-none"></span>' +
            '           </div>' +
            '           <div class="flex-row-wrap align-items-center justify-content-start gap-2">' +
            '               <span class="fw-bolder">Saving Throw:</span>' +
            '               <input type="text" placeholder="1d4"' +
            '                    class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '               <span class="d-none"></span>' +
            '               <span class="fw-bolder">CA:</span>' +
            '               <input type="text" placeholder="1"' +
            '                    class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '               <span class="d-none"></span>' +
            '           </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '    </div>' +
            '</div>' +
            '<!--end::Menu Accordion-->' +
            '<!--begin::Sparator-->' +
            '<div class="menu-item">' +
            '    <div class="menu-content p-0">' +
            '        <div class="separator mx-1"></div>' +
            '    </div>' +
            '</div>' +
            '<!--end::Separator-->';
    }

    function rowBag() {
        return '<tr class="fs-8">' +
            '<td>' +
            '   <input type="number" value="0" placeholder="0"' +
            '        class="this_field form-control w-100px"/>' +
            '   <span class="d-none"></span>' +
            '</td>' +
            '<td>' +
            '   <input type="text" placeholder="Shield"' +
            '        class="this_field form-control"/>' +
            '   <span class="d-none"></span>' +
            '</td>' +
            '<td>' +
            '   <input type="text" placeholder="7.5" pattern="^[0-9]+$"' +
            '        class="this_field form-control w-100px text-end"/>' +
            '   <span class="d-none"></span>' +
            '</td>' +
            '<td>' +
            '   <button class="btn btn-sm btn-danger p-1 delete_row">' +
            '      <i class="fa-solid fa-trash ms-1"></i>' +
            '   </button>' +
            '</td>' +
            '</tr>';
    }

    function rowCustomFeatures() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show mb-5">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link ps-0 gap-1">' +
            '    <div class="menu-title gap-1 flex-column align-items-start">' +
            '        <div class="menu-title gap-1 w-100">' +
            '           <input type="text" placeholder="Name"' +
            '               class="menu-title this_field form-control ps-2 fs-3"/>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '        <div class="menu-title gap-1 w-100">' +
            '           <input type="text" placeholder="Source"' +
            '               class="menu-title this_field form-control ps-2"/>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '    </div>' +
            '        <button class="btn">' +
            '           <span class="menu-arrow" style="width: 1rem;height:1rem;"></span>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu link-->' +
            '    <!--begin:Menu sub-->' +
            '    <div class="menu-sub menu-sub-accordion ps-2">' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item">' +
            '           <label for="" class="menu-bullet">Description</label>' +
            '           <textarea type="text" id="" placeholder="When you reach level..."' +
            '               class="menu-title this_field form-control p-2" rows="10"></textarea>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '    </div>' +
            '</div>' +
            '<!--end::Menu Accordion-->' +
            '<!--begin::Sparator-->' +
            '<div class="menu-item">' +
            '    <div class="menu-content p-0">' +
            '        <div class="separator mx-1"></div>' +
            '    </div>' +
            '</div>' +
            '<!--end::Separator-->';
    }

    function searchJournalItem(containerID) {
        for (let i in journal.items.list) {
            if (journal.items.list[i].draggableContainerId === containerID) {
                return journal.items.list[i];
            }
        }
        return false;
    }

    function getJournalModalForm() {
        let post = getForm('#modal_journal');
        let item_id = q('#save_journal_item-btn')[0].value
        if (item_id && item_id !== "") {
            post.item_id = item_id;
        }
        $('#modal_journal .error').hide();
        let canSee = q('#include_players .player-can_see');
        let canEdit = q('#include_players .player-can_edit');
        let players = {};
        [canSee, canEdit].forEach(obj => {
            for (let o of obj) {
                if (o.checked) {
                    players[o.id] = o.id.substring(2);
                }
            }
        });
        if (Object.keys(players).length > 0) {
            post.players = players;
        }
        return post;
    }

    function deleteJournalItem() {
        $.ajax({
            type: 'post',
            url: '/app/games_ajax/delete_journal_item/' + q('#change_item')[0].value,
            data: getJournalModalForm(),
            dataType: 'json',
            success: function (data) {
                if (data.response) {
                    // Reload journal
                    journal.reload();
                    // Dismiss journal modal
                    $('.modal_success_response').html(data.msg);
                    $('#modal_success-toggle').click();
                    return;
                }
                $('.modal_error_response').html(data.msg);
                $('#modal_error-toggle').click();
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        });
    }

    function saveJournalItem() {
        toggleProgressSpinner(true);
        // Check if item id is saved -> This tells the difference between a new item and an update
        $.ajax({
            type: 'post',
            url: '/app/games_ajax/set_journal_item/' + dbGame.game_id,
            data: getJournalModalForm(),
            dataType: 'json',
            success: function (data) {
                if (data.response) {
                    // Reload journal
                    journal.reload();
                    // Dismiss journal modal
                    $('.modal_success_response').html(data.msg);
                    $('#modal_success-toggle').click();
                } else if (data.msg) {
                    $('#modal_journal .error').show();
                }
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        });
        toggleProgressSpinner(false);
    }

// **************************** //
// ******* end::Journal ******* //
// **************************** //

// **************************** //
// ******* begin::Board ******* //
// **************************** //

// * Board intance * //
    const board = new Board('.btn.dice');
    board.map = new GameMap('#this-game', {
        folder: '/assets/media/games/' + dbGame.game_folder + '/layers/',
        ajax: '/app/games_ajax/get_layers/' + dbGame.game_id,
        select: '#change_layer',
        game: dbGame
    });

    if (dbGame.game_creator === session.user_id) {
        listenToNewMaps();
    }

    function listenToNewMaps() {
        this.lName = q('#layer_name')[0];
        this.lImg = q('#add_map-input')[0];
        this.lImgPreview = q('#add_layer-preview')[0];
        this.btn = q('#add_layer-btn')[0];

        this.lImg.onchange = () => {
            // Change bg from holder
            readImageChange(this.lImg, this.lImgPreview);
        }

        const newMap = () => {
            if (this.lName.value !== '' && this.lImg.files.length > 0) {
                let form = new FormData();
                form.append('layer_img[]', this.lImg.files[0]);
                form.append('layer_name', this.lName.value);
                console.log(form)
                $.ajax({
                    type: "post",
                    url: "/app/games_ajax/add_map/" + dbGame.game_id,
                    data: form,
                    processData: false,
                    contentType: false,
                    success: (data) => {
                        data = (JSON.parse(data)).data;
                        let img = data.img;
                        if (data.response) {
                            // Reload map layers
                            board.map.loadLayers();
                            $('.modal_success_response').html('Map added correctly');
                            $('#modal_success-toggle').click();
                            return;
                        }
                        $('.modal_error_response').html(img);
                        $('#modal_error-toggle').click();
                    },
                    error: (e) => {
                        console.log("Error: ", e);
                    }
                });
                return;
            }
            q('#add_layer-error').removeClass('d-none');
        }

        const selectMap = () => {
            // Save selected map
            let selectedMap = q('#change_layer')[0].value;
            // Update selected map
            $.ajax({
                type: "get",
                url: "/app/games_ajax/set_selected_layer/" + dbGame.game_id + "?layer_id=" + selectedMap,
                dataType: "json",
                success: (data) => {
                    dbGame.game_layer_selected = selectedMap;
                },
                error: (e) => {
                    console.log("Error: ", e);
                }
            });
            // Change image in HTML
            board.map.showLayer(board.map.layersFolder + board.map.layers[selectedMap].layer_bg);
        }

        const editMap = () => {
            if (this.lName.value !== '') {
                let form = new FormData();
                if (this.lImg.files.length > 0) form.append('layer_img[]', this.lImg.files[0]);
                form.append('layer_name', this.lName.value);
                form.append('layer_id', q('#change_layer')[0].value);
                $.ajax({
                    type: "post",
                    url: "/app/games_ajax/edit_layer/" + dbGame.game_id,
                    data: form,
                    processData: false,
                    contentType: false,
                    success: (data) => {
                        data = (JSON.parse(data)).data;
                        let img = data.img;
                        if (data.response) {
                            // Reload map layers
                            $('.modal_success_response').html('Map updated');
                            $('#modal_success-toggle').click();
                            board.map.layers = {};
                            board.map.loadLayers();
                            return;
                        }
                        $('.modal_error_response').html(img);
                        $('#modal_error-toggle').click();
                    },
                    error: (e) => {
                        console.log("Error: ", e);
                    }
                });
                return;
            }
            q('#add_layer-error').removeClass('d-none');
        }

        const deleteMap = () => {
            $.ajax({
                type: "get",
                url: "/app/games_ajax/delete_layer/" + q('#change_layer')[0].value,
                dataType: "json",
                success: (data) => {
                    board.map.loadLayers();
                },
                error: (e) => {
                    console.log("Error: ", e);
                }
            });
        }

        this.btn.click(newMap);

        // Select map on click
        q('#select_layer-btn').click(selectMap);

        // Delete layer on click
        q('#delete_layer-btn').click(function () {
            openConfirmation(deleteMap);
        });

        // Fill add modal on click
        q('#edit_layer-btn').click((e) => {
            q('#add_layer-modal .modal-header h4')[0].innerHTML = 'Edit Layer';
            q('#layer_name')[0].value = $('#change_layer').find(':selected').text();
            this.btn.removeEventListener('click', newMap);
            this.btn.click(editMap);
        });

        // On modal closure
        $('#add_layer-modal').on('hidden.bs.modal', () => {
            q('#add_layer-modal .modal-header h4')[0].innerHTML = 'Add Layer';
            // Reset fields and divs
            this.lName.value = '';
            this.lImg.value = '';
            this.lImgPreview.style.backgroundImage = 'none';
            q('#add_layer-error').addClass('d-none');
            // Reset listeners
            this.btn.removeEventListener('click', editMap);
            this.btn.click(newMap);
        });

    }

// **************************** //
// ******** end::Board ******** //
// **************************** //

// **************************** //
// ******* begin::Chat ******** //
// **************************** //

// * Chat object * //
    const chat = new board.Chat('.chat-messages');
    getChat();

// * Listen to dices buttons pressed * //
    $('.btn.dice').click(function () {
        chat.formatMessage({
            src: "",
            msg: board.dices[this.value].roll(),
            sender: $('#charsheet_selected').find(':selected').text(),
            msgType: "rollDice",
            dice: this.value,
            rolling: $('#roll-' + this.value).val()
        });
    });
// * Chat textarea constant * //
    const chatText = q('.chat-bubble textarea')[0];
// * Chat textarea holder * //
    let chatMessage = '';

// * Listen to chat pressed keys * //
    chatText.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace') {
            chatMessage = chatMessage.substring(0, chatMessage.length - 1);
        }
    });
    chatText.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') { // If Enter key
            if (e.shiftKey) { // If Shift+Enter
                chatMessage += '<br/>'; // Add line break
                return; // Return
            }
            // If Enter without Shift
            e.preventDefault(); // Prevent textarea line break
            setChat(chatMessage.trim(), $('#charsheet_selected').find(':selected').text(), "chatMessage");
            return;
        }
        // Save key if not the previous ones
        chatMessage += e.key;
    });

// * Listen to send button in chat * //
    document.querySelector('.chat-bubble ~ div .btn').addEventListener('click', function () {
        setChat(chatMessage.trim(), $('#charsheet_selected').find(':selected').text(), "chatMessage");
    });

    function setChat(text, sender, msgType) {
        if (text !== '') {
            $.ajax({
                type: "post", url: "/app/games_ajax/set_chat/" + dbGame.game_id, data: {
                    msg: text, sender: sender, msgType: msgType,
                }, dataType: "json", success: function (data) {
                    if (!data['response']) {
                        sender = '';
                        text = data['msg'];
                        chat.formatMessage({ // Submit message
                            sender: sender, src: "", msg: text, msgType: msgType
                        });
                    }
                    chatText.value = ""; // Empty chat textarea
                    chatMessage = ''; // Empty holder variable

                }, error: function (e) {
                    console.log("Error: ", e);
                }
            });
        }
    }

    function getChat() {
        $.ajax({
            type: "get", url: "/app/games_ajax/get_chat/" + dbGame.game_id, dataType: "json", success: function (data) {
                // Check if there are any new messages before updating chat
                if (data.msg || (data.msgs && $('.chat-messages .menu-item').length !== data.msgs.length)) {
                    chat.record.innerHTML = '';
                    let sender = '';
                    let src = '';
                    let msgText = 'There are no messages yet, be the first to comment!';
                    let msgType = 'error';
                    if (data.response && data.msgs.length > 0) {
                        for (let i in data['msgs']) {
                            let msg = data['msgs'][i];
                            sender = msg['chat_sender'];
                            src = '';
                            msgText = msg['chat_msg'];
                            msgType = msg['chat_msg_type'];
                            chat.formatMessage({
                                sender: sender, src: src, msg: msgText, msgType: msgType
                            });
                        }
                        //chat.record.scrollTop = chat.record.scrollHeight;
                        return;
                    }
                    chat.formatMessage({
                        sender: sender, src: src, msg: msgText, msgType: msgType
                    });
                }
            }, error: function (e) {
                console.log("Error: ", e);
            }
        });
    }


// **************************** //
// ******** end::Chat ********* //
// **************************** //

    function reloadGameInfo() {
        $.ajax({
            type: "get", url: "/app/games_ajax/get_game_info/" + dbGame.game_id, dataType: "json", succes: (data) => {
                if (data.response && data.game) dbGame = data.game; else {
                    alert("Este juego ya no existe");
                    window.location.assign('/index');
                }
            }, error: (e) => {
                console.log("Error: ", e);
            }
        });
    }


    thisShouldBeAWebSocket();
    setInterval(thisShouldBeAWebSocket, 300000);

    const dataChanged = (data) => {
        const items = data.results;
        for (let i in items) {
            if (items[i].item_icon !== journal.items.list[i].info.item_icon) {
                return;
            }
        }
        return false;
    }

    function thisShouldBeAWebSocket() {
        reloadGameInfo();
        getChat();
        board.map.loadLayers();
        /*journal.getJournalAjax().done((data) => {
            if (data.results && data.results.length === journal.items.length) {
                if (!dataChanged(data)) return;
                journal.reload();
            }
        });*/
    }
}