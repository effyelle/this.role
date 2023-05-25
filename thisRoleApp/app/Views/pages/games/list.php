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
                        <?php if (isset($games_list)): ?>
                            <?php foreach ($games_list as $game): ?>
                                <!--begin::Item-->
                                <div class="py-6 px-12 mb-3">

                                    <div class="d-flex flex-column justify-content-between align-items-center box-shadow-700 border-radius-5px p-6">
                                        <!--begin::Link to details-->
                                        <a href="<?= base_url() ?>/app/games/details/<?= $game['game_id'] ?>">
                                            <!--begin::Icon-->
                                            <div class="d-flex flex-column">
                                                <div class="symbol symbol-125px symbol-sm-150px symbol-lg-150px symbol-xl-200px circle game-img">
                                                <span class="symbol-label circle game-img"
                                                      style=" background: url('/assets/media/games/<?= ($game['game_folder'] ?? '') . '/' . ($game['game_icon'] ?? '') ?>') no-repeat;
                                                              background-size: cover;">
                                                </span>
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
                                        <a href="<?= base_url() ?>/app/games/launch/<?= $game['game_id'] ?>" target="_blank"
                                           class="btn btn-link btn-sm">Launch game</a>
                                        <!--end::Launch link-->
                                    </div>
                                </div>
                                <!--end::Item-->
                            <?php endforeach; ?>
                        <?php endif; ?>
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
                              class="form-control form-control-solid this-role-form-field"></textarea>
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
                                  style="background: url('/assets/media/games/default_game/frame.png'); background-size: cover">
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

        $('#game_icon').change(function () {
            readImageChange(this, q('.game_icon_holder')[0]);
        });

        $('#create_game_btn').click(function () {
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
    });
</script>