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
<script>
    document.addEventListener('DOMContentLoaded', function () {

        let board = new Board('.btn.dice');
        // Roll dices
        $('.btn.dice').click(function () {
            console.log(board.dices[this.value].roll());
            console.log($('#game_img')[0].files);
        });

        const menu_gallery = $('#menu_gallery');
        $('#game_img').click(function () {
            this.value = null;
        });
        $('#game_img').change(function () {
            menu_gallery.html(menu_gallery.html() + formatListItem());
            const imgHolder = $('.image_holder');
            const imgTitle = $('.img_title')
            if (imgHolder.length > 0) {
                readImageChange(this, imgHolder);
                let newImgName = Date.now() + '.' + this.files[0].type.split('/')[1];
                imgTitle[imgTitle.length - 1].innerHTML = newImgName;
                // Save image through AJAX
                saveImage(this.files[0], newImgName);
                this.value = '';
                console.log(this.files)
                return;
            }
            $('modal_error-toggle').click();
        });
    });
</script>