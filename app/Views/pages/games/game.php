<div class="this-game w-100 h-100 bg-white"></div>
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_journal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4>Add journal item</h4>
            </div>
            <div class="modal-body">
                <div class="mb-10">
                    <label for="journal_title-input" class="form-label required">Enter a name or title</label>
                    <input type="text" id="journal_title-input"
                           class="form-control this-role-form-field"/>
                </div>
                <div class="mb-10">
                    <label for="journal-item_type" class="form-label required">Type of item</label>
                    <select type="text" id="journal-item_type"
                            class="form-control this-role-form-field">
                        <option disabled selected value="-1">Select one</option>
                        <option value="character">Character</option>
                        <option value="handout">Handout</option>
                    </select>
                </div>
                <div class="row">
                    <span class="form-label">Choose the players who can edit this item</span>
                    <div class="flex-row-wrap gap-5">
                        <div class="player-checkbox form-check form-check-solid">
                            <input type="checkbox" id="player_1" name="player_1"
                                   class="form-check-input form-check-inline"/>
                            <label for="player_1" class="form-check-label">Player 1</label>
                        </div>
                        <div class="player- form-check form-check-solid">
                            <input type="checkbox" id="player_2" name="player_2"
                                   class="form-check-input form-check-inline"/>
                            <label for="player_2" class="form-check-label">Player 2</label>
                        </div>
                    </div>
                </div>
                <p class="text-center text-danger pt-8 error d-none">All fields are required</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-dark dismiss_btn" data-bs-dismiss="modal" tabindex="0">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn btn-primary save_btn" tabindex="-1">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Save</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress">Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                    <!--end::Indicator progress-->
                </button>
            </div>
        </div>
    </div>
</div>
<!--end::Modal-->
<script src="/assets/plugins/custom/ckeditor/ckeditor-classic.bundle.js"></script>
<script src="/assets/js/custom/apps/ckeditor/CKEditor.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/formatGame.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Board.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Journal.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {

        // * Board intance * //
        const board = new Board('.btn.dice');

        // * Chat object * //
        const chat = new Chat('.chat-messages');

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

        // * Journal intance * //
        const journal = new Journal('journal');

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
    });
</script>