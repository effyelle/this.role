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
                <div class="mx-auto w-100 w-xxl-800px">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-5">
                            <h2>My Games</h2>
                        </div>
                        <div class="card-toolbar gap-5">
                            <button type="button" id="createGameBtn" class="btn btn-sm btn-warning align-self-start">
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
                    <div class="d-flex flex-column flex-md-row flex-md-wrap gap-12 justify-content-start align-items-center align-content-center">
                        <?php foreach ($gamesSample as $game): ?>
                            <!--begin::Item-->
                            <a href="/games/game/<?= $game['id_game'] ?>" target="_blank"
                               class="px-15 py-5 mb-3 w-300px h-300px d-flex flex-column justify-content-between align-items-center box-shadow-700 border-radius-5px">
                                <!--begin::Icon-->
                                <div class="d-flex flex-column">
                                    <div class="symbol symbol-125px symbol-sm-150px symbol-lg-150px symbol-xl-200px me-5 circle game-img">
                                        <span class="symbol-label circle game-img"
                                              style=" background: url(<?= $gamesPicFolder . $game['img_src'] ?>) no-repeat;
                                                      background-size: cover;">
                                        </span>
                                    </div>
                                </div>
                                <!--end::Icon-->
                                <!--begin::Section-->
                                <div class="d-flex flex-column align-items-center justify-content-around">
                                    <!--begin::Title-->
                                    <div class="me-2 mt-4">
                                        <h6 class="game-title"><?= $game['title'] ?></h6>
                                    </div>
                                    <!--end::Title-->
                                    <!--begin::Details-->
                                    <!--
                                    <div class="d-flex flex-column justify-content-center">
                                        <span class="d-flex flex-row gap-4 align-items-center align-self-end">
                                            <?php /*echo $game['id_user'] == $_SESSION['user']['id']
                                                ? '<span class="badge badge-light flex-column fw-bolder my-2 px-2">Created by you</span>
                                                    <button class="btn btn-link fs-7 fs-xl-5 text-end py-0 edit-btn">Edit</button>'
                                                : '';*/ ?>
                                        </span>
                                    </div>
                                    -->
                                    <!--end::Details-->
                                </div>
                                <!--end::Section-->
                            </a>
                            <!--end::Item-->
                        <?php endforeach; ?>
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

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const defaultGameImg = '/assets/media/games/frame.png';
        let editBtn = $('.edit-btn');
    });
</script>