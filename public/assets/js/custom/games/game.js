function initBoard(dbGame, session) {

    // * Board intance * //
    const board = new Board('.btn.dice');
    board.map = new GameMap('#this-game', {
        folder: '/assets/media/games/' + dbGame.game_folder + '/layers/',
        ajax: '/app/games_ajax/get_layers/' + dbGame.game_id,
        select: '#change_layer',
        game: dbGame
    });
    listenToNewMaps();

    // * Chat object * //
    const chat = new board.Chat('.chat-messages');
    getChat();

    setInterval(thisShouldBeAWebSocket, 3000);

    function thisShouldBeAWebSocket() {
        getChat();
        board.map.loadLayers();
    }

    // * Journal intance * //
    const journal = new Journal('journal', {
        ajax: {
            method: 'get',
            url: '/app/games_ajax/get_journal_items/' + dbGame.game_id,
            dataType: 'json',
        },
        folder: '/assets/media/games/' + dbGame.game_folder + '/players/',
        onLoad: function (data) {
            makeItemsInteractable(data);
        },
        onError: function (e) {
            console.log(e);
        }
    });

    function makeItemsInteractable(data) {
        let items = q('.' + journal.itemClass + ' .menu-link');
        // Check data and items have the same length -> means they have been created accordingly
        if (items.length === journal.items.length) {
            // Iterate items
            for (let item of items) {
                // Add a click listener to each item to create a new modal
                item.click(() => {
                    // Save item to journal
                    let itemInfo = journal.items.list[item.value];
                    // Save id to from container
                    journal.draggableContainerId = 'draggable_' + itemInfo.item_id;
                    // If container does not exist, create it
                    if (q('#' + journal.draggableContainerId).length === 0) {
                        openItem(itemInfo);
                        let modals = q('.' + journal.itemModalClass);
                        let closeBtns = q('.' + journal.itemModalClass + ' .close_item-btn');
                        let cursorMove = q('.cursor-move');
                        // * Check there are the same amount of cursor-move as * //
                        // * there are of opened modals and close buttons      * //
                        if (cursorMove.length === modals.length && closeBtns.length === modals.length) {
                            // Add draggable
                            for (let i = 0; i < cursorMove.length; i++) {
                                new Draggable('.draggable', '.cursor-move');
                            }
                            // Add a close event
                            for (let i = 0; i < closeBtns.length; i++) {
                                closeBtns[i].click(() => {
                                    console.log(journal.items);
                                    // Save item ID from hidden button
                                    let itemID = q('#' + modals[i].id + ' button.this-item-id')[0].id;
                                    // Delete sheet from journal
                                    journal.items.sheets[itemID] = null;
                                    journal.items.sheetsLength--;
                                    // Remove item from HTML
                                    modals[i].remove();
                                    console.log(journal.items);
                                });
                            }
                            // Fill item
                            openSheet(itemInfo).done((data) => {
                                let modals = q('.' + journal.itemModalClass);
                                let this_fields = q('#' + journal.draggableContainerId + ' .this-role-form-field');
                                this_fields.blur(function () {
                                    saveField(this);
                                });
                            });
                        }
                    }
                });
            }
        }
    }

    function saveField(object) {
        let data = {};
        data [object.getAttribute('name')] = object.value;
        console.log(data)
        $.ajax({
            type: "post",
            url: "/app/games_ajax/save_sheet/" + dbGame.game_id,
            data: {char_sheet: data},
            dataType: "json",
            success: (data) => {
                console.log(data);
            }, error: (e) => {
                console.log("Error: ", e);
            }
        })
    }

    function openItem(item) {
        journal.itemModalsContainerId = 'journal-modal_container';
        journal.itemModalClass = journal.container.id + '_item_modal';
        q('#' + journal.itemModalsContainerId)[0].innerHTML += '' +
            '<div id="' + journal.draggableContainerId + '" class="' + journal.itemModalClass + ' show ' + item.item_type + ' draggable">' +
            '       <div class="modal-content bg-white">' +
            '           <div class="modal-header flex-row-wrap justify-content-between align-items-center cursor-move">' +
            '               <div class="" data-from="item_title">' +
            '                   <!--Autofill-->' +
            '               </div>' +
            '               <div class="flex-row-wrap gap-5 align-items-end justify-content-end align-self-start">' +
            '                   <button type="button" class="btn p-0 minmax-btn text-hover-dark">' +
            '                       <i class="fa-solid fa-minus fs-3"></i>' +
            '                   </button>' +
            '                   <button type="button" class="btn p-0 close_item-btn text-hover-dark">' +
            '                       <i class="fa-solid fa-close fs-1"></i>' +
            '                   </button>' +
            '               </div>' +
            '           </div>' +
            '           <div class="modal-body">' +
            '               <div class="flex-column align-content-center align-items-center justify-content-center">' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '</div>';
    }

    function openSheet(item) {
        // Create new character sheet
        return $.ajax({
            type: "post",
            url: "/app/games_ajax/sheet/" + item.item_id,
            success: (data) => {
                q('#' + journal.draggableContainerId + ' .modal-body')[0].innerHTML = data;
            }, error: (e) => {
                console.log(e);
            }
        });
    }

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
                    }, error: (e) => {
                        console.log("Error: ", e);
                    }
                });
                return;
            }
            q('#add_layer-error').removeClass('d-none');
        });

    }

    q('#change_layer')[0].onchange = function (e) {
        // Update selected image in Database
        $.ajax({
            type: "get",
            url: "/app/games_ajax/set_selected_layer/" + dbGame.game_id + "?layer_id=" + this.value,
            dataType: "json",
            success: (data) => {
                dbGame.game_layer_selected = this.value;
            }, error: (e) => {
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
            }, error: (e) => {
                console.log("Error: ", e);
            }
        });
        console.log(e);
    });

    function changeLayer() {
    }

    // *********************************** //
    // * Listen to dices buttons pressed * //
    // *********************************** //
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

    // ******************************* //
    // * Listen to chat pressed keys * //
    // ******************************* //
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

    // ********************************* //
    // * Listen to send button in chat * //
    // ********************************* //
    document.querySelector('.chat-bubble ~ div .btn').addEventListener('click', function () {
        setChat(chatMessage.trim(), $('#charsheet_selected').find(':selected').text(), "chatMessage");
    });
    // * Delete add button and modal if user is not creator * //
    if (session.user.user_id !== dbGame.game_creator) {
        $('#modal_journal-toggle').remove();
    }

    // ********************************************* //
    // * Add journal item when save button clicked * //
    // ********************************************* //
    q('#modal_journal .save_btn')[0].click(function () {
        let form = getForm('#modal_journal');
        if (form) {
            setJournalItem(form);
        }
        // Always stop progress spinner at the end of all actions
        toggleProgressSpinner(false);
    });

    // ********************************** //
    // * Empty journal modal on closure * //
    // ********************************** //
    $('#modal_journal').on('hidden.bs.modal', function () {
        $('#journal_title-input').val('');
        $('#journal-item_type option[value="-1"]').prop('selected', true);
        $('#modal_journal input').prop('checked', false);
    });

    /**
     * Save chat message to Database
     *
     * @param text
     * @param sender
     * @param msgType
     *
     * @return void
     */
    function setChat(text, sender, msgType) {
        if (text !== '') {
            $.ajax({
                type: "post",
                url: "/app/games_ajax/set_chat/" + dbGame.game_id,
                data: {
                    msg: text,
                    sender: sender,
                    msgType: msgType,
                },
                dataType: "json",
                success: function (data) {
                    if (!data['response']) {
                        sender = '';
                        text = data['msg'];
                        chat.formatMessage({ // Submit message
                            sender: sender,
                            src: "",
                            msg: text,
                            msgType: msgType
                        });
                    }
                    chatText.value = ""; // Empty chat textarea
                    chatMessage = ''; // Empty holder variable

                },
                error: function (e) {
                    console.log("Error: ", e);
                }
            });
        }
    }

    /**
     * Get chat from Database
     *
     * @return void
     */
    function getChat() {
        $.ajax({
            type: "get",
            url: "/app/games_ajax/get_chat/" + dbGame.game_id,
            dataType: "json",
            success: function (data) {
                // Check if there are any new messages before updating chat
                if (data.msgs && $('.chat-messages .menu-item').length !== data.msgs.length) {
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
                                sender: sender,
                                src: src,
                                msg: msgText,
                                msgType: msgType
                            });
                        }
                        return;
                    }
                    chat.formatMessage({
                        sender: sender,
                        src: src,
                        msg: msgText,
                        msgType: msgType
                    });
                }
            }
        })
    }

    /**
     * Save journal item to Database
     *
     *
     * @param post
     */
    function setJournalItem(post = {}) {
        $('#modal_journal .text-danger').hide();
        $.ajax({
            type: 'post',
            url: '/app/games_ajax/set_journal_item/' + dbGame.game_id,
            data: post,
            dataType: 'json',
            success: function (data) {
                toggleProgressSpinner();
                if (data['response']) {
                    // Add item to HTML
                    journal.reload();
                    // Dismiss journal modal
                    $('.modal_success_response').html('Added successfully');
                    $('#modal_success-toggle').click();
                } else if (data['msg']) {
                    $('#modal_journal .error').show();
                }
                toggleProgressSpinner(false);
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        })
    }
}