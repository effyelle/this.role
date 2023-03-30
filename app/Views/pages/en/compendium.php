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
                            <h2>Compendium</h2>
                        </div>
                    </div>
                    <!--end::Header-->
                    <!--begin::Body-->
                    <div class="card-body">
                        <div class="card-px py-5 d-flex flex-row flex-wrap" id="games-list">
                            <?php foreach ($mainSections as $section): ?>
                                <!--begin::Item-->
                                <a href="#" class="h4 text-gray-800 d-flex flex-column align-items-sm-center col-3
                                    mb-7 col-hover-3 gap-6 text-hover-primary">
                                    <!--begin::Icon-->
                                    <div class="symbol symbol-75px circle">
                                        <span style="background: url(<?= $section['img_src'] ?>) no-repeat center center;
                                                background-size: contain;" class="symbol-label circle">
                                        </span>
                                    </div>
                                    <!--end::Icon-->
                                    <!--begin::Section-->
                                    <div class="d-flex flex-row-fluid flex-wrap h-75px gap-5">
                                        <div class="flex-grow-1">
                                            <span class="fw-bolder"
                                                  data-bs-target="#news-modal" data-bs-toggle="modal">
                                                <?= $section['name'] ?>
                                            </span>
                                        </div>
                                    </div>
                                    <!--end::Section-->
                                </a>
                                <!--end::Item-->
                            <?php endforeach; ?>
                        </div>
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
</div>