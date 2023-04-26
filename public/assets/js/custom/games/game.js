function initBoard(dbGame, session) {
    // * Board intance * //
    const board = new Board('.btn.dice');
    // * Chat object * //
    const chat = new board.Chat('.chat-messages');
    // * Journal intance * //
    const journal = new Journal('journal');

    getChat();
    getJournal();

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
    const chatText = document.querySelector('.chat-bubble textarea');
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
    $('#modal_journal .save_btn').click(function () {

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
                    }
                    chat.formatMessage({ // Submit message
                        sender: sender,
                        src: "",
                        msg: text,
                        msgType: msgType
                    });
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
                console.log(data)
                let sender = '';
                let src = '';
                let msgText = 'There are no messages yet, be the first to comment!';
                let msgType = 'error';
                if (data['response'] && data['msgs'] && data['msgs'].length > 0) {
                    for (let i in data['msgs']) {
                        let msg = data['msgs'][i];
                        sender = msg['chat_sender'];
                        src = '';
                        msgText = msg['chat_msg'];
                        msgType = msg['chat_msg_type'];
                    }
                }
                chat.formatMessage({
                    sender: sender,
                    src: src,
                    msg: msgText,
                    msgType: msgType
                });
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
                console.log(data);
                if (data['response']) {
                    // Add item to HTML
                    getJournal();
                    // Dismiss journal modal
                    $('#modal_journal .dismiss_btn').click();
                } else if (data['msg']) {
                    $('#modal_journal .error').show();
                }
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        })
    }

// Load journal from DB
    function getJournal() {
        journal.initJournal();
        $.ajax({
            type: 'post',
            url: '/app/games_ajax/get_journal_items/' + dbGame.game_id,
            dataType: 'json',
            success: (data) => {
                if (data['response'] && data['items']) {
                    for (let i in data['items']) {
                        journal.formatJournalItem(data.items[i]);
                    }
                } else if (data['msg']) {
                    $('.modal_error_response').html(data['msg']);
                    $('#modal_error-toggle').click();
                }
            },
            error: function (e) {
                console.log("Error: ", e);
            }
        });
    }
}
