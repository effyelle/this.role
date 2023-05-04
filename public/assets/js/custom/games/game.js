function initGame(dbGame) {

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
                    let item = journal.items.list[this.value];
                    // Check if container doesn't exist already
                    if (q('#' + item.draggableContainerId).length === 0) {
                        // If not, create it
                        getSheetHTML().done((htmlText) => {
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
                });

            }
        }
    }

    function getSheetHTML() {
        return $.ajax({
            type: "get", url: '/app/games_ajax/sheet/' + dbGame.game_id, dataType: "text", success: (data) => {
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

        let this_fields = q('#' + item.draggableContainerId + ' .this-role-form-field');
        // Get data from fields
        getDataFromFields(this_fields, item);

        // * Add listener to html form fields * //
        this_fields.blur(function () {
            saveField(this).done((data) => {
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
                if (i.classList.contains('this-score')) {
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

    function saveField(object) {
        let data = {};
        data [object.getAttribute('name')] = object.value;
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/save_sheet/" + dbGame.game_id,
            data: {char_sheet: data},
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
        $('#modal_journal .text-danger').hide();
        $.ajax({
            type: 'post',
            url: '/app/games_ajax/set_journal_item/' + dbGame.game_id,
            data: post,
            dataType: 'json',
            success: async function (data) {
                console.log(data);
                if (data['response']) {
                    // Add item to HTML
                    await journal.reload();
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
        })
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

    listenToNewMaps();

    function listenToNewMaps() {
        this.lName = q('#layer_name')[0];
        this.lImg = q('#add_map-input')[0];
        this.lImgPreview = $('#add_layer-preview');
        this.btn = q('#add_layer-btn');

        // Empty fields when modal closes
        $('#add_layer-modal').on('hidden.bs.modal', () => {
            this.lName.value = '';
            this.lImg.value = '';
            this.lImgPreview.css('background-image', 'none');
        });

        this.lImg.onchange = () => {
            // Change bg from holder
            readImageChange(this.lImg, this.lImgPreview);
        }
        this.btn.click(() => {
            if (this.lName.value !== '' && this.lImg.files.length > 0) {
                q('#add_layer-error').addClass('d-none');
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
                            $('.modal_success_response').html('Image added correctly');
                            $('#modal_success-toggle').click();
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
        });

        q('#change_layer')[0].onchange = function (e) {
            // Update selected image in Database
            $.ajax({
                type: "get",
                url: "/app/games_ajax/set_selected_layer/" + dbGame.game_id + "?layer_id=" + this.value,
                dataType: "json",
                success: (data) => {
                    dbGame.game_layer_selected = this.value;
                },
                error: (e) => {
                    console.log("Error: ", e);
                }
            });
            // Change image in HTML
            board.map.showLayer(board.map.layersFolder + board.map.layers[this.value].layer_bg);
        }

        q('#delete_layer-btn').click(function (e) {
            // Delete layer
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
            console.log(e);
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
    chatText.addEventListener('keypress', function (e) {
        // Save key if not Enter
        if (e.key !== 'Enter') {
            chatMessage += e.key;
        }
        if (e.key === 'Enter') { // If Enter key
            if (e.shiftKey) { // If Shift+Enter
                chatMessage += '<br/>'; // Add line break
                return; // Return
            }
            // If Enter without Shift
            e.preventDefault(); // Prevent textarea line break
            setChat(chatMessage.trim(), $('#charsheet_selected').find(':selected').text(), "chatMessage");
        }
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
                console.log(data)
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
                        return;
                    }
                    console.log(chat)
                    chat.formatMessage({
                        sender: sender, src: src, msg: msgText, msgType: msgType
                    });
                }
            }
        });
    }


    // **************************** //
    // ******** end::Chat ********* //
    // **************************** //


    //setInterval(thisShouldBeAWebSocket, 3000);

    function thisShouldBeAWebSocket() {
        getChat();
        board.map.loadLayers();
    }
}