function initBoard(dbGame, session) {
    // * Board intance * //
    const board = new Board('.btn.dice');
    // * Chat object * //
    const chat = new board.Chat('.chat-messages');
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
            addChatMessage(chatMessage.trim());
        }
    });
    // ********************************* //
    // * Listen to send button in chat * //
    // ********************************* //
    document.querySelector('.chat-bubble ~ div .btn').addEventListener('click', function () {
        addChatMessage(chatMessage.trim());
    });
    // * Journal intance * //
    const journal = new board.Journal('journal');
    // * Delete add button and modal if user is not creator * //
    if (session.user.user_id !== dbGame.game_creator) {
        $('#modal_journal-toggle').remove();
        $('#modal_journal').remove();
    }
    // ********************************************* //
    // * Add journal item when save button clicked * //
    // ********************************************* //
    $('#modal_journal .save_btn').click(function () {
        let journalItemTitle = $('#journal_title-input');
        let journalItemType = $('#journal-item_type').find(':selected').val();
        // Boolean to check if one or more fields are empty
        let fieldsRequired = journalItemTitle.val() !== '' && journalItemType !== "-1";
        // Toggle spinner in save button
        toggleProgressSpinner();
        // Show error message if one or more fields are empty
        $('#modal_journal .error').toggleClass('d-none', fieldsRequired);
        // If no fields are empty
        if (fieldsRequired) {
            // Add item to HTML
            journal.formatJournalItem(journalItemType, {
                src: '',
                title: journalItemTitle.val(),
            });
            // Dismiss journal modal
            $('#modal_journal .dismiss_btn').click();
        }
        // Always stop progress spinner at the end of all actions
        toggleProgressSpinner(false);
    });
    // ********************************** //
    // * Empty journal modal on closure * //
    // ********************************** //
    $('#modal_journal').on('hidden.bs.modal', function () {
        $('#journal_title-input').val('');
        $('#journal-item_type option[value=-1]').prop('selected', true);
        $('#modal_journal input').prop('checked', false);
    });

    /**
     * Add Chat Message
     * @param text
     */
    function addChatMessage(text) {
        // You do not check chatMessage variable here for it might have <br/> but nothing else
        if (text !== '') { // Check textarea VALUE is not empty
            chat.formatMessage({ // Submit message
                sender: $('#charsheet_selected').find(':selected').text(),
                src: "",
                msg: chatMessage.trim(),
                msgType: "chatMessage"
            });
            this.value = ""; // Empty chat textarea
            chatMessage = ''; // Empty holder variable
        }
    }
}

/*
 * -----------------------
 * - CHAT DATABASE JSON FORMAT -
 * -----------------------
 * Need to save:
 *  - Message
 *  - Sender
 *  -
 */

// Save chat to DB
function setChat() {
}

// Load chat from DB
function getChat() {
}

// Save journal to DB
function setJournal() {
}

// Load journal from DB
function getJournal() {
}