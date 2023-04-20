<div class="this-game w-100 h-100 bg-white"></div>
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_add_token">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-12">
                <div class="icon-error mx-auto"></div>
            </div>
            <div class="modal-body">
                <div class="mb-5">
                    <p class="text-center modal_error_response">We apologize for the inconveniences</p>
                </div>
                <div class="d-flex flex-row justify-content-center">
                    <button class="btn btn-danger confirm_answer" data-bs-dismiss="modal" tabindex="-1">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Modal-->
<script type="text/javascript" src="/assets/js/custom/games/formatGame.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Board.js"></script>
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
    });
</script>