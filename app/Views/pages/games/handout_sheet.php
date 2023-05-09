<?php if (isset($item)) {
    $sheet = json_decode($item['item_sheet']) ?? [];
    var_dump($sheet);`
?>
    <div class="modal-header flex-row-wrap justify-content-between align-items-center cursor-move">
        <div class="" data-from="item_name">
            <!--Autofill-->
        </div>
        <div class="flex-row-wrap gap-5 align-items-end justify-content-end align-self-start">
            <button type="button" value="<?= $item['item_id'] ?>" class="btn p-0 minmax-btn text-hover-dark">
                <i class="fa-solid fa-minus fs-3"></i>
            </button>
            <button type="button" value="<?= $item['item_id'] ?>" class="btn p-0 close_item-btn text-hover-dark">
                <i class="fa-solid fa-close fs-1"></i>
            </button>
        </div>
    </div>
    <div class="modal-body">
        <div class="flex-column align-content-center align-items-center justify-content-center">
            <!--begin::Content-->
            <div id="draggable_<?= $item['item_id'] ?>-character" class="py-8 px-2 tab-pane fade show active">
                <button value="10" id="<?= $item['item_id'] ?>" class="d-none this-item-id"></button>
                <div class="flex-row-wrap gap-5 justify-content-center align-items-center" style="width: 800px">
                    <div class="column this-outline w-100 h-100">
                        <div class="flex-row-wrap justify-content-center p-4 gap-5 w-100 h-100">
                            <!--begin::Col-->
                            <div class="flex-column justify-content-center gap-5 w-100 w-100 h-100">
                                <!--begin::Character name-->
                                <div class="form-control-solid">
                                    <div class="flex-column">
                                        <?php if ($item['game_creator'] === $_SESSION['user']['user_id']) { ?>
                                            <input type="text" value="<?= $item['item_name'] ?>" id="item_name" name="item_name" class="form-control form-control-sm this-role-form-field ff-poiret fs-5 fw-boldest" />
                                            <label for="item_name">Handout Name</label>
                                        <?php } else { ?>
                                            <h4 data-from="item_name"><?= $item['item_name'] ?></h4>
                                        <?php } ?>
                                    </div>
                                </div>
                                <!--end::Character name-->
                                <!--begin::Row-->
                                <div class="flex-row-wrap justify-content-center gap-8 w-100 h-100">
                                    <!--begin::Image-->
                                    <div class="d-flex flex-column align-items-center w-100 h-100">
                                        <input id="item_icon" name="item_icon" type="file" class="d-none this-role-form-field" />
                                        <span class="item_icon-holder w-100 h-100" style="background-image: url(/assets/media/avatars/blank.png);
                                              background-size: cover;background-position: center center;min-height: 50vh;"></span>
                                    </div>
                                    <!--end::Image-->
                                    <?php if ($item['game_creator'] === $_SESSION['user']['user_id']) { ?>
                                        <!--begin::Label-->
                                        <div class="d-flex justify-content-center align-items-center icon-hover-label">
                                            <label for="item_icon" class="btn btn-sm btn-link fs-7 p-0">Change</label>
                                        </div>
                                        <!--end::Label-->
                                    <?php } ?>
                                </div>
                                <!--end::Row-->
                            </div>
                            <!--end::Col-->
                        </div>
                    </div>
                </div>
            </div>
            <!--end::Content-->
        </div>
    </div>
<?php } ?>