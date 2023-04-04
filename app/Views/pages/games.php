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
                    <h2><?= $title ?></h2>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body">
                <?php foreach ($gamesSample as $game): ?>
                    <!--begin::Item-->
                    <div class="card-px py-5 flex-grow-1" id="games-list">
                        <!--begin::List Item-->
                        <div class="d-flex align-items-sm-center mb-7">
                            <!--begin::Icon-->
                            <div class="symbol symbol-75px symbol-xl-100px me-5 circle game-img">
                                <span class="symbol-label circle"
                                      style=" background: url(<?= $gamesPicFolder . $game['img_src'] ?>) no-repeat;
                                              background-size: cover;">
                                </span>
                            </div>
                            <!--end::Icon-->
                            <!--begin::Section-->
                            <div class="d-flex flex-row-fluid flex-wrap h-75px gap-5">
                                <!--begin::Title-->
                                <div class="flex-grow-1 me-2 mt-4 game-title">
                                    <a href="/games/game/<?= $game['idGame'] . '/' . $game['title'] ?>" target="_blank"
                                       class="h4 text-gray-800 text-hover-primary fw-bolder">
                                        <?= $game['title'] ?>
                                    </a>
                                </div>
                                <!--end::Title-->
                                <!--begin::Details-->
                                <div class="d-flex flex-column justify-content-center">
                                                <span class="badge badge-light flex-column fw-bolder my-2 px-0">
                                                    Created by <?= $game['username']; ?>
                                                </span>
                                    <?php if ($game['idUser'] === 3) {
                                        echo '<span class="d-flex flex-row gap-2 align-items-center align-self-end">
                                                  <button class="btn btn-link fs-7 fs-xl-5 text-end py-0 edit-btn"> Editar </button>
                                                   <i class="fa fa-solid fa-greater-than fa-xs"></i>
                                              </span>';
                                    } ?>
                                </div>
                                <!--end::Details-->
                            </div>
                            <!--end::Section-->
                        </div>
                        <!--end::List Item-->
                        <?php if ($game['idUser'] === 3): ?>
                            <!--begin::Edit Item-->
                            <div class="edit-game top-0 start-0">
                                <!--begin::Form-->
                                <form action="/games/change_icon" method="post"
                                      class="d-flex flex-row justify-content-start gap-12">
                                    <!--begin::Icon-->
                                    <div class="d-flex flex-column gap-6 align-items-start text-start">
                                        <div class="symbol symbol-125px symbol-xl-175px me-5 circle position-relative">
                                            <input id="game-img" type="file" accept="image/*" class="d-none"/>
                                            <span class="symbol-label circle game-img-input-holder"
                                                  style=" background: url(<?= $gamesPicFolder . $game['img_src'] ?>) no-repeat;
                                                          background-size: cover;">
                                                </span>
                                        </div>
                                        <div class="d-flex flex-row flex-wrap gap-4">
                                            <label for="game-img" class="btn p-1 text-hover-primary fs-7">
                                                Change
                                            </label>
                                            <button type="button" class="btn p-1 text-hover-danger fs-7 del-game-img">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <!--end::Icon-->
                                    <!--begin::Col-->
                                    <div class="d-flex flex-column w-50">
                                        <!--begin::Title-->
                                        <div class="mb-5">
                                            <label for="game-title" class="h3">Title</label>
                                            <input type="text" id="game-title" value="<?= $game['title'] ?>"
                                                   class="form-control form-control-solid bg-transparent text-center this-role-form-field"/>
                                        </div>
                                        <!--end::Title-->
                                        <!--begin::Buttons-->
                                        <div class="mt-5 d-flex flex-row gap-4 justify-content-between">
                                            <button type="button"
                                                    class="btn btn-dark py-2 px-4 py-xl-3 px-xl-6 cancel-edit">
                                                Cancelar
                                            </button>
                                            <button class="btn btn-primary py-2 px-4"
                                                    value="<?= $game['idGame'] ?>">
                                                Guardar
                                            </button>
                                        </div>
                                        <!--end::Buttons-->
                                    </div>
                                    <!--end::Col-->
                                </form>
                                <!--end::Form-->
                            </div>
                            <!--end::Edit Item-->
                        <?php endif; ?>
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

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const defaultGameImg = '/assets/appmedia/games/frame.png';
        let editBtn = $('.edit-btn');
        let editItem = $('.edit-game');
        let imgHolder = $('.game-img-input-holder');
        if (editBtn.length > 0) {
            for (let i = 0; i < editBtn.length; i++) {
                editBtn[i].addEventListener('click', function () {
                    for (let j = 0; j < editBtn.length; j++) {
                        if (i !== j) {
                            editItem[j].classList.remove('show');
                            editBtn[j].classList.remove('active');
                        }
                    }
                    editItem[i].classList.toggle('show');
                    this.classList.toggle('active');
                });
                $('.cancel-edit')[i].addEventListener('click', function () {
                    editItem.removeClass('show');
                    editBtn.removeClass('active');
                });
                $('.del-game-img')[i].addEventListener('click', function () {
                    imgHolder[i].style.background = 'url(' + defaultGameImg + ') no-repeat';
                    imgHolder[i].style.backgroundSize = 'contain';
                });
            }
        }
    });
</script>