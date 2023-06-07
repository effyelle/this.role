class Journal {
    constructor(id, options = {}) {
        this.opt = options;
        this.url = {
            save: '/app/games_ajax/save_sheet/' + dbGame.game_id,
            get: '/app/games_ajax/get_journal_items/' + dbGame.game_id
        }
        this.folder = '/assets/media/games/' + dbGame.game_folder + '/players/';
        this.container = id;
        this.itemClass = id + '_item';
        this.sheetsContainer = 'draggable-modals_container';
        this.select = q('#charsheet_selected')[0];
        this.playername = q('#player_name')[0];
        this.items = {}
        // Init journal
        this.selectItem = q('#change_item')[0];
        this.includePLayers = q('#include_players')[0];
        this.itemType = q('#item_type')[0];
        this.toggleCreateItem = q('#modal_journal-toggle')[0];
        this.createItemBtn = q('#save_journal_item-btn')[0];
        this.toggleEditItem = q('#edit_item-btn')[0];
        this.deleteItemBtn = q('#delete_item-btn')[0];
        this.adminParent = q('#modal_journal')[0];
        // Format admin select
        if (this.adminParent) {
            this.loadAdminSelect();
            this.adminJournal();
        }
    }

    set Chat(chat) {
        this.chat = chat;
    }

    set JournalDraggable(draggables) {
        this.journalDraggable = draggables;
    }

    SheetDnD = function (id, params = {}) {
        this.info = params.itemInfo;
        // Add container for saving future modals
        this.modalsContainer = id;
        this.draggableContainerId = 'draggable_' + this.info.item_id;
        this.draggableContainerClass = 'journal_item_modal';
        this.folder = params.folder;
        this.getIcon = () => {
            let icon = this.folder + this.info.item_icon;
            if (urlExists(icon)) return icon;
            return '/assets/media/avatars/blank.png';
        }
        this.icon = this.getIcon();
        this.openItem = async (htmlText) => {
            q('#' + this.modalsContainer)[0].innerHTML += htmlText;
            this.iconHolder = q('#' + this.draggableContainerId + ' .item_icon-holder');
            if (this.iconHolder.length > 0) {
                this.iconHolder[0].style.backgroundImage = 'url("' + this.icon + '")';
            }
        }
        this.getLevel = () => {
            let lvl = JSON.parse(this.info.info).lvl;
            return lvl === 0 || lvl === "" || isNaN(lvl) ? 1 : parseInt(lvl);
        }
        this.getClassArmor = () => {
            // Base armor starts in 10
            let this_ac = 10;
            // Check character sheet is correctly filled
            let dex = this.getRawScoreModifier('dex');
            if (dex) {
                let armor = this.info.bag.armor && this.info.bag.armor.equiped ? this.info.bag.armor.val : 0;
                // This is yet to write
                let heavyArmor = false;
                let shield = 0;
                let custom_mods = 0;
                // Then you add: DEX modifier, armor modifier, shield
                // Always add custom modifiers
                this_ac += parseInt(custom_mods);
                // Add dexterity modifier if not wearing heavy armor
                if (!armor && !heavyArmor) {
                    this_ac += dex;
                }
                // Otherwise add armor and shield
                this_ac += parseInt(armor) + parseInt(shield);
            }
            return this_ac;
        }
        this.getProficiency = () => {
            // Starts in +2 and adds +1 for every 4 levels until level 20
            return Math.ceil(this.getLevel() / 4) + 1;
        }
        this.getSkill = (prof) => {
            let skills = JSON.parse(this.info.skill_proficiencies);
            return skills[prof];
        }
        this.getSkillProficiency = (prof) => {
            let skill = this.getSkill(prof);
            let modifier = 0;
            modifier += this.getRawScoreModifier(skill.score);
            if (skill.is_prof === "1") modifier += this.getProficiency();
            if (skill.is_prof === "2") modifier += this.getProficiency() * 2;
            return modifier;
        }
        this.getScore = (score) => {
            if (this.info.ability_scores) {
                const scores = JSON.parse(this.info.ability_scores);
                for (let i in scores) {
                    if (i.match(score)) {
                        return scores[i];
                    }
                }
            }
            return false;
        }
        this.getRawScoreModifier = (score) => {
            if (this.info.ability_scores) {
                const scores = JSON.parse(this.info.ability_scores);
                let modifier = 0;
                for (let i in scores) {
                    if (i.match(score)) {
                        return Math.floor((parseInt(scores[i].score) - 10) / 2);
                    }
                }
                return modifier;
            }
            return false;
        }
        this.getProfScoreModifier = (score) => {
            if (this.info.ability_scores) {
                const scores = JSON.parse(this.info.ability_scores);
                let modifier = 0;
                for (let i in scores) {
                    if (i.match(score)) {
                        return Math.floor((parseInt(scores[i].score) - 10) / 2) + (scores[i].is_prof === "1" ? this.getProficiency() : 0);
                    }
                }
                return modifier;
            }
            return false;
        }
        this.getInitTierBreaker = () => {
            const tierBreaker = 1.045;
            let dex = this.getRawScoreModifier('dex');
            if (!dex) dex = 0;
            return Math.round(dex * tierBreaker * 1000) / 1000;
        }
        this.getCarryingCapacityLb = () => {
            if (this.info.ability_scores) {
                const str = JSON.parse(this.info.ability_scores).str.score;
                return Math.round(parseFloat(str) * 15 * 100) / 100; // in KG
            }
        }
        this.getCarryingCapacityKg = () => {
            if (this.info.ability_scores) {
                const str = JSON.parse(this.info.ability_scores).str.score;
                return Math.round(parseFloat(str) * 6.80389 * 100) / 100; // in KG
            }
        }
        this.getSpellModifiers = () => {
            const thisInfo = JSON.parse(this.info.info);
            let spellcasting = {
                selected: "none",
                spellSave: 8 + this.getProficiency(),
                spellAtkBonus: this.getProficiency(),
            };
            if (thisInfo.spellcasting && thisInfo.spellcasting !== 'none') {
                spellcasting.selected = thisInfo.spellcasting;
                spellcasting.spellSave += this.getRawScoreModifier(thisInfo.spellcasting);
                spellcasting.spellAtkBonus += this.getRawScoreModifier(thisInfo.spellcasting);
            }
            return spellcasting;
        }

    }

    set JournalChanged(bool) {
        this.changed = bool;
    }

    initJournal() {
        // Get data
        return ajax(this.url.get).done((data) => {
            // Checck data is not null
            this.JournalChanged = false;
            if (!data.results) {
                if (this.items !== {}) {
                    this.JournalChanged = 'length';
                    this.items = {};
                }
                // Reset journal draggables
                if (this.journalDraggable && this.journalDraggable.containers) {
                    for (let jSheet of this.journalDraggable.containers) {
                        jSheet.remove();
                    }
                }
                return data;
            }
            // If the length of both arrays is not the same, items have changed
            // -> (Items have been added or deleted)
            if (data.results.length !== Object.keys(this.items).length) {
                q('#' + this.container)[0].innerHTML = '';
                this.items = {}
                //* Save items into this.items *//
                this.saveResults(data);
                this.JournalChanged = 'length';
                return data;
            }
            // * Check if inner INFO has changed to update draggable opened items * //
            for (let i in data.results) {
                // Save Database item
                let dbItem = data.results[i];
                // Search for its equal item from journal
                let thisItem = this.searchItem(dbItem.item_id).info;
                if (thisItem) {
                    for (let j in dbItem) {
                        // Compare their values
                        if (typeof thisItem[j] === 'object') thisItem[j] = JSON.stringify(thisItem[j]);
                        if (dbItem[j] != thisItem[j] && !(dbItem[j] === null && thisItem[j] === null) &&
                            !(dbItem[j] === 'null' && thisItem[j] === 'null') && !(dbItem[j] === null && thisItem[j] === 'null')) {
                            this.JournalChanged = 'info';
                            // Save new values into this.items.info
                            this.saveResults(data);
                            break;
                        }
                    }
                }
            }
            return data;
        });
    }

    loadAdminSelect() {
        // * begin::Select Items * //
        const loadAdminItems = () => {
            this.selectItem.innerHTML = '';
            if (Object.keys(this.items).length > 0) {
                for (let i in this.items) {
                    let item = this.items[i].info;
                    this.selectItem.innerHTML += '<option value="' + item.item_id + '">' + item.item_name + '</option>';
                }
                // Show buttons
                this.toggleEditItem.removeClass('d-none');
                this.deleteItemBtn.removeClass('d-none');
                return;
            }
            this.selectItem.innerHTML = '<option value="-1" disabled selected>No journal items available</option>';
            // Hide buttons
            this.toggleEditItem.addClass('d-none');
            this.deleteItemBtn.addClass('d-none');
        }
        if (this.selectItem) loadAdminItems();
        // * end::Select Items * //

        // * begin::Empty modal * //
        this.emptyJournalModal = () => {
            q('#modal_journal .modal-header h4')[0].innerHTML = 'Add Journal Item';
            this.createItemBtn.value = "";
            $('#item_name').val("Character or Handout");
            this.itemType.value = 'character';
            this.switchIncludePlayers();
            $('#modal_journal input[type=checkbox]').prop('checked', false);
        }
        if (this.toggleCreateItem && this.itemType) {
            this.toggleCreateItem.click(() => {
                this.emptyJournalModal();
            });
        }
        // * end::Empty modal * //

        // * begin::Fill modal * //
        this.fillJournalModal = () => {
            // Search for item
            let item = this.searchItem(this.selectItem.value);
            // Return if item was not found
            if (!item || item === {}) return;
            // Change modal title
            q('#modal_journal .modal-header h4')[0].innerHTML = 'Edit Journal Item';
            // Put ID into save button
            this.createItemBtn.value = item.info.item_id;
            // Fill item data -> Name
            q('#item_name')[0].value = item.info.item_name;
            // Fill item data -> Type
            this.itemType.value = item.info.item_type;
            // Toggle visibility
            this.switchIncludePlayers();
            // Fill item data -> Viewers/Editors
            if (q('.can_see-can_edit')[0]) this.loadViewersEditors(item.info);
        }
        if (this.toggleEditItem && this.selectItem && Object.keys(this.items).length > 0) {
            this.toggleEditItem.click(() => {
                this.fillJournalModal();
            });
        }
        // * end::Fill modal * //
        //* begin::Delete item *//
        this.deleteJournalItem = () => {
            ajax('/app/games_ajax/delete_journal_item/' + this.selectItem.value, this.getJournalModalForm())
                .done((data) => {
                    if (data.response) {
                        // Dismiss journal modal
                        $('.modal_success_response').html(data.msg);
                        $('#modal_success-toggle').click();
                        return;
                    }
                    $('.modal_error_response').html(data.msg);
                    $('#modal_error-toggle').click();
                });
        }
        if (this.selectItem && this.deleteItemBtn && Object.keys(this.items).length > 0) {
            this.deleteItemBtn.click(() => {
                openConfirmation(this.deleteJournalItem);
            });
        }
        //* end::Delete item *//
    }

    adminJournal() {
        // * begin::Check/Uncheck modal viewers/editors checkboxes * //
        this.switchIncludePlayers = () => {
            let can_see = $('.can_see-can_edit .can_see');
            let can_edit = $('.can_see-can_edit .can_edit');
            switch (this.itemType.value) {
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
        if (this.includePLayers && this.itemType) {
            this.switchIncludePlayers();
            this.itemType.onchange = this.switchIncludePlayers;
        }
        // * end::Check/Uncheck modal viewers/editors checkboxes * //

        this.loadViewersEditors = (item) => {
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
                    let split = canSeeCheckbox.id.split('-');
                    for (let v of viewers) {
                        if (v == split[0]) checked = true;
                    }
                    canSeeCheckbox.checked = checked;
                }
                checked = false;
                if (editors) {
                    let split = canEditCheckbox.id.split('-');
                    for (let e of editors) {
                        if (e == split[0]) checked = true;
                    }
                    canEditCheckbox.checked = checked;
                }
            }
        }

        // * begin::Create item * //
        this.getJournalModalForm = () => {
            let post = getForm('#modal_journal');
            let item_id = this.createItemBtn.value
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
                        let split = o.id.split('-');
                        players[o.id] = split[1];
                    }
                }
            });
            if (Object.keys(players).length > 0) {
                post.players = players;
            }
            return post;
        }
        this.saveJournalItem = () => {
            toggleProgressSpinner(true);
            // Check if item id is saved -> This tells the difference between a new item and an update
            ajax('/app/games_ajax/set_journal_item/' + dbGame.game_id, this.getJournalModalForm())
                .done((data) => {
                    if (data.response) {
                        // Dismiss journal modal
                        $('.modal_success_response').html(data.msg);
                        $('#modal_success-toggle').click();
                    } else {
                        $('#modal_journal .error').show();
                    }
                    toggleProgressSpinner(false);
                }).fail((e) => {
                toggleProgressSpinner(false);
            });
        }
        if (this.createItemBtn) {
            this.createItemBtn.click(() => {
                this.saveJournalItem();
            });
        }
        // * end::Create item * //
    }

    saveResults(data) {
        this.items = {};
        // Iterate results
        for (let item of data.results) {
            // Save a DND sheet for each item
            this.items[Object.keys(this.items).length] = new this.SheetDnD(this.sheetsContainer, {
                itemInfo: item, folder: this.folder,
            });
        }
    }

    loadChatSelect() {
        // Reset select HTML
        let playerName = this.playername ? this.playername.value : session.user_username;
        if (this.select) this.select.innerHTML = '<option selected value="username">' + playerName + '</option>';
        // Rerun items
        for (let i in this.items) {
            let item = this.items[i];
            // Select for chat if character
            if (item.info.item_type === 'character' && this.select) {
                this.select.innerHTML += '<option value="' + item.info.item_id + '">' + item.info.item_name + '</option>';
            }
        }
    }

    formatJournalItems() {
        q('#' + this.container)[0].innerHTML = '';
        // Rerun items
        for (let i in this.items) {
            let item = this.items[i];
            let viewer = false;
            let editor = false;
            // Check if viewer
            if (item.info.item_viewers) {
                const itemViewers = JSON.parse(item.info.item_viewers);
                for (let i of itemViewers) {
                    if (i == session.user_id) viewer = true;
                }
            }
            // Check if editor
            if (item.info.item_editors) {
                const itemEditors = JSON.parse(item.info.item_editors);
                for (let i of itemEditors) {
                    if (i == session.user_id) editor = true;
                }
            }
            // Save if conditions are met
            if (session.user_id === dbGame.game_creator || viewer || editor) {
                // Journal list
                this.addItemBtnToList(item);
            }
        }
        this.loadChatSelect();
    }

    addItemBtnToList(item) {
        // Check image data, if it does not exist, put a default one
        q('#' + this.container)[0].innerHTML += '' + '<!--begin::Menu Item-->' + ' <div class="menu-item ' + this.itemClass + '">' + // Assign item ID to button for later accessing
            '     <button type="button" class="btn menu-link col-12" draggable="true" value="' + item.info.item_id + '">' +
            '         <!--begin::Symbol-->' +
            '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '             <span class="symbol-label circle item_icon-holder"' +
            '                  style="background-image: url(' + item.icon + ');' +
            '                      background-size: cover; background-position: center center;">' +
            '             </span>' +
            '         </div>' +
            '         <!--end::Symbol-->' +
            '         <span class="menu-title fw-bolder fs-7 text-gray-600 text-hover-dark">' + item.info.item_name + '</span>' +
            '     </button>' +
            ' </div>' +
            ' <!--end::Menu Item-->';
    }

    searchItem(id) {
        for (let i in this.items) {
            if (this.items[i].info.item_id == id) {
                return this.items[i];
            }
        }
        return false;
    }

    saveField(object, id) {
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
        return $.ajax({
            type: "post",
            url: baseUrl + this.url.save,
            data: form,
            processData: false,
            contentType: false,
            success: (data) => {
                return data;
            }, error: (e) => {
                console.log(e.responseText);
            }
        });
    }

    saveTable(t) {
        let name = t.id.substring(0, t.id.lastIndexOf('_'));
        let id = t.id.substring(t.id.lastIndexOf('_')+1);
        console.log(name)
        console.log(id)
        let form = {item_id: id};
        form[name] = t.innerHTML;
        return ajax("/app/games_ajax/save_sheet/" + dbGame.game_id, form);
    }

    getHealthGroup(it) {
        this.deathSavesSuccess = q('#' + it.draggableContainerId + ' .death_saves.success');
        this.deathSavesFailure = q('#' + it.draggableContainerId + ' .death_saves.danger');
        this.exhaustionsChecks = q('#' + it.draggableContainerId + ' input.exhaustion');
        this.conditionChecks = q('#' + it.draggableContainerId + ' .condition');
        return [this.deathSavesSuccess, this.deathSavesFailure, this.exhaustionsChecks, this.conditionChecks];
    }

    listenToOpenedItems(item) {
        // After we add a new item inside a DOM element, all DOM element inside have their identities changed.
        // This means that all previous listeners for these divs have been lost.
        this.itemsOpened = q('.' + item.draggableContainerClass);
        //* Rerun opened items to add listeners *//
        for (let itemOpened of this.itemsOpened) {
            let split = itemOpened.id.split('_');
            let id = split[split.length - 1];
            let this_item = this.searchItem(id);
            // Go to next opened draggable DOM item if journal item is not found
            if (!this_item || this_item === {}) continue;
            //* HERE LOAD ITEM INFO *//
            // this.getDataFromFields()
            // Fill from data base and listen to changes to save that data
            this.FieldListeners = this_item;
        }
    }

    /**
     * Receives an item and fills up the journal opened draggable item
     *
     * @param it
     */
    fillDraggable(it) {
        this.fillDataFrom(it);
        this.fillBlurFields(it);
        if (it.info.item_type !== 'character') return;
        this.fillInspiration(it);
        this.fillSpellcasting(it);
        this.fillAbilityScores(it);
        this.fillSkills(it);
        this.fillHealth(it);
    }

    fillBlurFields(it) {
        this.inputFields = q('#' + it.draggableContainerId + ' input.this-role-form-field');
        this.textAreas = q('#' + it.draggableContainerId + ' textarea.this-role-form-field');
        [this.inputFields, this.textAreas].forEach(fields => {
            for (let f of fields) {
                let divName = f.getAttribute('name');
                if (divName.match(/item_icon/)) {
                    it.iconHolder = q('#' + it.draggableContainerId + ' .item_icon-holder');
                    if (it.iconHolder[0]) it.iconHolder[0].style.backgroundImage = 'url("' + it.icon + '")';
                    const listIcon = q('#' + this.container + ' button[value="' + it.info.item_id + '"] span.item_icon-holder');
                    if (listIcon[0]) listIcon[0].style.backgroundImage = 'url("' + it.icon + '")';
                } // it.info.info
                else if (divName.match(/class|subclass|lvl|race|background|walkspeed/)) {
                    f.value = JSON.parse(it.info.info)[divName];
                } // it.ability_scores
                else if (divName.match(/this_score/)) {
                    let split = divName.split('_');
                    f.value = JSON.parse(it.info.ability_scores)[split[split.length - 1]].score;
                } // it.health
                else if (divName.match(/_hd|_hp/)) {
                    f.value = JSON.parse(it.info.health).hit_points[divName];
                } else {
                    f.value = it.info[divName];
                }
            }
        });
        // Fill up name
        // This cannot be automatized because there's not always an input for name, soemtimes it can be an <h4>
        const listName = q('#' + this.container + ' button[value="' + it.info.item_id + '"] span.menu-title')[0];
        if (listName) listName.innerHTML = it.info.item_name;
        const itemName = q('#' + it.draggableContainerId + ' [data-from="item_name"]');
        for (let n of itemName) {
            n.innerHTML = it.info.item_name;
        }
    }

    fillClasses(it) {
        // Empty classes
        const classesContainer = q('#' + it.draggableContainerId + ' .class_groups_container .subcontainer')[0];
        const classRows = q('#' + it.draggableContainerId + ' .class_group');
        let row = classRows[0].innerHTML;
        classRows.innerHTML = '<div class="class_group flex-column justify-content-between gap-3 border-top-1px-gray-300 py-3 d-none">' + row + '</div>';
        const addClass = (c) => {
            let classRows = q('#' + it.draggableContainerId + ' .class_group');
            let row = classRows[0].innerHTML;
            classesContainer.innerHTML += '<div class="class_group flex-column justify-content-between gap-3 border-top-1px-gray-300 py-3">' + row + '</div>';
            classRows = q('#' + it.draggableContainerId + ' .class_group');
            // Fill fields
            const classSelect = q('#' + it.draggableContainerId + ' .class_group select[name=class]')[classRows.length - 1];
            const classLvl = q('#' + it.draggableContainerId + ' .class_group input.class_lvl')[classRows.length - 1];
            const classSubclass = q('#' + it.draggableContainerId + ' .class_group input.subclass')[classRows.length - 1];
            const classMain = q('#' + it.draggableContainerId + ' .class_group input.is_main')[classRows.length - 1];
            classSelect.value = c.class;
            classLvl.value = c.lvl;
            classSubclass.value = c.subclass;
            classMain.checked = c.main === "1";
        };
        const classes = JSON.parse(it.info.classes);
        for (let c of classes) {
            if (c.main === "1") {
                addClass(c);
            }
        }
    }

    fillInspiration(it) {
        const insp = q('#' + it.draggableContainerId + ' [name=inspiration]')[0];
        if (it.info.info) {
            insp.value = JSON.parse(it.info.info).inspiration;
            if (insp.value === "1") {
                insp.children[0].style.backgroundImage = 'url("/assets/media/games/journal/insp.png")';
                return;
            }
            insp.children[0].style.backgroundImage = 'none';
        }
    }

    fillSpellcasting(it) {
        const spellAbilitySelect = q('#' + it.draggableContainerId + ' #spellcasting_ability')[0];
        const spellSaveDC = q('#' + it.draggableContainerId + ' #spell_save_dc')[0];
        const spellAtkBonus = q('#' + it.draggableContainerId + ' #spell_atk_bonus')[0];
        const spellcasting = it.getSpellModifiers();
        spellAbilitySelect.value = spellcasting.selected;
        spellSaveDC.innerHTML = spellcasting.spellSave;
        spellAtkBonus.innerHTML = (spellcasting.spellAtkBonus >= 0 ? '+' : '') + spellcasting.spellAtkBonus;
    }

    fillAbilityScores(it) {
        const scoreProficiencyCheckboxes = q('#' + it.draggableContainerId + ' input.score_prof');
        const abilityScores = JSON.parse(it.info.ability_scores);
        for (let score of scoreProficiencyCheckboxes) {
            // * begin::PROFICIENCY CHECKBOX * //
            let split = score.getAttribute('name').split('_');
            let scoreName = split[split.length - 1];
            let scoreVal = abilityScores[scoreName].is_prof;
            score.checked = scoreVal === "1";
            // * end::PROFICIENCY CHECKBOX * //
            // * begin::PROFICIENCY LABEL * //
            const profLabel = q('#' + it.draggableContainerId + ' label[for="this_prof_' + scoreName + '"]')[0];
            profLabel.innerHTML = score.checked ? '+' + it.getProficiency() : '+0';
            // * end::PROFICIENCY LABEL * //
            // raw score modifier
            let rawScore = it.getRawScoreModifier(scoreName);
            rawScore = (rawScore >= 0 ? '+' : '') + rawScore;
            // proficiency plus score modifier
            let profScore = it.getProfScoreModifier(scoreName);
            profScore = (profScore >= 0 ? '+' : '') + profScore;
            // * begin::SCORE MODIFIERS * //
            let rawModifierLabel = q('#' + it.draggableContainerId + ' label[for="this_score_' + scoreName + '"]')[0];
            if (rawModifierLabel) rawModifierLabel.innerHTML = rawScore;
            let profModifierButton = q('#' + it.draggableContainerId + ' button[name="this_save_' + scoreName + '"]')[0];
            if (profModifierButton) profModifierButton.innerHTML = 'SAVING THROW ' + (score.checked ? profScore : rawScore);
            // * end::SCORE MODIFIERS * //
        }
    }

    fillSkills(it) {
        const skillsCheckboxes = q('#' + it.draggableContainerId + ' .skill_prof');
        for (let sk of skillsCheckboxes) {
            // we take this_skill_ away
            let skillName = sk.getAttribute('name').substring(11);
            // Get value from db
            let skill = it.getSkill(skillName);
            // Fill value
            sk.value = skill.is_prof;
            let isProficient = sk.value === "1";
            let isExpert = sk.value === "2";
            // Check or uncheck it
            sk.checked = isProficient || isExpert;
            // Toggle colour
            sk.classList.toggle('expertise', isExpert);
            // Button for skill
            const btn = q('#' + it.draggableContainerId + ' button.' + skillName)[0];
            let modifier = it.getSkillProficiency(skillName);
            modifier = modifier >= 0 ? '+' + modifier : modifier;
            btn.innerHTML = getTitle(skillName) + ' (' + skill.score + ') ' + modifier;
        }
    }

    fillHealth(it) {
        const checks = this.getHealthGroup(it);
        const health = JSON.parse(it.info.health);
        let exhaustionEffects = q('#' + it.draggableContainerId + ' .exhaustion_effects')[0];
        if (health.conditions.exhaustion.lvl === "0") {
            exhaustionEffects.innerHTML = '';
        } else {
            exhaustionEffects.innerHTML = '<b>Exhaustion effects:</b>';
        }
        for (let checkGroup of checks) {
            for (let check of checkGroup) {
                // Death saves
                if (check.classList.contains('death_saves')) {
                    const death_saves = health.death_saves;
                    // Successes
                    if (check.classList.contains('success')) {
                        check.checked = check.value <= death_saves.successes;
                    } // Failures
                    else if (check.classList.contains('danger')) {
                        check.checked = check.value <= death_saves.failures;
                    }
                } // Exhaustion
                else if (check.classList.contains('exhaustion')) {
                    const exhaustion = health.conditions.exhaustion;
                    check.checked = check.value <= exhaustion.lvl;
                    if (check.checked) exhaustionEffects.innerHTML += "<br/> - " + exhaustion[check.value];
                } // Conditions
                else if (check.classList.contains('condition')) {
                    const conditions = health.conditions;
                    let split = check.getAttribute('name').split('_');
                    let conditionName = split[split.length - 1];
                    check.checked = conditions[conditionName] === "1";
                }
            }
        }
        // * Hit dice select & button * //
        const hitDiceButton = q('#' + it.draggableContainerId + ' button[name=this_hit_dice_btn]')[0];
        const hitDiceSelect = q('#' + it.draggableContainerId + ' select[name=this_hit_dice]')[0];
        hitDiceSelect.value = health.hit_points.this_hit_dice;
        hitDiceButton.value = health.hit_points.this_hit_dice;
    }

    fillDataFrom(it) {
        this.inputFields = q('#' + it.draggableContainerId + ' input.this-role-form-field');
        for (let i of this.inputFields) {
            let divName = i.getAttribute('name');
            this.getFields = () => {
                switch (divName) {
                    case 'xp':
                        return it.getLevel(i.value);
                    case 'this-ac':
                        return it.getClassArmor();
                    case 'this-prof':
                        // This is the proficiency bonus main square
                        return it.getProficiency();
                    case 'this_init':
                        return (it.getInitTierBreaker() >= 0 ? '+' : '') + it.getInitTierBreaker();
                    case 'cur_hd':
                        it.getLevel()
                        return it.getLevel();
                    default:
                        return i.value;
                }
            }
            let data_from_sheet = q('#' + it.draggableContainerId + ' [data-from="' + divName + '"]');
            for (let el of data_from_sheet) {
                el.innerHTML = this.getFields();
            }
        }
    }

    set FieldListeners(it) {
        //* begin::Input type text fields *//
        this.BlurFields = it;
        //* end::Input type text fields *//
        //* begin::Image change *//
        this.ItemImage = it;
        //* end::Image change *//
        if (it.info.item_type !== 'character') return;
        //* begin::Inspiration *//
        this.Inspiration = it;
        //* end::Inspiration *//
        //* begin::Spellcasting *//
        this.Spellcasting = it;
        //* end::Spellcasting *//
        //* begin::Ability score proficiencies *//
        this.ScoreProfs = it;
        //* end::Ability score proficienciess *//
        //* begin::Skills *//
        this.Skills = it;
        //* end::Skills *//
        //* begin::Health group *//
        this.HealthGroup = it;
        //* end::Health group *//
        //* begin::Table *//
        this.Tables = it;
        //* end::Table *//
    }

    set BlurFields(it) {
        this.inputFields = q('#' + it.draggableContainerId + ' input.this-role-form-field');
        this.textAreas = q('#' + it.draggableContainerId + ' textarea.this-role-form-field');
        [this.inputFields, this.textAreas].forEach(field => {
            for (let f of field) {
                f.blur(() => {
                    this.saveField(f, it.info.item_id);
                });
            }
        });
    }

    set ItemImage(it) {
        const iconInput = q('#' + it.draggableContainerId + ' .this-role-form-field[name="item_icon"]')[0];
        iconInput.change(() => {
            //readImageChange(iconInput, q('#' + it.draggableContainerId + ' span.item_icon-holder')[0]);
            //readImageChange(iconInput, q('#' + this.container + ' button[value="' + it.info.item_id + '"] span.item_icon-holder')[0]);
            this.saveField(iconInput, it.info.item_id).done((data) => {
                data = JSON.parse(data);
                if (data.response) return;
                $('.modal_error_response').html('Image could not be uploaded');
                $('#modal_error-toggle').click();
            });
        });
    }

    set Class(it) {
        const addClassBtn = q('#' + it.draggableContainerId + ' button[name=add_class]')[0];
        const saveClassesBtn = q('#' + it.draggableContainerId + ' button[name=save_classes]')[0];
        const errorMsg = q('#' + it.draggableContainerId + ' .class_groups_container .text-danger')[0];
        const deleteClass = () => {
            const deleteClassBtns = q('#' + it.draggableContainerId + ' .class_group button[name=delete_class]');
            for (let delBtn of deleteClassBtns) {
                delBtn.click(function () {
                    let row = this.parentElement.parentElement;
                    row.remove();
                });
            }
        }
        const rowNames = () => {
            const classSelect = q('#' + it.draggableContainerId + ' .class_group select[name=class]');
            const classLvl = q('#' + it.draggableContainerId + ' .class_group input.class_lvl');
            const classSubclass = q('#' + it.draggableContainerId + ' .class_group input.subclass');
            const classMain = q('#' + it.draggableContainerId + ' .class_group input.is_main');
            for (let i = 1; i < classSelect.length; i++) {
                classSelect[i].onchange = () => {
                    classLvl[i].setAttribute('name', classSelect[i].value + '_lvl');
                    classSubclass[i].setAttribute('name', classSelect[i].value + '_subclass');
                    classMain[i].setAttribute('name', classSelect[i].value + '_main');
                }
            }
        }
        const saveClass = () => {
            saveClassesBtn.click(() => {
                errorMsg.innerHTML = '';
                const classSelect = q('#' + it.draggableContainerId + ' .class_group select[name=class]');
                const classLvl = q('#' + it.draggableContainerId + ' .class_group input.class_lvl');
                const classSubclass = q('#' + it.draggableContainerId + ' .class_group input.subclass');
                const classMain = q('#' + it.draggableContainerId + ' .class_group input.is_main');
                let main = false;
                for (let m of classMain) {
                    if (m.checked) main = true;
                }
                if (!main) {
                    errorMsg.innerHTML = 'Select a main class';
                    return;
                }
                for (let i = 1; i < classSelect.length; i++) {
                    classMain[i].value = classMain[i].checked ? "1" : "0";
                    [classSelect[i], classLvl[i], classSubclass[i], classMain[i]].forEach((f) => {
                        this.saveField(f, it.info.item_id);
                    });
                }
            });
        }
        const addClass = () => {
            const classesContainer = q('#' + it.draggableContainerId + ' .class_groups_container .subcontainer')[0];
            addClassBtn.click(function () {
                const classRows = q('#' + it.draggableContainerId + ' .class_group');
                let row = classRows[0].innerHTML;
                classesContainer.innerHTML += '<div class="class_group flex-column justify-content-between gap-3 border-top-1px-gray-300 py-3">' + row + '</div>';
                deleteClass();
                rowNames();
            });
        };
        addClass();
        deleteClass();
        rowNames();
        saveClass();
    }

    set Inspiration(it) {
        const inspCont = q('#' + it.draggableContainerId + ' .inspiration')[0];
        const insp = q('#' + it.draggableContainerId + ' [name=inspiration]')[0];
        if (inspCont && insp) {
            inspCont.click(() => {
                this.saveField(insp, it.info.item_id);
            });
        }
    }

    set Spellcasting(it) {
        const spellAbilitySelect = q('#' + it.draggableContainerId + ' #spellcasting_ability')[0];
        spellAbilitySelect.onchange = () => {
            this.saveField(spellAbilitySelect, it.info.item_id);
        }
    }

    set ScoreProfs(it) {
        this.scoreProfs = q('#' + it.draggableContainerId + ' input.score_prof');
        // this.getDataFromFields(this.scoreProfs, item);
        for (let score of this.scoreProfs) {
            score.click(() => {
                this.saveField(score, it.info.item_id);
            });
        }
    }

    set Skills(it) {
        // These checkboxes will save if the character is proficient or expert in a skill
        this.skillChecks = q('#' + it.draggableContainerId + ' .skill_prof');
        for (let skillCheck of this.skillChecks) {
            skillCheck.click(() => {
                let newVal = skillCheck.value === "0" ? "1" : (skillCheck.value === "1" ? "2" : "0");
                skillCheck.checked = newVal !== "0";
                skillCheck.classList.toggle('expertise', newVal === "2");
                this.saveField(skillCheck, it.info.item_id).done(() => {
                    skillCheck.value = newVal;
                });
            });
        }
    }

    set HealthGroup(it) {
        // * Death saves, exhaustion group, health conditions * //
        const checks = this.getHealthGroup(it);
        for (let checkGroup of checks) {
            for (let check of checkGroup) {
                check.click((e) => {
                    e.preventDefault();
                    if (!check.classList.contains('condition')) {
                        // If check is checked means that's the new value
                        // If not, the new value is the previous or 0
                        let valHolder = check.value;
                        let newVal = check.checked
                            ? valHolder
                            : (check.previousElementSibling && check.previousElementSibling.classList.contains('exhaustion')
                                ? check.previousElementSibling.value
                                : "0");
                        check.value = newVal;
                        for (let i = 0; i < checkGroup.length; i++) {
                            checkGroup[i].checked = newVal > i;
                        }
                        this.saveField(check, it.info.item_id).done(() => {
                            check.value = valHolder;
                        });
                        return;
                    }
                    check.value = check.checked ? "1" : "0";
                    this.saveField(check, it.info.item_id);
                });
            }
        }
        // * Hit hice * //
        const curHitDice = q('#' + it.draggableContainerId + ' input[name=cur_hd]')[0];
        if (curHitDice) {
            // Limit hit dice to level
            curHitDice.onchange = (e) => {
                it = this.searchItem(it.info.item_id);
                if (curHitDice.value < 0) curHitDice.value = 0;
                if (curHitDice.value > it.getLevel()) curHitDice.value = it.getLevel();
            }
        }
        // * Hit dice throw & select * //
        const hitDiceButton = q('#' + it.draggableContainerId + ' button[name=this_hit_dice_btn]')[0];
        const hitDiceSelect = q('#' + it.draggableContainerId + ' select[name=this_hit_dice]')[0];
        hitDiceSelect.onchange = () => {
            hitDiceButton.value = hitDiceSelect.value;
            this.saveField(hitDiceSelect, it.info.item_id);
        }
    }

    set Tables(it) {
        this.characterTableButtons = [
            q('#bag_btn_' + it.info.item_id),
            q('#atk_spells_btn_' + it.info.item_id),
            q('#global_mods_btn_' + it.info.item_id),
            q('#tools_custskills_btn_' + it.info.item_id),
            q('#other_feats_btn_' + it.info.item_id)
        ];
        this.searchRow = (div) => {
            let row = div;
            while (row.parentElement && !row.parentElement.classList.contains('this_table')) {
                row = row.parentElement;
            }
            return row;
        }
        this.setRowDeletes = (t) => {
            let delBtns = q('#' + t.id + ' .delete_row');
            for (let btn of delBtns) {
                btn.click(() => {
                    let row = this.searchRow(btn);
                    row.remove();
                    this.saveTable(t);
                });
            }
        }

        // * begin::Listen to tables * //
        for (let btn of this.characterTableButtons) {
            if (btn[0] && btn[0].parentNode.nextElementSibling) {
                let table = btn[0].parentNode.nextElementSibling;
                // * begin::Fill tables * //
                this.fillTable(table, it);
                // * end::Fill tables * //
                // * begin::Listeners for the tables content * //
                this.accordionMenus(table);
                this.setRowListeners(table, it);
                this.setRowDeletes(table);
                // * end::Listeners for the tables content * //
                btn[0].click(() => {
                    // * begin::On click, add new row and reset listeners * //
                    this.createNewRow(table);
                    // * end::On click, add new row and reset listeners * //
                    // * begin::Reset listeners for the tables content * //
                    this.accordionMenus(table);
                    this.setRowListeners(table, it);
                    this.setRowDeletes(table);
                    // * end::Reset listeners for the tables content * //
                });
            }
        }
        // * end::Listen to tables * //
    }

    accordionMenus = (t) => {
        let menus = q('#' + t.id + ' .menu-item.menu-accordion');
        for (let m of menus) {
            m.click((e) => {
                let btn = false;
                for (let child of m.children[0].children) {
                    if (child.nodeName === "BUTTON") {
                        btn = child;
                    }
                }
                if (e.target === btn || e.target === btn.children[0]) {
                    m.toggleClass('hover');
                    m.toggleClass('show');
                    this.saveTable(t);
                }
            });
        }
    }

    setRowListeners(t, it) {
        let split = t.id.split('_');
        let tableName = split[0];
        for (let i = 1; i < split.length; i++) {
            if (i != split.length - 1) tableName += '_' + split[i];
        }
        let fields = q('#' + it.draggableContainerId + ' #' + t.id + ' .this_field');
        this.fill = () => {
            for (let f of fields) {
                if (f.nextElementSibling) {
                    // Fill values according to next HTML span
                    if (f.getAttribute('type') === "checkbox") {
                        f.checked = f.nextElementSibling.innerHTML === "1";
                    }
                    f.value = f.nextElementSibling.innerHTML;
                }
            }
            it = this.searchItem(it.info.item_id);
            switch (tableName) {
                case 'bag':
                    this.weightCalculate(t, it);
                    break;
                case 'attacks':
                    this.writeAtkThrow(t, it);
                    break;
                case 'global_modifiers':
                    this.writeGlobalMods(t, it);
                case 'tools_n_custom':
                case 'custom_features':
            }
        }
        this.fill();
        for (let f of fields) {
            f.blur(() => {
                // * Save value to the next HTML span * //
                if (f.nextElementSibling) {
                    // Set value to [0,1] if checkbox
                    if (f.getAttribute('type') === "checkbox") {
                        if (f.checked) f.value = "1";
                        else f.value = "0";
                    }
                    // Set html to next element
                    f.nextElementSibling.innerHTML = f.value;
                }
                // Save table
                this.saveTable(t);
                // Reset data auto filling
                this.fill();
            });
        }
    }

    weightCalculate(t, it) {
        let units = q('#' + t.id + ' input.units');
        let weights = q('#' + t.id + ' input.weight');
        if (units.length > 0 && units.length === weights.length) {
            let totalWeight = 0;
            let overWeight = 0;
            for (let i = 0; i < units.length; i++) {
                let u = units[i].value;
                let w = weights[i].value;
                if (u !== '' && u !== '0' && w !== '' && w !== '0') {
                    totalWeight += parseFloat(u) * parseFloat(w);
                }
            }
            if (totalWeight > it.getCarryingCapacityLb()) {
                overWeight = totalWeight - it.getCarryingCapacityLb();
            }
            let tw = q('#' + t.id + ' ~ div .total_weight')[0];
            if (tw) tw.innerHTML = '<span>' + totalWeight + '</span>';
            let ow = q('#' + t.id + ' ~ div .overweight')[0];
            if (ow) ow.innerHTML = (overWeight > 0 ? '<span class="text-danger">' : '<span>') + overWeight + '</span>';
        }
    }

    writeAtkThrow(t, it) {
        let throwAtkClick = q('#' + t.id + ' .throw_attack');
        this.name = (click, name) => {
            click.children[0].innerHTML = name.value;
        };
        this.attack = (click, atkRow) => {
            it = this.searchItem(it.info.item_id);
            let atkMod = it.getRawScoreModifier(atkRow[0].value);
            let atkOther = atkRow[1].value !== '' && !isNaN(atkRow[1].value) ? atkRow[1].value : 0;
            let atkProf = atkRow[2].checked ? it.getProficiency() : 0;
            let attackModTotal = atkMod + parseInt(atkOther) + atkProf;
            let symbol = attackModTotal >= 0 ? '+' : '';
            click.children[1].innerHTML = 'atk ' + symbol + attackModTotal;
        };
        this.damage = (click, dmgRow) => {
            let dmgDice = dmgRow[0].value;
            let dmgMod = it.getRawScoreModifier(dmgRow[1].value);
            let dmgOther = dmgRow[2].value !== '' ? dmgRow[2].value : 0;
            let dmgModTotal = !isNaN(dmgOther) ? dmgMod + parseInt(dmgOther) : dmgMod !== 0 ? dmgMod + '+' + dmgOther : dmgOther;
            let dmgType = dmgRow[3].value;
            let symbol = dmgMod >= 0 ? '+' : '';
            let damageModTotal = dmgDice + (dmgModTotal !== 0 ? symbol + dmgModTotal : '') + ' ' + dmgType;
            click.children[2].innerHTML = 'dmg ' + damageModTotal;
        };
        for (let click of throwAtkClick) {
            const row = this.searchRow(click);
            const name = row.children[1].children[0].children[0];
            const atkRow = [
                row.children[1].children[1].children[0].children[1],
                row.children[1].children[1].children[0].children[3],
                row.children[1].children[1].children[0].children[5],
            ];
            const dmgRow = [
                row.children[1].children[2].children[0].children[0].children[1],
                row.children[1].children[2].children[0].children[0].children[3],
                row.children[1].children[2].children[0].children[0].children[5],
                row.children[1].children[2].children[0].children[1].children[1],
            ];
            this.name(click, name);
            this.attack(click, atkRow);
            this.damage(click, dmgRow);
            name.onchange = () => {
                click.children[0].innerHTML = name.value;
            }
            for (let atkCol of atkRow) {
                atkCol.onchange = () => {
                    this.attack(click, atkRow);
                }
            }
            for (let dmgCol of dmgRow) {
                dmgCol.onchange = () => {
                    this.damage(click, dmgRow);
                }
            }
            click.click(() => {
                console.log('Throw attack! But not here.');
            });
        }
    }

    writeGlobalMods(t, it) {
        const rows = q('#' + t.id + ' .menu-accordion');
        for (let row of rows) {
            const click = row.children[0].children[0].children;
            const inputs = [
                row.children[1].children[0].children[0],
                row.children[1].children[1].children[0].children[1],
                row.children[1].children[1].children[1].children[1],
                row.children[1].children[2].children[0].children[1],
                row.children[1].children[2].children[1].children[1],
                row.children[1].children[3].children[0].children[1],
            ];
            for (let i = 0; i < click.length; i++) {
                click[i].innerHTML = inputs[i].value !== '' ? inputs[i].value : (inputs[i].getAttribute('placeholder') === 'Bless' ? 'Name' : '_');
                inputs[i].onchange = () => {
                    click[i].innerHTML = inputs[i].value !== '' ? inputs[i].value : (inputs[i].getAttribute('placeholder') === 'Bless' ? 'Name' : '_');
                }
            }
        }
    }

    abiliyScoresSelect() {
        return '<select class="this_field form-control form-select w-65px ps-2" aria-selected="-1">' +
            '<option value="none" selected>NONE</option>' +
            '<option value="str">STR</option>' +
            '<option value="dex">DEX</option>' +
            '<option value="con">CON</option>' +
            '<option value="int">INT</option>' +
            '<option value="wis">WIS</option>' +
            '<option value="cha">CHA</option>' +
            '</select>' +
            '<span class="d-none">-1</span>';
    }

    fillTable(t, it) {
        t.innerHTML = '';
        // Get table name
        let tableName = t.id.substring(0, t.id.lastIndexOf('_'));
        if (!it.info[tableName] || it.info[tableName] === '') {
            // Add header
            switch (tableName) {
                case 'bag':
                    t.innerHTML = this.headerBag();
                    break;
                case 'global_modifiers':
                    t.innerHTML = this.headerGlobalMods();
                    break;
                case 'tools_n_custom':
                    break;
                case 'custom_features':
                    break;
            }
            // A sample row
            this.createNewRow(t);
            return;
        }
        //* FIRST LOAD WHEN OPENING ITEM MODAL *//
        t.innerHTML += it.info[tableName];
    }

    headerBag() {
        return '<!--begin::Head-->' +
            '<div class="flex-row-wrap justify-content-between text-gray-700 fw-bolder text-capitalize border-bottom-1px-gray-300">' +
            '    <div class="text-start w-50px">UNITS</div>' +
            '    <div class="text-start">ITEM NAME</div>' +
            '    <div class="text-end w-50px">WEIGHT</div>' +
            '    <div class="text-center"></div>' +
            '</div>' +
            '<!--end::Head-->';
    }

    headerAttacks() {
        return '<!--begin::Head-->' +
            '<div class="flex-row-wrap justify-content-between text-gray-700 fw-bolder text-capitalize border-bottom-1px-gray-300">' +
            '    <div class="text-start">NAME</div>' +
            '    <div class="text-start">ATK/SAVE</div>' +
            '    <div class="text-end">DMG</div>' +
            '    <div class="text-center"></div>' +
            '</div>' +
            '<!--end::Head-->';
    }

    headerGlobalMods() {
        return '<!--begin::Head-->' +
            '<div class="flex-row-wrap justify-content-between text-gray-700 fw-bolder text-capitalize border-bottom-1px-gray-300">' +
            '    <div class="globalmods">NAME</div>' +
            '    <div class="globalmods">ATK</div>' +
            '    <div class="globalmods">DMG</div>' +
            '    <div class="globalmods">SKILLS</div>' +
            '    <div class="globalmods">SAVE</div>' +
            '    <div class="globalmods">CA</div>' +
            '    <div class="globalmods ps-12"></div>' +
            '</div>' +
            '<!--end::Head-->';
    }

    createNewRow(t) {
        // Attacks and spells
        if (t.classList.contains('attacks_spells_table')) {
            t.innerHTML += this.rowAttacksSpells();
        } // Global modifiers
        else if (t.classList.contains('global_modifiers_table')) {
            t.innerHTML += this.rowGlobalModifiers();
        } // Bag
        else if (t.classList.contains('bag_table')) {
            t.innerHTML += this.rowBag();
        } // Other features
        else if (t.classList.contains('other_feats_table')) {
            // Div to fill ????
            t.innerHTML += this.rowCustomFeatures();
        }
    }

    rowBag() {
        return '<!--begin::Row-->' +
            ' <div class="flex-row justify-content-between align-items-center border-bottom-1px-gray-300 py-1 gap-1">' +
            '    <div class="text-start w-50px">' +
            '        <input type="number" value="0" placeholder="0"' +
            '             class="this_field form-control units text-center"/>' +
            '        <span class="d-none"></span>' +
            '    </div>' +
            '    <div class="text-start">' +
            '        <input type="text" placeholder="Shield"' +
            '             class="this_field form-control ps-2"/>' +
            '        <span class="d-none"></span>' +
            '    </div>' +
            '    <div class="text-end w-50px">' +
            '        <input type="number" step="0.5" placeholder="6.5"' +
            '             class="this_field form-control text-center weight"' +
            '             style="background-position: right;"/>' +
            '        <span class="d-none"></span>' +
            '    </div>' +
            '    <!--begin:Menu item-->' +
            '    <div class="menu-item d-flex align-self-end text-center">' +
            '        <button class="btn btn-sm delete_row" style="padding: 1px;">' +
            '            <i class="fa-solid fa-trash fs-9 text-danger" style="margin-left: 4px;margin-top: -1px;"></i>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu item-->' +
            ' </div>' +
            ' <!--end::Row-->';
    }

    rowAttacksSpells() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" id="atk_row" class="menu-item menu-accordion hover show border-bottom-1px-gray-300">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link gap-2">' +
            '        <div class="flex-row-wrap menu-title gap-3 align-items-center text-hover-primary text-gray-700 fw-bolder text-capitalize throw_attack">' +
            '            <span class="menu-title gap-1 px-3 border-end-1px-gray-300">Name</span>' +
            '            <span class="menu-title gap-1 px-3 border-end-1px-gray-300">Atk/Save</span>' +
            '            <span class="menu-title gap-1 px-3">Dmg</span>' +
            '        </div>' +
            '        <button class="btn py-1 pe-0">' +
            '           <span class="menu-arrow" style="width: 1rem;height:1rem;"></span>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu link-->' +
            '    <!--begin:Menu sub-->' +
            '    <div class="menu-sub menu-sub-accordion p-2 gap-2">' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item">' +
            '           <input type="text" placeholder="Name"' +
            '               class="menu-title this_field form-control ps-2 fs-6 name"/>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item border-bottom-1px-gray-300 pb-2">' +
            '           <div class="flex-row-wrap align-items-center justify-content-start gap-2 attack_mods">' +
            '               <span class="fw-bolder">Attack:</span>' +
            '               ' + this.abiliyScoresSelect() +
            '               + <input type="text" placeholder="0"' +
            '                      class="this_field form-control w-25px text-center"/>' +
            '               <span class="d-none"></span>' +
            '               <input type="checkbox" class="this_field form-control form-check-input">' +
            '               <span class="d-none"></span>' +
            '               <label for="" class="form-check-label fs-9 fw-bolder">PROF</label>' +
            '           </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item border-bottom-1px-gray-300 pb-2">' +
            '            <div class="flex-column dmg_mods gap-1">' +
            '                <div class="flex-row-wrap align-items-center justify-content-start gap-2">' +
            '                    <span class="fw-bolder">Damage:</span>' +
            '                    <input type="text" placeholder="1d6"' +
            '                         class="this_field form-control w-25px text-center"/>' +
            '                    <span class="d-none"></span>' +
            '                    + ' + this.abiliyScoresSelect() +
            '                    + <input type="text" placeholder="0"' +
            '                         class="this_field form-control w-20px text-center"/>' +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '                <div class="flex-row-wrap align-items-center justify-content-start gap-2">' +
            '                    <label for="" class="form-check-label fs-9 fw-bolder">TYPE</label>' +
            '                    <input type="text" placeholder="Slashing"' +
            '                         class="this_field form-control w-100px ps-1">' +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item pb-2">' +
            '            <div class="flex-column saving_throw gap-1">' +
            '                <div class="flex-row-wrap align-items-center justify-content-start gap-2">' +
            '                <span class="fw-bolder">Saving Throw:</span>' +
            '                ' + this.abiliyScoresSelect() +
            '                    <label class="fs-9 text-uppercase fw-bolder"> vs dc</label>' +
            '                ' + this.abiliyScoresSelect() +
            '                </div>' +
            '                <div class="flex-row-wrap align-items-center justify-content-start gap-2">' +
            '                    <label class="fs-9 text-uppercase fw-bolder"> SAVE EFFECT: </label>' +
            '                    <input type="text" placeholder="Half-damage"' +
            '                         class="this_field form-control w-100px ps-1">' +
            '                    <span class="d-none"></span>' +
            '                </div>' +
            '            </div>' +
            '        </div>' + '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item d-flex align-self-end position-relative" style="margin-top: -15px;">' +
            '            <button class="btn btn-sm delete_row" style="padding: 1px;">' +
            '                <i class="fa-solid fa-trash fs-9 text-danger" style="margin-left: 4px;margin-top: -1px;"></i>' +
            '            </button>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '    </div>' +
            '</div>' +
            '<!--end::Menu Accordion-->';
    }

    rowGlobalModifiers() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link text-gray-700 fw-bolder text-capitalize ps-0 gap-1">' +
            '        <div class="menu-title gap-1 align-items-center justify-content-between text-hover-primary">' +
            '            <div class="menu-title globalmods">Name</div>' +
            '            <div class="menu-title globalmods">Atk</div>' +
            '            <div class="menu-title globalmods">Dmg</div>' +
            '            <div class="menu-title globalmods">Skills</div>' +
            '            <div class="menu-title globalmods">CA</div>' +
            '            <div class="menu-title globalmods">Save</div>' +
            '        </div>' +
            '        <button class="btn py-1 pe-0">' +
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
            '        </div>' +
            '        <div class="flex-row align-items-center justify-content-start">' +
            '            <div class="flex-row gap-2 col-6">' +
            '                <span class="fw-bolder">Attack:</span>' +
            '                <input type="text" placeholder="1d4"' +
            '                     class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '                <span class="d-none"></span>' +
            '            </div>' +
            '            <div class="flex-row gap-2">' +
            '                <span class="fw-bolder">Damage:</span>' +
            '                <input type="text" placeholder="1d4"' +
            '                     class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '                <span class="d-none"></span>' +
            '            </div>' +
            '        </div>' +
            '        <div class="flex-row align-items-center justify-content-start">' +
            '            <div class="flex-row gap-2 col-6">' +
            '                <span class="fw-bolder">Skills:</span>' +
            '                <input type="text" placeholder="1d4"' +
            '                     class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '                <span class="d-none"></span>' +
            '            </div>' +
            '            <div class="flex-row gap-2">' +
            '                   <span class="fw-bolder">CA:</span>' +
            '                   <input type="text" placeholder="1"' +
            '                        class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '                   <span class="d-none"></span>' +
            '            </div>' +
            '        </div>' +
            '        <div class="flex-row align-items-center justify-content-start">' +
            '            <div class="flex-row gap-2">' +
            '                <span class="fw-bolder">Saving Throw:</span>' +
            '                <input type="text" placeholder="1d4"' +
            '                     class="menu-title this_field form-control ps-2 fs-6 w-50px"/>' +
            '                <span class="d-none"></span>' +
            '            </div>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item d-flex align-self-end position-relative mt--25px">' +
            '            <button class="btn btn-sm btn-danger delete_row" style="padding: 1px;">' +
            '                <i class="fa-solid fa-trash fs-9" style="margin-left: 4px;margin-top: -1px;"></i>' +
            '            </button>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '    </div>' +
            '</div>' +
            '<!--end::Menu Accordion-->';
    }

    rowCustomFeatures() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link ps-0 gap-1">' +
            '        <div class="menu-title gap-1 flex-column align-items-start">' +
            '            <div class="menu-title gap-1 w-100">' +
            '               <input type="text" placeholder="Name"' +
            '                    class="menu-title this_field form-control ps-2 text-gray-700 fw-bolder fs-7 border-0"/>' +
            '               <span class="d-none"></span>' +
            '            </div>' +
            '            <div class="menu-title gap-1 w-100">' +
            '               <input type="text" placeholder="Source"' +
            '                   class="menu-title this_field form-control ps-2 border-0"/>' +
            '               <span class="d-none"></span>' +
            '            </div>' +
            '        </div>' +
            '        <button class="btn py-1 px-0">' +
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
            '               class="menu-title this_field form-control p-2 border-0" rows="10"></textarea>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '    </div>' +
            '</div>' +
            '<!--end::Menu Accordion-->';
    }
}