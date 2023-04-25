<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <form action="/app/games/details/<?= $game['game_id'] ?? '' ?>" method="post" enctype="multipart/form-data"
              autocomplete="off"
              class="card pb-4">
            <!--begin::Header-->
            <div class="card-header align-content-center">
                <div class="mx-auto w-100">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-2 fs-5 fs-lg-3">
                            <a href="/app/games/list" class="btn btn-sm btn-link fs-5 fs-lg-3">
                                <span class="text-hover-primary">My Games</span>
                            </a>
                            <span> / </span>
                            <div class="btn btn-sm px-0 cursor-default fs-5 fs-lg-3">
                                <span class="game_title"></span>
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
                                . '   <button type="button" class="edit_game btn btn-sm btn-warning">Edit Game</button>'
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
                <p class="mb-6 p-6 text-justify game_details"></p>
                <?php
                if (isset($game) && $game['game_creator'] === $_SESSION['user']['user_id']) {
                    echo '<div class="form-control-solid mb-5">'
                        . '    <textarea id="game_details-textarea" rows="5" name="game_details" placeholder="Enter your game details..."'
                        . '          class="form-control this-role-input-field d-none"></textarea>'
                        . '</div>';
                    echo '<div class="flex-row-wrap justify-content-end align-items-center">'
                        . '    <button type="button" class="btn btn-sm btn-garnet invite_link-btn">Get invite link</button>'
                        . '</div>';
                } ?>
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
        const gameIconHolder = $('.game_icon-holder');
        const gameTitle = $('.game_title');
        const gameTitleInput = $('#game_title-input');
        const gameDetails = $('.game_details');
        const gameDetailsTextarea = $('#game_details-textarea');
        const editGameBtn = $('.edit_game');
        // Load game details into page
        formatGameDetails(game);

        function formatGameDetails() {
            if (game.game_title) gameTitle.html(game.game_title);
            if (game.game_details) gameDetails.html(game.game_details);
            if (game.game_icon) {
                gameIconHolder.css('background-image', 'url("' + game.game_icon + '")');
                gameIconHolder.css('background-size', 'cover');
            }
        }

        editGameBtn.click(function () {
            if (this.innerHTML === 'Edit Game') {
                toggleGameEdition();
                return;
            }
            toggleGameEdition(false);
        });

        $('.invite_link-btn').click(function () {
            $.ajax({
                type: "get",
                url: "/games/createInviteUrl/<?=$game['game_id']?>",
                dataType: "json",
                success: function (data) {
                    if (data && data['response'] && data['url']) {
                        $('.modal_success_response').html(
                            'This is your new invite url!<br/>' +
                            'Remember it expires in one day<br/>' +
                            '<b>' + data['url'] + '</b>'
                        );
                        $('#modal_success-toggle').click();
                        return;
                    }
                    $('.modal_error_response').html('Something went wrong');
                    $('#modal_error-toggle').click();
                },
                error: function (e) {
                    console.log("Error: ", e.getError());
                }
            })
        })

        $('#change-game_icon').change(function () {
            readImageChange(this, $('.game_icon-holder'));
        });

        function toggleGameEdition(editable = true) {
            $('.save_game').toggleClass('d-none', !editable);
            $('label[for=change-game_icon]').toggleClass('d-none', !editable);
            gameTitleInput.toggleClass('d-none', !editable);
            gameTitle.toggleClass('d-none', editable);
            gameDetailsTextarea.toggleClass('d-none', !editable);
            gameDetails.toggleClass('d-none', editable);
            $('.invite_link-btn').toggleClass('d-none', editable);
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
    });
</script>