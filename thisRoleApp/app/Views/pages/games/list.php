<?php

$gamesPicFolder = '/assets/uploads/games/game_profile/';

?>

<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header align-content-center">
                <div class="mx-auto w-100">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-5">
                            <span class="btn btn-sm px-0 fs-5 fs-lg-3 fw-bolder cursor-default">My Games</span>
                        </div>
                        <div class="card-toolbar gap-5">
                            <button type="button" id="createGameBtn" class="btn btn-sm btn-danger align-self-start"
                                    data-bs-toggle="modal" data-bs-target="#new_game_modal">
                                Create New Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body mx-12">
                <div id="games-list" class="m-auto">
                    <div class="flex-row-wrap row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 justify-content-start align-items-stretch">
                        <?php if (isset($games_list)) { ?>
                            <?php foreach ($games_list as $game): ?>
                                <!--begin::Item-->
                                <div class="py-6 px-12 mb-3 game_item_list">
                                    <div class="d-flex flex-column justify-content-between align-items-center box-shadow-700 border-radius-5px p-6">
                                        <!--begin::Link to details-->
                                        <a href="<?= base_url() ?>app/games/details/<?= $game['game_id']; ?>">
                                            <!--begin::Icon-->
                                            <div class="d-flex flex-column align-items-center">
                                                <div class="symbol symbol-125px symbol-sm-150px symbol-lg-150px symbol-xl-200px circle game_icon">
                                                    <span class="symbol-label circle"></span>
                                                </div>
                                            </div>
                                            <!--end::Icon-->
                                            <!--begin::Title Container-->
                                            <div class="d-flex flex-column align-items-center justify-content-around">
                                                <!--begin::Title-->
                                                <div class="me-2 mt-4 text-center">
                                                    <h6 class="game-title"><?= $game['game_title'] ?></h6>
                                                    <?php if ($game['game_creator'] === $_SESSION['user']['user_id']) {
                                                        echo '<i>You created this game</i>';
                                                    } ?>
                                                </div>
                                                <!--end::Title-->
                                            </div>
                                            <!--end::Title Container-->
                                        </a>
                                        <!--end::Link to details-->
                                        <!--begin::Launch link-->
                                        <a href="<?= base_url() ?>app/games/launch/<?= $game['game_id'] ?>"
                                           target="_blank"
                                           class="btn btn-link btn-sm">Launch game</a>
                                        <!--end::Launch link-->
                                    </div>
                                </div>
                                <!--end::Item-->
                            <?php endforeach; ?>
                        <?php } else { ?>
                            <div class="fs-4 my-4 w-100 text-center text-info">There are no games here yet, you can start by creating one!</div>
                        <?php } ?>
                    </div>
                </div>
            </div>
            <!--end::Body-->
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->

<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="new_game_modal">
    <div class="modal-dialog">
        <!--begin::Form-->
        <form id="create_game_form" autocomplete="off" method="post" enctype="multipart/form-data"
              action="<?= base_url(); ?>app/games/list"
              class="modal-content">
            <!--begin::Header-->
            <div class="modal-header">
                <h3 class="modal-title">Create New Game</h3>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="modal-body">
                <div class="text-center text-danger fs-6 form_error d-none">Title is necessary to create the game</div>
                <div class="form-group mt-5">
                    <label for="game_title">Game Title</label>
                    <input id="game_title" name="game_title" type="text" maxlength="50"
                           class="form-control form-control-solid this-role-form-field"/>
                </div>
                <div class="form-group mt-5">
                    <label for="game_details">Game Details</label>
                    <textarea id="game_details" name="game_details" rows="3" maxlength="500"
                              class="form-control form-control-solid this-role-form-field resize-vertical"></textarea>
                </div>
                <div class="form-group mt-5 d-flex flex-column flex-sm-row justify-content-center align-items-center row-cols-sm-2">
                    <div class="d-flex flex-column justify-content-center align-items-center gap-3 col-6">
                        <span>Game Icon</span>
                        <input type="file" id="game_icon" name="game_icon"
                               class="d-none this-role-form-field"/>
                        <label for="game_icon" class="btn btn-link fs-7">Upload</label>
                    </div>
                    <div class="col-6">
                        <span class="symbol symbol-125px symbol-sm-150px symbol-md-175px symbol-xl-200px circle">
                            <span class="symbol-label circle game_icon_holder"
                                  style="background-image: url('/assets/media/games/blank.jpg');">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <!--end::Body-->
            <!--begin::Footer-->
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="create_game_btn" class="btn btn-primary">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Send</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress">
                        Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                    <!--end::Indicator progress-->
                </button>
            </div>
            <!--end::Footer-->
        </form>
        <!--end::Form-->
    </div>
</div>
<!--end::Modal-->

<script>
    document.addEventListener('DOMContentLoaded', function () {
        /**
         * Load game info if $games_list from PHP is declared
         */
        <?php if (isset($games_list)) { ?>
        /**
         * Array with player games
         *
         * @type {object}
         */
        const gameList = <?=json_encode($games_list ?? []);?>;
        /**
         * HTML object of games items in list
         *
         * @type {NodeListOf<Element>}
         */
        const gameItemsList = q('.game_item_list');
        // * Fill game icons on the list upon page load * //
        /**
         * HTML object of icons in games list
         *
         * @type {NodeListOf<Element>}
         */
        const gameIconsList = q('.game_icon .symbol-label');

        for (let i = 0; i < gameItemsList.length; i++) {
            let itemIcon = '/assets/media/games/blank.jpg';
            let dbIcon = '/assets/media/games/' + gameList[i].game_folder + '/' + gameList[i].game_icon;
            if (urlExists(dbIcon)) itemIcon = dbIcon;
            gameIconsList[i].style.backgroundImage = 'url("' + itemIcon + '")';
        }
        <?php } ?>

        // * Change icon holder upon change * //
        /**
         * HTML object of game icon in new game modal
         *
         * @type {Element}
         */
        const modalGameIcon = q('#game_icon')[0];
        if (modalGameIcon) {
            modalGameIcon.change(function () {
                readImageChange(this, q('.game_icon_holder')[0]);
            });
        }

        // * Create game * //
        const createGameBtn = q('#create_game_btn')[0];
        if (createGameBtn) {
            createGameBtn.click(function () {
                let btnLabel = $('.indicator-label');
                let btnProgress = $('.indicator-progress');
                let form_error = $('#create_game_form .form_error');
                form_error.addClass('d-none');
                btnLabel.hide();
                btnProgress.show();
                if ($('#game_title').val() !== '') {
                    $('#create_game_form').submit();
                }
                setTimeout(function () {
                    form_error.removeClass('d-none');
                    btnLabel.show();
                    btnProgress.hide();
                }, 500);
            });
        }
    });
</script>