<div class="this-game w-100 h-100 bg-white"></div>
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_journal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4>Add journal item</h4>
            </div>
            <div class="modal-body">
                <div class="mb-8">
                    <label for="journal_title-input" class="form-label">Enter a name or title</label>
                    <input type="text" id="journal_title-input"
                           class="form-control this-role-form-field"/>
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
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const board = new Board('.btn.dice');
        const chat = new Chat('.chat-messages');
        console.log(chat)

        $('.btn.dice').click(function () {
            chat.record.innerHTML = chat.record.innerHTML + chat.formatMessage({
                src: "",
                msg: board.dices[this.value].roll(),
                sender: $('#charsheet_selected').find(':selected').text(),
                type: "rollDice",
                dice: this.value,
                rolling: $('#roll-' + this.value).val()
            });
        });

        const chatText = document.querySelector('.chat-bubble textarea');

        document.querySelector('.chat-bubble ~ div .btn').addEventListener('click', function () {
            if (chatText.value !== '') {
                chat.record.innerHTML = chat.record.innerHTML + chat.formatMessage({
                    sender: $('#charsheet_selected').find(':selected').text(),
                    src: "",
                    msg: chatText.value,
                    type: "chatMessage"
                });
                chatText.value = "";

            }
        });

        chatText.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value !== '') {

                    chat.record.innerHTML = chat.record.innerHTML + chat.formatMessage({
                        sender: $('#charsheet_selected').find(':selected').text(),
                        src: "",
                        msg: this.value,
                        type: "chatMessage"
                    });
                    this.value = "";
                }
            }
        });

        // Create journal Object
        const journal = new Journal('journal');

        // Add journal item when save button clicked
        $('#modal_journal .save_btn').click(function () {
            let journalTitleInput = $('#journal_title-input');
            toggleProgressSpinner();
            if (journalTitleInput.val() !== '') {
                journal.formatJournalItem({title: journalTitleInput.val(), src: ''});
                $('#modal_journal .dismiss_btn').click();
            }
            toggleProgressSpinner(false);
        });

        // Empty journal modal on closure
        $('#modal_journal').on('hidden.bs.modal', function () {
            console.log('here')
            $('#journal_title-input').val('');
            $('#modal_journal input').prop('checked', false);
        });
    });
</script>