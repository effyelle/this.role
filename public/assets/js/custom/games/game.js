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
                itemDOM.click(function () {
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
                                makeItemsInteractable();
                            });
                        }
                    }
                });
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
                console.log("Error", e);
            }
        });
    }

    function makeItemsInteractable() {
        // Save the necessary html objects to make sheet interactable
        let modals = q('.journal_item_modal');
        let closeBtns = q('.journal_item_modal .close_item-btn');
        let cursorMove = q('.journal_item_modal .cursor-move');
        // * Check they have the correct lengths * //
        if (!(modals.length === closeBtns.length && closeBtns.length === cursorMove.length)) {
            return;
        }

        // * Make items dragagble * //
        new Draggable('.journal_item_modal', '.journal_item_modal .cursor-move');

        // * Iterate through modals and buttons * //
        for (let i = 0; i < closeBtns.length; i++) {
            // * Add a close event * //
            closeBtns[i].click(() => {
                modals[i].remove();
            });
        }

        // Set all selects that shall have aria-selected to load the attribute
        for (let select of q('select')) {
            let s = select.getAttribute('aria-selected');
            if (s) {
                select.value = s;
                select.onchange = function () {
                    select.setAttribute('aria-selected', this.value);
                }
            }
        }
        listenToSheetChanges(modals);
    }

    function listenToSheetChanges(modals) {
        // * You need to reapply listeners to all opened items when you open a new one * //
        for (let modal of modals) {
            // Search for item
            let item = false;
            for (let i in journal.items.list) {
                if (journal.items.list[i].draggableContainerId === modal.id) {
                    item = journal.items.list[i];
                }
            }
            // Do not do further actions if item was not found
            if (!item) {
                continue;
            }
            //* begin::Image change *//
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
            //* end::Image change *//
            //* begin::Save class *//
            setClassGroup(item);
            //* end::Save class *//
            //* begin::Inspiration *//
            setInspiration(item);
            //* end::Inspiration *//
            //* begin::Inputs change *//
            let this_fields = q('#' + item.draggableContainerId + ' .this-role-form-field');
            // Get data from fields
            getDataFromFields(this_fields, item);
            // Save on field lost of focus
            this_fields.blur(function () {
                saveField(this, item.info.item_id);
            });
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
        if (objName.match(/this_prof|this_skill/)) {
            objVal = object.checked ? "1" : "0";
        }
        form.append(objName, objVal);
        form.append('item_id', id);
        console.log('checking', objName);
        console.log(objVal)
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/save_sheet/" + dbGame.game_id,
            data: form,
            processData: false,
            contentType: false,
            success: (data) => {
                data = JSON.parse(data);
                console.log(data);
                if (data.response) {
                    for (let i in journal.items.list) {
                        if (journal.items.list[i].info.item_id === id) {
                            for (let j in data.params) {
                                console.log(data.params[j])
                                console.log(journal.items.list[i].info[j])
                                journal.items.list[i].info[j] = data.params[j];
                            }
                        }
                    }
                }
                return data;
            }, error: (e) => {
                console.log(e);
            }
        });
    }

    function getDataFromFields(inputs, item) {
        for (let i of inputs) {
            let divName = i.getAttribute('name');
            if (divName && divName !== '') {
                //* begin::Score Modifiers *//
                if (divName.match(/this_score/)) {
                    let label = q('label[for="' + divName + '"')[0];
                    let rawScoreModifier = item.getRawScoreModifier(divName.substring(10));
                    if (rawScoreModifier && label) {
                        label.innerHTML = rawScoreModifier;
                    }
                } //* end::Score Modifiers *//
                //* begin::Score proficiency bonuses *//
                else if (divName.match(/this_prof/) && i.checked) {
                    q('label[for="' + divName + '"')[0].innerHTML = '+' + item.getProficiency();
                } // * end::Score proficiency bonuses * //
                // * begin::Saving Throws * //
                else if (divName.match(/this_save/)) {
                    let profScoreModifier = item.getProfScoreModifier(divName.substring(10));
                    if (profScoreModifier) {
                        i.value = profScoreModifier;
                        i.innerHTML = 'SAVING THROW' + (profScoreModifier >= 0 ? '+' : '') + profScoreModifier;
                    }
                } // * end::Saving Throws * //
                else if (i.nodeName === 'SELECT') {
                    i.value = (i.getAttribute('aria-selected'));
                } else {
                    let data_from = q('#' + item.draggableContainerId + ' [data-from=' + divName + ']');
                    for (let el of data_from) {
                        el.innerHTML = getGenericFields(divName, i.value, item);
                    }
                }
            }
        }
    }

    function getGenericFields(n, v, i) {
        switch (n) {
            case 'xp':
                return i.getLevel(v);
            case 'this-ac':
                return i.getClassArmor();
            case 'this-init':
                return i.getInitTierBreaker();
            case 'this-prof':
                return i.getProficiency(v);
            default:
                return v;
        }
    }

    function setClassGroup(item) {
        let saveClass = q('#' + item.draggableContainerId + ' .save_class')[0];
        let classSelect = q('#' + item.draggableContainerId + ' select[name=class]')[0];
        let subclass = q('#' + item.draggableContainerId + ' input[name=subclass]')[0];
        let classLvl = q('#' + item.draggableContainerId + ' input[name=lvl]')[0];
        if (classSelect && subclass && classLvl && saveClass) {
            let classes = JSON.parse(item.info.classes);
            if (classes && classes.length > 0) {
                // Set main class
                classSelect.value = classes[0].class;
                // Set atributes to related inputs
                subclass.setAttribute('name', 'subclass_' + classes[0].class);
                classLvl.setAttribute('name', 'lvl_' + classes[0].class);
                // Fill data from class if exists
                subclass.value = classes[0].subclass;
                classLvl.value = classes[0].lvl;
            }
            classSelect.onchange = function () {
                // Set atributes to related inputs
                subclass.setAttribute('name', 'subclass_' + this.value);
                classLvl.setAttribute('name', 'lvl_' + this.value);
                // This needs to be redeclared here in case data has changed from page load
                let classes = JSON.parse(item.info.classes);
                // Fill data from class if exists
                if (classes && classes.length > 0) {
                    let classFound = false;
                    for (let i in classes) {
                        if (classes[i].class === this.value) {
                            subclass.value = classes[i].subclass;
                            classLvl.value = classes[i].lvl;
                            classFound = true;
                        }
                    }
                    if (!classFound) {
                        subclass.value = "";
                        classLvl.value = "";
                    }
                }
            }
            saveClass.click(function () {
                saveField(classSelect, item.info.item_id).done((data) => {
                    saveField(subclass, item.info.item_id);
                    saveField(classLvl, item.info.item_id);
                });
            });
        }
    }

    function setInspiration(item) {
        const inspCont = q('#' + item.draggableContainerId + ' .inspiration')[0];
        const insp = q('#' + item.draggableContainerId + ' [name=inspiration]')[0];
        if (inspCont && insp) {
            function loadInsp() {
                if (item.info.info) {
                    let info = JSON.parse(item.info.info);
                    if (info.inspiration) {
                        insp.value = info.inspiration;
                        if (insp.value === "1") {
                            console.log(insp.children[0])
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
                saveField(insp, item.info.item_id).done((loadInsp));
            });
        }
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
            type: "get",
            url: "/app/games_ajax/get_chat/" + dbGame.game_id,
            dataType: "json",
            success: function (data) {
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
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        });
    }


    // **************************** //
    // ******** end::Chat ********* //
    // **************************** //

    function reloadGameInfo() {
        $.ajax({
            type: "get",
            url: "/app/games_ajax/get_game_info/" + dbGame.game_id,
            dataType: "json",
            succes: (data) => {
                if (data.response && data.game) dbGame = data.game; else {
                    alert("Este juego ya no existe");
                    window.location.assign('/index');
                }
            },
            error: (e) => {
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