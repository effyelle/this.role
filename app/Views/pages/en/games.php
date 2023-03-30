<?php

$gamesPicFolder = '/assets/uploads/games/game_profile/';

?>

    <div class="d-flex flex-column flex-column-fluid container-fluid">
        <!--begin::Post-->
        <div class="content flex-column-fluid" id="kt_content">
            <!--begin::Row-->
            <div class="row g-5 g-lg-10">
                <!--begin::Col-->
                <div class="mb-xl-10">
                    <!--begin::List Widget 6-->
                    <div class="card h-xl-100">
                        <!--begin::Header-->
                        <div class="card-header">
                            <div class="card-toolbar gap-5">
                                <h2>Games</h2>
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
                                                <a href="#" class="h4 text-gray-800 text-hover-primary fw-bolder"
                                                   data-bs-target="#news-modal" data-bs-toggle="modal">
                                                    <?= $game['title'] ?>
                                                </a>
                                            </div>
                                            <div class="d-flex flex-column justify-content-center">
                                                <span class="badge badge-light flex-column fw-bolder my-2 px-0">
                                                    Created by <?= $game['username']; ?>
                                                </span>
                                                <?php if ($game['userId'] === 3) {
                                                    echo '<button class="btn btn-link fs-7 text-end py-0" value = "' . $game['userId']
                                                        . '" href = "/">Editar</button>';
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
        </div>
        <!--end::Post-->
        <!--begin::NewsModal -->
        <div class="modal fade" id="news-modal">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header justify-content-between">
                        <!--begin::NewsTitle-->
                        <div class="position-relative w-100 pe-3">
                            <label class="h1" for="news-title"></label>
                            <input type="text" id="news-title"
                                   class="form-control form-control-solid is-required news-field d-none">
                            <span class="popup news-feedback">El título de la noticia no puede estar vacío.</span>
                        </div>
                        <!--end::NewsTitle-->
                        <!--start::EditButton-->
                        <button type="button" class="btn btn-dark d-none align-self-end mx-1" id="edit_news-btn">
                            Editar
                        </button>
                        <!--end::EditButton-->
                        <!--start::DeleteButton-->
                        <button type="button" class="btn btn-danger d-none align-self-end mx-1" id="delete_news-btn">
                            Borrar
                        </button>
                        <!--end::DeleteButton-->
                        <!--start::SaveButton-->
                        <button type="button" class="btn btn-primary d-none align-self-end mx-1" id="save_news-btn">
                            Guardar
                        </button>
                        <!--end::SaveButton-->
                        <!--begin::CloseBtn-->
                        <button class="btn btn-close align-self-start" data-bs-dismiss="modal"></button>
                        <!--end::CloseBtn-->
                    </div>
                    <div class="modal-body">
                        <div class="mb-5 position-relative news-icon d-none">
                            <label for="news-icon" class="required form-label">Icono</label>
                            <input type="file" id="news-icon" accept="image/*"
                                   class="form-control form-control-solid is-required">
                        </div>
                        <div class="mb-5 position-relative">
                            <label for="news-body" class="required form-label d-none">Cuerpo de la noticia</label>
                            <div class="mb-5" id="news-body"></div>
                            <span class="popup news-feedback">El cuerpo de la noticia no puede estar vacío.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--end::NewsModal -->
        <!-- CONTENT GOES HERE -->

        <!--end::Post-->
        <!--begin::Footer-->
        <div class="footer py-4 d-flex flex-column flex-md-row flex-stack" id="kt_footer">
            <!--begin::Copyright-->
            <div class="text-dark order-2 order-md-1">
                <span class="text-muted fw-bold me-1">2023©</span>
                <a href="https://keenthemes.com" target="_blank" class="text-gray-800 text-hover-primary">Embou</a>
            </div>
            <!--end::Copyright-->
            <!--begin::Menu-->

            <!--end::Menu-->
        </div>                        <!--end::Footer-->
    </div>

<?php

foreach ($gamesSample as $game) {
    echo "<img src='" . $gamesPicFolder . $game['img_src'] . "' alt='' height='200'/><br/><br/><br/>" . $game['title'] . "<br/>" . $game['username'];
}