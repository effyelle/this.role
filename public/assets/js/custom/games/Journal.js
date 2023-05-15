class Journal {
    constructor(id, options = {}) {
        this.opt = options;
        this.container = id;
        this.itemClass = id + '_item';
        this.sheetsContainer = options.sheetsContainer;
        this.defaultIcon = '/assets/media/games/blank.png';
        this.items = {
            list: {},
            length: 0
        }
        // Init journal
        this.init();
    }

    init() {
        // If ajax, init journal item creation from url
        if (!(this.opt.ajax && this.opt.ajax.url)) {
            this.error(this.opt.onError);
            return;
        }
        if (!this.opt.ajax.method) this.opt.ajax.method = "get";
        // Get data through ajax
        this.getJournalAjax().done((data) => {
            // Checck data is not null
            if (data.results && typeof data.results === 'object' && data.results.length > 0) {
                // Iterate results
                for (let item of data.results) {
                    // Save id to for modal container
                    let viewer = false;
                    let editor = false;
                    if (item.item_viewers) {
                        item.item_viewers = JSON.parse(item.item_viewers);
                        for (let i of item.item_viewers) {
                            if (i == session.user_id) viewer = true;
                        }
                    }
                    if (item.item_editors) {
                        item.item_editors = JSON.parse(item.item_editors);
                        for (let i of item.item_editors) {
                            if (i == session.user_id) editor = true;
                        }
                    }

                    if (session.user_id === dbGame.game_creator || viewer || editor) {
                        // Save a DND sheet for each item
                        this.items.list[this.items.length] = new this.SheetDnD(this.sheetsContainer, {
                            itemInfo: item,
                            folder: this.opt.folder,
                        });
                        this.items.length++;
                    }
                }
                // Show list
                this.formatJournalItems(this.items.list);
            } else {
                console.log("No journal items in this game yet");
            }
            this.load(this.opt.onLoad, data);
        }).fail((e) => {
            console.log("Error: ", e);
        });
    }

    getJournalAjax() {
        return $.ajax({
            type: this.opt.ajax.method,
            url: this.opt.ajax.url,
            dataType: 'json', // Comment this line for debugging,
            async: true,
            success: (data) => {
                return data;
            },
            error: (e) => {
                return e;
            }
        });
    }

    formatJournalItems(items) {
        for (let i in items) {
            let item = items[i].info;
            // Check image data, if it does not exist, put a default one
            let icon = !urlExists(this.opt.folder + item.item_icon)
                ? this.defaultIcon
                : this.opt.folder + item.item_icon;

            // * HTML format * //
            q('#' + this.container)[0].innerHTML += '' +
                '<!--begin::Menu Item-->' +
                ' <div class="menu-item ' + this.itemClass + '">' +
                // Assign item ID to button for later accessing
                '     <button type="button" class="btn menu-link col-12" value="' + item.item_id + '">' +
                '         <!--begin::Symbol-->' +
                '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
                '             <span class="symbol-label circle item_icon-holder"' +
                '                  style="background-image: url(' + icon + ');' +
                '                      background-size: cover; background-position: center center;">' +
                '             </span>' +
                '         </div>' +
                '         <!--end::Symbol-->' +
                '         <span class="menu-title fw-bolder fs-7 text-gray-600 text-hover-dark">' + item.item_name + '</span>' +
                '     </button>' +
                ' </div>' +
                ' <!--end::Menu Item-->';
        }
    }

    searchItem(id) {
        for (let i in this.items.list) {
            if (this.items.list[i].info.item_id === id) {
                return this.items.list[i];
            }
        }
        return false;
    }


    reload() {
        $('.' + this.itemClass).remove();
        q('#' + this.container)[0].innerHTML = '';
        this.items = {
            list: {},
            length: 0,
        }
        // Begin again
        this.init();
    }

    error(callback, e) {
        if (callback) {
            if (e) return callback(e);
            return callback("You need to set an URL to do any AJAX call");
        }
        return false;
    }

    load(callback, data) {
        if (callback && data) {
            callback(data);
        }
        return false;
    }

    SheetDnD = function (id, params = {}) {
        this.info = params.itemInfo;
        // Add container for saving future modals
        this.modalsContainer = id;
        this.draggableContainerId = 'draggable_' + this.info.item_id;
        this.draggableContainerClass = 'journal_item_modal';
        this.folder = params.folder;
        this.openItem = async (htmlText) => {
            q('#' + this.modalsContainer)[0].innerHTML += htmlText;
            let icon = '/assets/media/games/blank.png';
            if (urlExists(this.folder + this.info.item_icon)) {
                icon = this.folder + this.info.item_icon;
            }
            const iconHolder = q('#' + this.draggableContainerId + ' .item_icon-holder');
            if (iconHolder.length > 0) {
                iconHolder[0].style.backgroundImage = 'url("' + icon + '")';
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
}

document.addEventListener('DOMContentLoaded', function(){
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

    // This needs to change to reset all possible already opened items
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
            let item = journal.searchItem(modal.id.charAt(modal.id.length - 1));
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
                if (data.response) {
                    for (let i in journal.items.list) {
                        if (journal.items.list[i].info.item_id === id) {
                            for (let j in data.params) {
                                journal.items.list[i].info[j] = data.params[j];
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

    function getDataFromFields(inputs, item) {
        let it = journal.searchItem(item.info.item_id);
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
                let it = journal.searchItem(item.info.item_id);
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
            let it = journal.searchItem(item.info.item_id);
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
        this.buttons = [
            q('#atk_spells_btn' + item.info.item_id),
            q('#global_mods_btn' + item.info.item_id),
            q('#tools_custskills_btn' + item.info.item_id),
            q('#bag_btn' + item.info.item_id),
            q('#other_feats_btn' + item.info.item_id)
        ]
        this.accordionMenus = (t) => {
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
        this.createNewRow = (t) => {
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
        this.setSaveTableFields = (t) => {
            let fields = q('#' + item.draggableContainerId + ' #' + t.id + ' .this_field');
            for (let f of fields) {
                if (f) {
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
                    setWeightCalcs(t, item);
                    f.blur(function () {
                        if (this.nextElementSibling) {
                            if (this.getAttribute('type') === "checkbox") {
                                if (this.checked) this.value = "1";
                                else this.value = "0";
                            }
                            this.nextElementSibling.innerHTML = this.value;
                        }
                        saveTable(t);
                        setWeightCalcs(t, item);
                    });
                }
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
            const it = journal.searchItem(item.info.item_id);
            let throwAtk = q('#' + t.id + ' button[name="throw_attack"]');
            if (throwAtk.length > 0) {
                for (let i = 0; i < throwAtk.length; i++) {
                    let name = throwAtk[i].children[0];
                    let attack = throwAtk[i].children[1];
                    let dmg_n_type = throwAtk[i].children[2];
                    if (name && attack && dmg_n_type) {
                        let row = this.searchRow(throwAtk[0]);
                        console.log(row);
                        let nameInput = q('#' + t.id + ' input[placeholder="Name"]')[i];
                        if (nameInput) name.innerHTML = nameInput.value;
                        let atkModifiers = q('#' + t.id + ' .menu-sub-accordion .attack_mods .this_field');
                        let savingThrows = q('#' + t.id + ' .menu-sub-accordion .saving_throw .this_field');
                        let dmgModifiers = q('#' + t.id + ' .menu-sub-accordion .dmg_mods .this_field');
                        console.log(atkModifiers)
                        console.log(savingThrows)
                        console.log(dmgModifiers)
                        if (savingThrows.length === 3 && atkModifiers.length === 3 && dmgModifiers.length === 4) {
                            //* begin::ATTACK *//
                            attack.innerHTML = '';
                            let atkScoreMod = atkModifiers[0].value;
                            atkScoreMod = atkScoreMod !== "-1" ? it.getRawScoreModifier(atkScoreMod) : 0;
                            let otherAtkMod = atkModifiers[1].value;
                            otherAtkMod = !(otherAtkMod !== "" && otherAtkMod !== "0" && (!isNaN(otherAtkMod) || board.dices.isDiceFormat(otherAtkMod)))
                                ? 0 : otherAtkMod;
                            let prof = atkModifiers[2].value;
                            prof = prof !== "0" ? it.getProficiency() : 0;
                            let totalAttackModifier = (atkScoreMod + prof) + (!isNaN(otherAtkMod) ? parseInt(otherAtkMod) : " +" + otherAtkMod);
                            attack.innerHTML += totalAttackModifier === 0 ? "" : 'Atk +' + totalAttackModifier;
                            //* end::ATTACK *//

                            //* begin::SAVING THROW *//
                            let saveScoreMod = savingThrows[0].value;
                            saveScoreMod = saveScoreMod === "-1" ? ""
                                : saveScoreMod.toUpperCase();
                            let vsDC = savingThrows[1].value;
                            vsDC = saveScoreMod === "" ? ""
                                : (vsDC !== "-1" ? " vs DC" + (8 + parseInt(it.getProfScoreModifier(vsDC))) : "");
                            // Example: Saving Throw: CON vs DC16
                            let totalSave = saveScoreMod !== "" ? "Saving Throw: " + saveScoreMod + vsDC : "";
                            //* end::SAVING THROW *//

                            //* begin::DAMAGE *//
                            let plainDmg = dmgModifiers[0].value;
                            plainDmg = plainDmg === "" ? ""
                                : (!(!isNaN(plainDmg) || board.dices.isDiceFormat(plainDmg))
                                    ? "Not a number or a valid roll dice" : " +" + plainDmg);
                            console.log(plainDmg);
                            let dmgScoreMod = dmgModifiers[1].value;
                            dmgScoreMod = dmgScoreMod === "-1" ? "" : " +" + it.getRawScoreModifier(dmgScoreMod);
                            let otherMod = dmgModifiers[2].value;
                            otherMod = !(otherMod !== "" && otherMod !== "0" && (!isNaN(otherMod) || board.dices.isDiceFormat(otherMod)))
                                ? "" : " +" + otherMod;
                            let totalDamageModifier = plainDmg + dmgScoreMod + otherMod;
                            let dmgType = dmgModifiers[3].value;
                            dmg_n_type.innerHTML = "Dmg" + totalDamageModifier;
                            //* END::DAMAGE *//
                            throwAtk[i].click(function () {
                                console.log(totalAttackModifier);
                                console.log(totalSave);
                                console.log(totalDamageModifier);
                            });
                        }
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
            if (delBtns.length > 0) {
                for (let btn of delBtns) {
                    btn.click(() => {
                        let row = this.searchRow(btn);
                        row.remove();
                        saveTable(t);
                    });
                }
            }
        }

        for (let btn of this.buttons) {
            if (btn[0] && btn[0].parentNode.nextElementSibling) {
                let table = btn[0].parentNode.nextElementSibling;
                if (table) {
                    // Get table name
                    let tableName = table.id.substring(0, table.id.length - 2);
                    // If bag and empty, set header
                    if (tableName === 'bag' && item.info.bag === '') {
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
                    table.innerHTML += item.info[tableName];
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
    }

    function setWeightCalcs(t, item) {
        const it = journal.searchItem(item.info.item_id);
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
            '               ' + abiliyScoresSelect() +
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
            '        <div class="menu-item pb-2">' +
            '            <div class="flex-column saving_throw">' +
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

    function rowGlobalModifiers() {
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

    function rowBag() {
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

    function rowCustomFeatures() {
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
                console.log(data)
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
});