<?php

$gamesPicFolder = '/assets/uploads/games/game_profile/';

?>

<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-xl-100">
            <!--begin::Header-->
            <div class="card-header">
                <div class="card-toolbar gap-5">
                    <h2><?= $title ?>></h2>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body">
                <?php foreach ($gamesSample as $game): ?>
                    <!--begin::Item-->
                    <div class="card-px py-5 flex-grow-1" id="games-list">
                        <div class="d-flex align-items-sm-center mb-7">
                            <!--begin::Icon-->
                            <div class="symbol symbol-75px me-5 circle">
                                            <span class="symbol-label circle"
                                                  style=" background: url(<?= $gamesPicFolder . $game['img_src'] ?>) no-repeat;
                                                          background-size: cover;">
                                            </span>
                            </div>
                            <!--end::Icon-->
                            <!--begin::Section-->
                            <div class="d-flex flex-row-fluid flex-wrap h-75px gap-5">
                                <div class="flex-grow-1 me-2 mt-4">
                                    <a href="/games/game/<?= $game['gameId'] . '/' . $game['title'] ?>" target="_blank"
                                       class="h4 text-gray-800 text-hover-primary fw-bolder">
                                        <?= $game['title'] ?>
                                    </a>
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                                <span class="badge badge-light flex-column fw-bolder my-2 px-0">
                                                    Created by <?= $game['username']; ?>
                                                </span>
                                    <?php if ($game['userId'] === 3) {
                                        echo '<button class="btn btn-link fs-7 text-end py-0"
                                                    value = "' . $game['userId'] . '">Editar</button>';
                                    } ?>
                                </div>
                            </div>
                            <!--end::Section-->
                        </div>
                    </div>
                    <!--end::Item-->
                <?php endforeach; ?>
            </div>
            <!--end::Body-->
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->