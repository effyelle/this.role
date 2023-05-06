function initGame(dbGame, session) {

    // **************************** //
    // ****** begin::Journal ****** //
    // **************************** //

    // * Journal intance * //
    const journal = new Journal('journal', {
        ajax: {
            url: '/app/games_ajax/get_journal_items/' + dbGame.game_id,
            dataType: 'json',
        },
        sheetsContainer: 'draggable-modals_container',
        folder: '/assets/media/games/' + dbGame.game_folder + '/players/',
        onLoad: function (data) {
            customSheets(data);
        },
        onError: function (e) {
            console.log(e);
        }
    });

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
                        if (journal.items.list[i].info.item_id === this.value)
                            item = journal.items.list[i];
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
                                    return;
                                }
                                // Set item events
                                makeInteractable(item)
                            });
                        }
                    }
                });
            }
        }
    }

    function getSheetHTML(info) {
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/sheet/" + info.item_id,
            data: {item_type: info.item_type},
            dataType: "text",
            success: (data) => {
                return data;
            }, error: (e) => {
                console.log("Error", e);
            }
        });
    }

    function makeInteractable(item) {
        // Save the necessary html objects to make sheet interactable
        let modalBody = q('#' + item.draggableContainerId + ' .modal-body');
        let modals = q('.' + item.draggableContainerClass);
        let closeBtns = q('.' + item.draggableContainerClass + ' .close_item-btn');
        let cursorMove = q('.cursor-move');
        // * Check they have the correct lengths * //
        if (!(modalBody.length === 1 && modals.length === closeBtns.length && closeBtns.length === cursorMove.length)) {
            return;
        }
        // * Make items dragagble * //
        new Draggable('.' + item.draggableContainerClass, '.cursor-move');

        // * Iterate through modals and buttons * //
        for (let i = 0; i < closeBtns.length; i++) {
            // * Add a close event * //
            closeBtns[i].click(() => {
                modals[i].remove();
            });
        }

        // Set all selects that shall have aria-selected to load the attribute
        let selects = q('select');
        for (let select of selects) {
            let s = select.getAttribute('aria-selected');
            if (s) {
                select.value = s;
                select.onchange = function () {
                    select.setAttribute('aria-selected', this.value);
                }
            }
        }

        let this_fields = q('#' + item.draggableContainerId + ' .this-role-form-field');
        // Get data from fields
        getDataFromFields(this_fields, item);

        // * Add listener to html form fields * //
        this_fields.blur(function () {
            saveField(this, item.info.item_id).done((data) => {
                console.log(data);
                if (data.response) {
                    // Refill fields dataf-from
                    getDataFromFields(this_fields, item);
                    // Change name in '.aside' journal list
                    q('#' + journal.container + ' button[value="' + item.info.item_id + '"] .menu-title')[0].innerHTML = q('#' + item.draggableContainerId + ' input[name=item_title]')[0].value;
                }
            });
        });
    }

    function getDataFromFields(inputs, item) {
        for (let i of inputs) {
            let divName = i.getAttribute('name');
            if (divName !== '') {
                if (i.nodeName === 'SELECT') {
                    i.value = (i.getAttribute('aria-selected'));
                } else if (i.classList.contains('this-score')) {
                    // Load scores
                    getScores(divName, i.value, item);
                } else {
                    let data_from = q('[data-from=' + divName + ']');
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

    function getScores(n, v, i) {
        switch (n) {
            case 'this-score-str':
                break;
            case 'this-score-dex':
                break;
            case 'this-score-con':
                break;
            case 'this-score-int':
                break;
            case 'this-score-wis':
                break;
            case 'this-score-cha':
                break;
        }
    }

    function saveField(object, id) {
        let data = {};
        data [object.getAttribute('name')] = object.value;
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/save_sheet/" + dbGame.game_id,
            data: {char_sheet: data, item_id: id},
            dataType: "json",
            success: (data) => {
                return data;
            },
            error: (e) => {
                console.log("Error: ", e);
            }
        });
    }

    if (q('#modal_journal-toggle').length > 0) {

        // * Check and uncheck edits * //
        if (q('#include_players').length > 0) {
            let can_see = $('.can_see-can_edit .can_see');
            let can_edit = $('.can_see-can_edit .can_edit');
            switchIncludePlayers();
            q('#journal-item_type')[0].onchange = switchIncludePlayers;

            function switchIncludePlayers() {
                switch (this.value) {
                    case 'character':
                        can_see.hide();
                        can_edit.show();
                        break;
                    case 'handout':
                        can_see.show();
                        can_edit.hide();
                        break;
                    default:
                        can_see.hide();
                        can_edit.hide();
                }
            }
        }

        // * Add journal item when save button clicked * //
        q('#save_journal_item-btn').click(function () {
            toggleProgressSpinner(true);
            let form = getForm('#modal_journal');
            if (form) {
                saveJournalItem(form);
            }
            toggleProgressSpinner(false);
        });
    }

    function saveJournalItem(post = {}) {
        $('#modal_journal .error').hide();
        let canSee = q('#include_players .player-can_see');
        let canEdit = q('#include_players .player-can_edit');
        let players = {};
        [canSee, canEdit].forEach(obj => {
            console.log(obj)
            for (let o of obj) {
                console.log(o.checked)
                if (o.checked) {
                    players[o.id] = o.id.substring(2);
                }
            }
        });
        if (Object.keys(players).length > 0) {
            post.players = players;
        }
        $.ajax({
            type: 'post',
            url: '/app/games_ajax/set_journal_item/' + dbGame.game_id,
            data: post,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data['response']) {
                    // Add item to HTML
                    journal.reload();
                    // Dismiss journal modal
                    $('.modal_success_response').html('Added successfully');
                    $('#modal_success-toggle').click();
                } else if (data['msg']) {
                    $('#modal_journal .error').show();
                }
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        });
    }

    // ********************************** //
    // * Empty journal modal on closure * //
    // ********************************** //
    $('#modal_journal').on('hidden.bs.modal', function () {
        $('#journal_title-input').val('');
        $('#journal-item_type option[value="-1"]').prop('selected', true);
        $('#modal_journal input').prop('checked', false);
    });

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
        this.lImgPreview = $('#add_layer-preview');
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
                        console.log(data);
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
                    console.log(data);
                    board.map.loadLayers();
                }, error: (e) => {
                    console.log("Error: ", e);
                }
            });
            console.log(e);
        }

        this.btn.click(newMap);

        q('#select_layer-btn').click(selectMap);

        q('#select_layer-btn').click(selectMap);

        // Delete layer onclick
        q('#delete_layer-btn').click(deleteMap);

        // Fill add modal onclick
        q('#edit_layer-btn').click((e) => {
            q('#layer_name')[0].value = $('#change_layer').find(':selected').text();
            this.btn.removeEventListener('click', newMap);
            this.btn.click(editMap);
        });

        // On modal closure
        $('#add_layer-modal').on('hidden.bs.modal', () => {
            // Reset fields and divs
            this.lName.value = '';
            this.lImg.value = '';
            this.lImgPreview.css('background-image', 'none');
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
                console.log(this);
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
            type: "get",
            url: "/app/games_ajax/get_game_info/" + dbGame.game_id,
            dataType: "json",
            succes: (data) => {
                if (data.response && data.game) dbGame = data.game;
                else {
                    alert("Este juego ya no existe");
                    window.location.assign('/index');
                }
            }, error: (e) => {
                console.log("Error: ", e);
            }
        });
    }


    setInterval(thisShouldBeAWebSocket, 25000);

    function thisShouldBeAWebSocket() {
        reloadGameInfo();
        getChat();
        board.map.loadLayers();
    }
}