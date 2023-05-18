class Journal {
    constructor(id, options = {}) {
        this.opt = options;
        this.url = {
            save: '',
            get: '/app/games_ajax/get_journal_items/' + dbGame.game_id
        }
        this.folder = '/assets/media/games/' + dbGame.game_folder + '/players/';
        this.container = id;
        this.itemClass = id + '_item';
        this.sheetsContainer = 'draggable-modals_container';
        this.select = q('#charsheet_selected')[0];
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
        this.icon = () => {
            let icon = this.folder + this.info.item_icon;
            if (urlExists(icon)) return icon;
            return '/assets/media/games/blank.png';
        }
        this.openItem = async (htmlText) => {
            q('#' + this.modalsContainer)[0].innerHTML += htmlText;
            this.iconHolder = q('#' + this.draggableContainerId + ' .item_icon-holder');
            if (this.iconHolder.length > 0) {
                this.iconHolder[0].style.backgroundImage = 'url("' + this.icon() + '")';
            }
        }
        this.getLevel = () => {
            let lvl = 0;
            if (this.info.classes) {
                const classes = JSON.parse(this.info.classes);
                for (let i in classes) {
                    let c = classes[i];
                    if (c.lvl && c.lvl !== "" && c.lvl !== "0" && !isNaN(c.lvl)) {
                        lvl += parseInt(c.lvl);
                    }
                }
            }
            return lvl !== 0 ? lvl : 1;
        }
        this.getClassArmor = () => {
            // Base armor starts in 10
            let this_ac = 10;
            // Check character sheet is correctly filled
            let dex = this.getRawScoreModifier('dex');
            let con = this.getRawScoreModifier('con');
            let main_class = this.getMainClass();
            if (dex && main_class) {
                let armor = this.info.bag.armor && this.info.bag.armor.equiped ? this.info.bag.armor.val : 0;
                // This is yet to write
                let heavyArmor = false;
                let shield = 0;
                let custom_mods = 0;
                // Then you add: DEX modifier, armor modifier, shield
                // Always add custom modifiers
                this_ac += parseInt(custom_mods);
                // Add constitution modifier if it is a barbarian or a monk while not wearing any armor
                if (con && main_class.class.match(/barbarian|monk/) && !armor && !shield) {
                    this_ac += con;
                }
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
        this.getMainClass = () => {
            if (this.info.classes) {
                let classes = JSON.parse(this.info.classes)
                if (classes) {
                    for (let c of classes) {
                        if (c.is_main) return c;
                    }
                }
            }
            return false;
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
                        return Math.floor((parseInt(scores[i].score) - 10) / 2) +
                            (scores[i].is_prof === "1" ? this.getProficiency() : 0) + '';
                    }
                }
                return modifier;
            }
            return false;
        }
        this.getInitTierBreaker = () => {
            // Add init modifiers (?)
            const tierBreaker = 1.045;
            let dex = this.getRawScoreModifier('dex');
            if (!dex) dex = 0;
            return dex * tierBreaker;
        }
        this.getCarryingCapacity = () => {
            if (this.info.ability_scores) {
                const str = JSON.parse(this.info.ability_scores).str.score;
                return parseFloat(str) * 6.80389;
            }
        }
    }

    set JournalChanged(bool) {
        this.changed = bool;
    }

    initJournal(board = null) {
        this.dataHasChanged = (data) => {
            if (data.results.length !== Object.keys(this.items).length) return true;
            // Run loop on results
            if (!this.items) return true;
            for (let i in data.results) {
                // Save Database item
                let dbItem = data.results[i];
                // Save its equal item from journal
                let thisItem = this.items[i].info;
                for (let j in dbItem) {
                    if (typeof thisItem[j] === 'object') thisItem[j] = JSON.stringify(thisItem[j]);
                    // Compare their values
                    if (dbItem[j] != thisItem[j] &&
                        !(dbItem[j] === null && thisItem[j] === null) &&
                        !(dbItem[j] === 'null' && thisItem[j] === 'null') &&
                        !(dbItem[j] === null && thisItem[j] === 'null')) {
                        // Save new values into this.items.info
                        return true;
                    }
                }
            }
            return false;
        }
        // If ajax, init journal item creation from url
        // Get data through ajax
        return ajax(this.url.get).done((data) => {
            // Checck data is not null
            this.JournalChanged = true;
            if (data.results && typeof data.results === 'object' && data.results.length > 0) {
                // If the length of both arrays is not the same, items have changed
                // -> (Items have been added or deleted)
                // If no new or deleted items, check if inner info has changed
                this.JournalChanged = false;
                if (this.dataHasChanged(data)) {
                    this.JournalChanged = true;
                    q('#' + this.container)[0].innerHTML = '';
                    this.items = {}
                    //* Save items into this.items *//
                    this.saveResults(data);
                    // Show list
                    this.formatJournalItems();
                    // Load admin select
                    if (this.adminParent) this.loadAdminSelect();
                }
            } else this.items = {}
        }).fail((e) => {
            //* Init journal for admin *//
            console.log("Error: ", e.responseText);
        });
    }

    loadAdminSelect() {
        // * begin::Select Items * //
        this.loadAdminItems = () => {
            if (Object.keys(this.items).length > 0) {
                this.selectItem.innerHTML = '';
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
        if (this.selectItem) this.loadAdminItems();
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
                        players[o.id] = o.id.substring(2);
                    }
                }
            });
            if (Object.keys(players).length > 0) {
                post.players = players;
            }
            console.log(post)
            return post;
        }
        this.saveJournalItem = () => {
            toggleProgressSpinner(true);
            // Check if item id is saved -> This tells the difference between a new item and an update
            ajax('/app/games_ajax/set_journal_item/' + dbGame.game_id, this.getJournalModalForm())
                .done((data) => {
                    console.log(data);
                    if (data.response) {
                        // Dismiss journal modal
                        $('.modal_success_response').html(data.msg);
                        $('#modal_success-toggle').click();
                    } else if (data.msg) {
                        $('#modal_journal .error').show();
                    }
                    toggleProgressSpinner(false);
                }).fail((e) => {
                console.log("Error: ", e.responseText);
                toggleProgressSpinner(false);
            });
        }
        if (this.createItemBtn) {
            this.createItemBtn.click(() => {
                this.saveJournalItem();
            });
        }
        // * end::Create item * //

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
                }).fail((e) => {
                console.log("Error: ", e.responseText);
            });
        }
        if (this.selectItem && this.deleteItemBtn && Object.keys(this.items).length > 0) {
            this.deleteItemBtn.click(() => {
                openConfirmation(this.deleteJournalItem);
            });
        }
        //* end::Delete item *//
    }

    saveResults(data) {
        // Iterate results
        for (let item of data.results) {
            let viewer = false;
            let editor = false;
            // Check if viewer
            if (item.item_viewers) {
                item.item_viewers = JSON.parse(item.item_viewers);
                for (let i of item.item_viewers) {
                    if (i == session.user_id) viewer = true;
                }
            }
            // Check if editor
            if (item.item_editors) {
                item.item_editors = JSON.parse(item.item_editors);
                for (let i of item.item_editors) {
                    if (i == session.user_id) editor = true;
                }
            }
            // Save if conditions are met
            if (session.user_id === dbGame.game_creator || viewer || editor) {
                // Save a DND sheet for each item
                this.items[Object.keys(this.items).length] = new this.SheetDnD(this.sheetsContainer, {
                    itemInfo: item,
                    folder: this.folder,
                });
            }
        }
    }

    formatJournalItems() {
        this.chatSelect = (item) => {
            if (!this.select) return;
            this.select.innerHTML += '<option value="' + item.item_id + '">' + item.item_name + '</option>';
        }
        // Reset select HTML
        if (this.select) this.select.innerHTML = '<option selected value="username">' + session.user_username + '</option>';
        // Rerun items
        for (let i in this.items) {
            let item = this.items[i];
            // Journal list
            this.addItemBtnToList(item);
            // Select for chat
            if (item.info.item_type === 'character') this.chatSelect(item.info);
        }
    }

    addItemBtnToList(item) {
        // Check image data, if it does not exist, put a default one
        q('#' + this.container)[0].innerHTML += '' +
            '<!--begin::Menu Item-->' +
            ' <div class="menu-item ' + this.itemClass + '">' +
            // Assign item ID to button for later accessing
            '     <button type="button" class="btn menu-link col-12"' + (item.info.item_type === 'character' ? ' draggable="true"' : '') + ' value="' + item.info.item_id + '">' +
            '         <!--begin::Symbol-->' +
            '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '             <span class="symbol-label circle item_icon-holder"' +
            '                  style="background-image: url(' + item.icon() + ');' +
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
            let id = itemOpened.id.charAt(itemOpened.id.length - 1);
            let this_item = this.searchItem(id);
            // Go to next opened draggable DOM item if journal item is not found
            if (!this_item || this_item === {}) continue;
            //* HERE LOAD ITEM INFO *//
            // this.getDataFromFields()

            // Fill from data base and listen to changes to save that data
            this.FieldListeners = this_item;
        }
    }

    fillDraggable(it) {
        this.fillDataFrom(it);
        this.fillBlurFields(it);
        this.fillInspiration(it);
        this.fillAbilityScores(it);
        this.fillSkills(it);
        this.fillHealth(it);
        // Missing: table row titles ?
        // Class list
        // Hit dices select
    }

    fillBlurFields(it) {
        this.inputFields = q('#' + it.draggableContainerId + ' input.this-role-form-field');
        this.textAreas = q('#' + it.draggableContainerId + ' textarea.this-role-form-field');
        [this.inputFields, this.textAreas].forEach(fields => {
            for (let f of fields) {
                let divName = f.getAttribute('name');
                if (divName.match(/item_icon/)) {
                    it.iconHolder = q('#' + it.draggableContainerId + ' .item_icon-holder');
                    if (it.iconHolder[0]) it.iconHolder[0].style.backgroundImage = 'url("' + it.icon() + '")';
                } // it.info.info
                else if (divName.match(/race|background|walkspeed/)) {
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
        const skillProficiencies = JSON.parse(it.info.skill_proficiencies);
        for (let skill of skillsCheckboxes) {
            let split = skill.getAttribute('name').split('_');
            let skillName = split[split.length - 1];
            let skillVal = skillProficiencies[skillName];
            skill.value = skillVal;
            skill.checked = skillVal === "1" || skillVal === "2";
            skill.classList.toggle('expertise', skillVal === "2");
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
                    if (check.checked)
                        exhaustionEffects.innerHTML += "<br/> - " + exhaustion[check.value];
                } // Conditions
                else if (check.classList.contains('condition')) {
                    const conditions = health.conditions;
                    let split = check.getAttribute('name').split('_');
                    let conditionName = split[split.length - 1];
                    check.checked = conditions[conditionName] === "1";
                }
            }
        }
    }

    fillDataFrom(it) {
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
                        return '+' + it.getInitTierBreaker();
                    case 'cur_hd':
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
        //* begin::Inspiration *//
        this.Inspiration = it;
        //* end::Inspiration *//
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

        // * Set class adding

        // * Set hit dices SELECT

        // * Set tables ? -> Abilities

        // * Set Spellcasting ability-> Spell Save DC -> Spell attack bonus
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
            this.saveField(iconInput, it.info.item_id).done((data) => {
                data = JSON.parse(data);
                if (data.response) return;
                $('.modal_error_response').html('Image could not be uploaded');
                $('#modal_error-toggle').click();
            });
        });
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
        const getSkillValue = (skill) => {
            let wasNotProficient = skill.checked === false;
            let wasProficient = skill.checked && !skill.classList.contains('expertise');
            return wasNotProficient ? "1" : (wasProficient ? "2" : "0");
        }
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
        const checks = this.getHealthGroup(it);
        for (let checkGroup of checks) {
            for (let check of checkGroup) {
                check.click(() => {
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
    }

    set Tables(it) {
        this.characterTableButtons = [
            q('#atk_spells_btn' + it.info.item_id),
            q('#global_mods_btn' + it.info.item_id),
            q('#tools_custskills_btn' + it.info.item_id),
            q('#bag_btn' + it.info.item_id),
            q('#other_feats_btn' + it.info.item_id)
        ]
        this.accordionMenus = (t) => {
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
        this.createNewRow = (t) => {
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
        this.setSaveTableFields = (t) => {
            let fields = q('#' + it.draggableContainerId + ' #' + t.id + ' .this_field');
            for (let f of fields) {
                if (f.nextElementSibling) {
                    if (f.getAttribute('type') === "checkbox") {
                        if (f.nextElementSibling.innerHTML === "1") {
                            f.checked = true;
                            f.value = "1";
                        } else {
                            f.checked = false;
                            f.value = "0";
                        }
                    }
                    f.value = f.nextElementSibling.innerHTML;
                }
                this.setWeightCalcs(t, it);
                f.blur(() => {
                    if (f.nextElementSibling) {
                        if (f.getAttribute('type') === "checkbox") {
                            if (f.checked) f.value = "1";
                            else f.value = "0";
                        }
                        f.nextElementSibling.innerHTML = this.value;
                    }
                    this.saveTable(t);
                    this.setWeightCalcs(t, it);
                });
            }
        }
        this.searchRow = (div) => {
            let row = div;
            while (row.parentElement && !row.parentElement.classList.contains('this_table')) {
                row = row.parentElement;
            }
            return row;
        }
        this.attacks = (t) => {
            const item = this.searchItem(it.info.item_id);
            let throwAtk = q('#' + t.id + ' button[name="throw_attack"]');
            if (throwAtk.length > 0) {
                for (let i = 0; i < throwAtk.length; i++) {
                    let name = throwAtk[i].children[0];
                    let attack = throwAtk[i].children[1];
                    let dmg_n_type = throwAtk[i].children[2];
                    if (name && attack && dmg_n_type) {
                        /*let row = this.searchRow(throwAtk[0]);
                        console.log(row);
                        let nameInput = q('#' + t.id + ' input[placeholder="Name"]')[i];
                        if (nameInput) name.innerHTML = nameInput.value;
                        let atkModifiers = q('#' + t.id + ' .menu-sub-accordion .attack_mods .this_field');
                        let savingThrows = q('#' + t.id + ' .menu-sub-accordion .saving_throw .this_field');
                        let dmgModifiers = q('#' + t.id + ' .menu-sub-accordion .dmg_mods .this_field');
                        console.log(atkModifiers);
                        console.log(savingThrows);
                        console.log(dmgModifiers);
                        if (savingThrows.length === 3 && atkModifiers.length === 3 && dmgModifiers.length === 4) {
                            // * begin::ATTACK * //
                            attack.innerHTML = '';
                            let atkScoreMod = atkModifiers[0].value;
                            atkScoreMod = atkScoreMod !== "-1" ? item.getRawScoreModifier(atkScoreMod) : 0;
                            let otherAtkMod = atkModifiers[1].value;
                            otherAtkMod = !(otherAtkMod !== "" && otherAtkMod !== "0" && (!isNaN(otherAtkMod) || board.dices.isDiceFormat(otherAtkMod)))
                                ? 0 : otherAtkMod;
                            let prof = atkModifiers[2].value;
                            prof = prof !== "0" ? item.getProficiency() : 0;
                            let totalAttackModifier = (atkScoreMod + prof) + (!isNaN(otherAtkMod) ? parseInt(otherAtkMod) : " +" + otherAtkMod);
                            attack.innerHTML += totalAttackModifier === 0 ? "" : 'Atk +' + totalAttackModifier;
                            // * end::ATTACK * //

                            // * begin::SAVING THROW * //
                            let saveScoreMod = savingThrows[0].value;
                            saveScoreMod = saveScoreMod === "-1" ? ""
                                : saveScoreMod.toUpperCase();
                            let vsDC = savingThrows[1].value;
                            vsDC = saveScoreMod === "" ? ""
                                : (vsDC !== "-1" ? " vs DC" + (8 + parseInt(item.getProfScoreModifier(vsDC))) : "");
                            // Example: Saving Throw: CON vs DC16
                            let totalSave = saveScoreMod !== "" ? "Saving Throw: " + saveScoreMod + vsDC : "";
                            // * end::SAVING THROW * //

                            // * begin::DAMAGE * //
                            let plainDmg = dmgModifiers[0].value;
                            plainDmg = plainDmg === "" ? ""
                                : (!(!isNaN(plainDmg) || board.dices.isDiceFormat(plainDmg))
                                    ? "Not a number or a valid roll dice" : " +" + plainDmg);
                            console.log(plainDmg);
                            let dmgScoreMod = dmgModifiers[1].value;
                            dmgScoreMod = dmgScoreMod === "-1" ? "" : " +" + item.getRawScoreModifier(dmgScoreMod);
                            let otherMod = dmgModifiers[2].value;
                            otherMod = !(otherMod !== "" && otherMod !== "0" && (!isNaN(otherMod) || board.dices.isDiceFormat(otherMod)))
                                ? "" : " +" + otherMod;
                            let totalDamageModifier = plainDmg + dmgScoreMod + otherMod;
                            let dmgType = dmgModifiers[3].value;
                            dmg_n_type.innerHTML = "Dmg" + totalDamageModifier;
                            // * END::DAMAGE * //
                            throwAtk[i].click(function () {
                                console.log(totalAttackModifier);
                                console.log(totalSave);
                                console.log(totalDamageModifier);
                            });
                        }*/
                    }
                }
            }
        }
        this.setTableHeaders = (t) => {
            // Attacks and spells
            if (t.classList.contains('attacks_spells_table')) {
                this.attacks(t);
            } // Global modifiers
            else if (t.classList.contains('global_modifiers_table')) {
            } // Bag
            else if (t.classList.contains('bag_table')) {
            } // Other features
            else if (t.classList.contains('other_feats_table')) {
                //t.innerHTML += rowCustomFeatures();
            }
        }
        this.setRowDeletes = (t) => {
            let delBtns = q('#' + t.id + ' .delete_row');
            for (let btn of delBtns) {
                btn.click(() => {
                    let row = this.searchRow(btn);
                    console.log(t)
                    row.remove();
                    console.log(t)
                    this.saveTable(t);
                });
            }
        }

        for (let btn of this.characterTableButtons) {
            if (btn[0] && btn[0].parentNode.nextElementSibling) {
                let table = btn[0].parentNode.nextElementSibling;
                // Get table name
                let tableName = table.id.substring(0, table.id.length - 2);
                // If bag and empty, set header
                if (tableName === 'bag' && it.info.bag === '') {
                    table.innerHTML = '<!--begin::Head-->' +
                        '<div class="flex-row justify-content-between text-gray-700 fw-bolder text-capitalize border-bottom-1px-gray-300">' +
                        '    <div class="w-50px">UNITS</div>' +
                        '    <div class="col-6">ITEM NAME</div>' +
                        '    <div class="w-50px text-end">WEIGHT</div>' +
                        '    <div class="delete-row w-25px"></div>' +
                        '</div>' +
                        '<!--end::Head-->';
                }
                // Fill table with info
                //* FIRST LOAD WHEN OPENING ITEM MODAL *//
                table.innerHTML += it.info[tableName];
                //* NOW accordions have been potentially loaded, set them *//
                this.accordionMenus(table);
                //* Fill fields that are empty and set on blur listener to save them *//
                this.setSaveTableFields(table);
                //* Fill each header with ability info *//
                this.setTableHeaders(table);
                //* Set listeners to erase items *//
                this.setRowDeletes(table);
                // Set listener to save fields
                btn[0].click(() => {
                    this.createNewRow(table);
                    this.accordionMenus(table);
                    this.setSaveTableFields(table);
                    this.setTableHeaders(table);
                    this.setRowDeletes(table);
                });
            }
        }
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
                    for (let i in this.items) {
                        if (this.items[i].info.item_id === id) {
                            for (let j in data.params) {
                                this.items[i].info[j] = data.params[j];
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

    saveTable(t) {
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
                if (data.response) {
                    for (let i in this.items) {
                        if (this.items[i].info.item_id === id) {
                            for (let j in data.params) {
                                this.items[i].info[j] = data.params[j];
                            }
                        }
                    }
                }
                return data;
            }, error: (e) => {
                console.log(e.responseText);
            }
        });
    }

    getDataFromFields(inputs, item) {
        let it = this.searchItem(item.info.item_id);
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
                i.classList.toggle('expertise', i.value === "2");
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

    findClass(name) {
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

    selectClass(c) {
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

    saveClassSavingThrows(c, item) {
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

    setWeightCalcs(t, item) {
        const it = this.searchItem(item.info.item_id);
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
            if (totalWeight > it.getCarryingCapacity()) {
                overWeight = totalWeight - it.getCarryingCapacity();
            }
            let tw = q('#' + t.id + ' ~ div .total_weight')[0];
            if (tw) tw.innerHTML = totalWeight;
            let ow = q('#' + t.id + ' ~ div .overweight')[0];
            if (ow) ow.innerHTML = overWeight;
        }
    }

    abiliyScoresSelect() {
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

    rowAttacksSpells() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link ps-0 gap-1">' +
            '        <button type="button" name="throw_attack" class="btn btn-sm p-0 menu-title gap-1 align-items-center text-hover-primary text-gray-700 fw-bolder text-capitalize border-bottom-1px-gray-300">' +
            '            <span class="menu-title gap-1 name">Name</span>' +
            '            <span class="menu-title gap-1 attack">Atk</span>' +
            '            <span class="menu-title gap-1 dmg_n_type">Dmg</span>' +
            '        </button>' +
            '        <button class="btn py-1 pe-0">' +
            '           <span class="menu-arrow" style="width: 1rem;height:1rem;"></span>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu link-->' +
            '    <!--begin:Menu sub-->' +
            '    <div class="menu-sub menu-sub-accordion ps-2 gap-2">' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item">' +
            '           <input type="text" placeholder="Name"' +
            '               class="menu-title this_field form-control ps-2 fs-6 name"/>' +
            '           <span class="d-none"></span>' +
            '        </div>' +
            '        <!--end:Menu item-->' +
            '        <!--begin:Menu item-->' +
            '        <div class="menu-item border-bottom-1px-gray-300 pb-2">' +
            '           <div class="flex-row align-items-center justify-content-start gap-2 attack_mods">' +
            '               <span class="fw-bolder">Attack:</span>' +
            '               ' + this.abiliyScoresSelect() +
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
            '            <div class="flex-column dmg_mods">' +
            '                <div class="flex-row align-items-center justify-content-start gap-2">' +
            '                    <span class="fw-bolder">Damage:</span>' +
            '                    <input type="text" placeholder="1d6"' +
            '                         class="this_field form-control w-25px"/>' +
            '                    <span class="d-none"></span>' +
            '                    + ' + this.abiliyScoresSelect() +
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
            '        <div class="menu-item pb-2">' +
            '            <div class="flex-column saving_throw">' +
            '                <div class="flex-row align-items-center justify-content-start gap-2">' +
            '                <span class="fw-bolder">Saving Throw:</span>' +
            '                ' + this.abiliyScoresSelect() +
            '                    <span class="d-none"></span>' +
            '                    <label class="fs-9 text-uppercase fw-bolder"> vs dc</label>' +
            '                ' + this.abiliyScoresSelect() +
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
            '        <div class="menu-item d-flex align-self-end position-relative mt--50px mb-5 me-3">' +
            '            <button class="btn btn-sm btn-danger delete_row" style="padding: 1px;">' +
            '                <i class="fa-solid fa-trash fs-9" style="margin-left: 4px;margin-top: -1px;"></i>' +
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
            '        <div class="menu-title gap-1 align-items-center">' +
            '            <div class="menu-title gap-1">Name</div>' +
            '            <div class="menu-title gap-1">Attack</div>' +
            '            <div class="menu-title gap-1">Damage</div>' +
            '            <div class="menu-title gap-1">Save</div>' +
            '            <div class="menu-title gap-1">CA</div>' +
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

    rowBag() {
        return '<!--begin::Row-->' +
            ' <div class="flex-row justify-content-between align-items-center border-bottom-1px-gray-300">' +
            '    <div>' +
            '        <input type="number" value="0" placeholder="0"' +
            '             class="this_field form-control w-50px units"/>' +
            '        <span class="d-none"></span>' +
            '    </div>' +
            '    <div class="col-6">' +
            '        <input type="text" placeholder="Shield"' +
            '             class="this_field form-control"/>' +
            '        <span class="d-none"></span>' +
            '    </div>' +
            '    <div class="text-end">' +
            '        <input type="number" step="0.5" placeholder="1.5"' +
            '             class="this_field form-control text-center w-50px weight"' +
            '             style="background-position: right;"/>' +
            '        <span class="d-none"></span>' +
            '    </div>' +
            '    <!--begin:Menu item-->' +
            '    <div class="menu-item d-flex align-self-end">' +
            '        <button class="btn btn-sm btn-danger delete_row" style="padding: 1px;">' +
            '            <i class="fa-solid fa-trash fs-9" style="margin-left: 4px;margin-top: -1px;"></i>' +
            '        </button>' +
            '    </div>' +
            '    <!--end:Menu item-->' +
            ' </div>' +
            ' <!--end::Row-->';
    }

    rowCustomFeatures() {
        return '<!--begin::Menu Accordion-->' +
            '<div data-kt-menu-trigger="click" class="menu-item menu-accordion hover show">' +
            '    <!--begin:Menu link-->' +
            '    <div class="menu-link ps-0 gap-1">' +
            '        <div class="menu-title gap-1 flex-column align-items-start">' +
            '            <div class="menu-title gap-1 w-100">' +
            '               <input type="text" placeholder="Name"' +
            '                   class="menu-title this_field form-control ps-2 text-gray-700 fw-bolder fs-7"/>' +
            '               <span class="d-none"></span>' +
            '            </div>' +
            '            <div class="menu-title gap-1 w-100">' +
            '               <input type="text" placeholder="Source"' +
            '                   class="menu-title this_field form-control ps-2"/>' +
            '               <span class="d-none"></span>' +
            '            </div>' +
            '        </div>' +
            '        <button class="btn py-1 pe-0">' +
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
            '<!--end::Menu Accordion-->';
    }
}