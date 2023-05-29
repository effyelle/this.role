<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <form action="<?= base_url(); ?>app/games/details/<?= $game['game_id'] ?? '' ?>" method="post"
              enctype="multipart/form-data"
              autocomplete="off"
              class="card pb-4">
            <!--begin::Header-->
            <div class="card-header align-content-center">
                <div class="mx-auto w-100">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-2 fs-5 fs-lg-3">
                            <a href="<?= base_url() ?>app/games/list" class="btn btn-sm btn-link fs-5 fs-lg-3">
                                <span class="text-dark text-hover-primary fw-bolder">My Games</span>
                            </a>
                            <span> / </span>
                            <div class="btn btn-sm px-0 cursor-default">
                                <span class="game_title fs-5 fs-lg-3 fw-bolder"></span>
                                <?php
                                if (isset($game) && $game['game_creator'] === $_SESSION['user']['user_id']) {
                                    echo '<div class="form-control-solid">'
                                        . '    <input id="game_title-input" name="game_title" maxlength="50"'
                                        . '         class="form-control this-role-input-field d-none"/>'
                                        . '</div>';
                                }
                                ?>
                            </div>
                        </div>
                        <?php
                        if (isset($game) && $game['game_creator'] === $_SESSION['user']['user_id']) {
                            echo '<div class="card-toolbar gap-5">'
                                . '   <button type="submit" class="save_game btn btn-sm btn-primary d-none">Save</button>'
                                . '   <button type="button" class="edit_game btn btn-sm btn-danger">Edit Game</button>'
                                . '</div>';
                        }
                        ?>
                    </div>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body">
                <div class="w-100 mb-6 p-6 flex-column align-items-center justify-content-center">
                    <div class="symbol symbol-200px">
                        <span class="symbol-label circle game_icon-holder"></span>
                    </div>
                    <?php
                    if (isset($game) && $game['game_creator'] === $_SESSION['user']['user_id']) {
                        echo '<input type="file" id="change-game_icon" name="game_icon" class="d-none"/>'
                            . '<div class="flex-row-wrap justify-content-center align-items-center gap-5">'
                            . '   <label for="change-game_icon" class="btn btn-sm btn-link d-none">Change</label>'
                            . '</div>';
                    }
                    ?>
                </div>
                <div class="m-6 p-6 text-justify">
                    <!--begin::Game details-->
                    <p class="game_details"></p>
                    <!--end::Game details-->
                    <!--begin::Launch link-->
                    <a href="<?= base_url() ?>app/games/launch/<?= $game['game_id'] ?>" target="_blank"
                       class="btn btn-link btn-sm">Launch game</a>
                    <!--end::Launch link-->
                </div>
                <?php
                if (isset($game) && $game['game_creator'] === $_SESSION['user']['user_id']) {
                    echo '<div class="form-control-solid mb-5">'
                        . '    <textarea id="game_details-textarea" rows="5" name="game_details" placeholder="Enter your game details..."'
                        . '          class="form-control this-role-input-field d-none"></textarea>'
                        . '</div>';
                    echo '<div class="flex-row-wrap justify-content-between align-items-center">'
                        . '    <button type="button" class="btn btn-sm btn-garnet invite_link-btn">Get Invite Link</button>'
                        . '    <button type="button" class="btn btn-sm btn-dark del_game-btn">Delete Game</button>'
                        . '</div>';
                } ?>
                <div class="text-danger text-center"><?= $error ?? ''; ?></div>
            </div>
            <!--end:Body-->
        </form>
    </div>
</div>
<script>
    // Save game array details
    const game =<?php echo json_encode($game ?? [])?>;
    // On content loaded
    document.addEventListener('DOMContentLoaded', function () {
        const gameIconHolder = $('.game_icon-holder')[0];
        const gameTitle = $('.game_title');
        const gameTitleInput = $('#game_title-input');
        const gameDetails = $('.game_details');
        const gameDetailsTextarea = $('#game_details-textarea');
        const editGameBtn = $('.edit_game');
        const inviteLinkBtn = $('.invite_link-btn');
        // Load game details into page
        formatGameDetails(game);
        // ********************************************** //
        // ***************** DOM events ***************** //
        // ********************************************** //
        // Edit game, toggle inputs and info
        editGameBtn.click(function () {
            if (this.innerHTML === 'Edit Game') {
                toggleGameEdition();
                return;
            }
            toggleGameEdition(false);
        });
        // Invite link, create through AJAX
        inviteLinkBtn.click(function () {
            ajax("/app/games_ajax/create_invite_url/<?=$game['game_id']?>").done((data) => {
                if (data && data['response'] && data['url']) {
                    $('.modal_success_response').html(
                        'This is your new invite url!<br/>' +
                        'Remember it expires in one day<br/>' +
                        '<b>' + data['url'] + '</b>'
                    );
                    $('#modal_success-toggle').click();
                    return;
                }
                $('.modal_error_response').html(data['msg']);
                $('#modal_error-toggle').click();
            }).fail((e) => {
                console.log(e.responseText);
            });
        })
        // Change DOM icon on input change
        $('#change-game_icon').change(function () {
            readImageChange(this, gameIconHolder);
        });
        // Delete game
        $('.del_game-btn').click(function () {
            openConfirmation(deleteGame);
        });

        // ********************************************** //
        // ***************** DOM events ***************** //
        // ********************************************** //

        function formatGameDetails() {
            if (game.game_title) gameTitle.html(game.game_title);
            if (game.game_details) gameDetails.html(game.game_details);
            if (game.game_icon) {
                gameIconHolder.style.backgroundImage = 'url("/assets/media/games/' + game.game_folder + '/' + game.game_icon + '")';
                return;
            }
            gameIconHolder.style.backgroundImage = 'url("/assets/media/avatars/blank.jpg")';
        }

        function toggleGameEdition(editable = true) {
            $('.save_game').toggleClass('d-none', !editable);
            $('label[for=change-game_icon]').toggleClass('d-none', !editable);
            gameTitleInput.toggleClass('d-none', !editable);
            gameTitle.toggleClass('d-none', editable);
            gameDetailsTextarea.toggleClass('d-none', !editable);
            gameDetails.toggleClass('d-none', editable);
            inviteLinkBtn.toggleClass('d-none', editable);
            if (editable) {
                editGameBtn.html('Cancel');
                gameTitleInput.val(game.game_title);
                gameDetailsTextarea.val(game.game_details);
                return;
            }
            gameTitleInput.val('');
            gameDetailsTextarea.val('');
            editGameBtn.html('Edit Game');
            formatGameDetails();
        }

        function deleteGame() {
            ajax("/app/games/ajax_del_game/" + game.game_id).done((data) => {
                if (data['response']) {
                    $('.modal_success_response').html('Game deleted successfully');
                    $('#modal_success-toggle').click();
                    setTimeout(() => {
                        go_url('/app/games/list');
                    }, 2500);
                    return;
                }
                $('.modal_error_response').html(data['msg']);
                $('#modal_error-toggle').click();
            }).fail((e) => {
                $('.modal_error_response').html('Something went wrong<br>' + e);
                $('#modal_error-toggle').click();
                console.log(e.responseText)
            });
        }
    });
</script>