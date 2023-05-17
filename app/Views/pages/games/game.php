<div class="this-game w-100 h-100 bg-white position-relative overflow-hidden">
    <img id="this_game" style="width: 100%;top: 0;left: 0;" draggable="false"
         class="position-absolute this-game-layer d-none" alt="Map Layer"/>
    <span class="this-game-transition w-100 h-100 flex-row justify-content-center align-items-center bg-gray-100">
        <span class="empty-layers d-none fs-4 text-center text-primary"></span>
        <span class="spinner-border align-middle ms-2"></span>
    </span>
    <div id="tokens_container"></div>
</div>
<?php if (isset($game) && isset($_SESSION['user']) && $_SESSION['user']['user_id'] === $game['game_creator']): ?>

    <!--begin::Modal-->
    <div class="modal fade" tabindex="-1" id="add_layer-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Add Layer</h4>
                </div>
                <div class="modal-body">
                    <!--begin:Menu item-->
                    <div class="menu-item">
                        <div class="form-control-solid mb-5">
                            <label for="layer_name" class="menu-link required">Layer Name</label>
                            <input type="text" id="layer_name" name="layer_name"
                                   class="form-control this-role-form-field"/>
                        </div>
                        <div class="form-control-solid mb-5">
                            <label for="add_map-input" class="menu-link">
                                <i class="me-3 fa fa-solid fa-map"></i>
                                <span class="menu-title required">Add Map</span>
                            </label>
                            <input type="file" accept="image/*" id="add_map-input" name="add_map-input"
                                   class="form-control"/>
                        </div>
                        <div class="mb-5 flex-row justify-content-center">
                            <div class="symbol symbol-125px mx-auto">
                                <span class="symbol-label" id="add_layer-preview"></span>
                            </div>
                        </div>
                    </div>
                    <div id="add_layer-error" class="fs-4 text-danger text-center w-100 d-none">
                        Please fill all data.
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-sm btn-dark dismiss_btn" data-bs-dismiss="modal"
                            tabindex="0">
                        Cancel
                    </button>
                    <button type="button" id="add_layer-btn" class="btn btn-sm btn btn-primary" tabindex="-1">
                        <!--begin::Indicator label-->
                        <span class="indicator-label">Save</span>
                        <!--end::Indicator label-->
                        <!--begin::Indicator progress-->
                        <span class="indicator-progress">Please wait...
                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                        <!--end::Indicator progress-->
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!--end::Modal-->
    <!--begin::Modal-->
    <div class="modal fade" tabindex="-1" id="modal_journal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Add journal item</h4>
                </div>
                <div class="modal-body">
                    <div class="mb-10">
                        <label for="item_name" class="form-label required">Enter a name or title</label>
                        <input type="text" id="item_name" name="item_name" autocomplete="off"
                               value="Character or handout"
                               class="form-control this-role-form-field"/>
                    </div>
                    <div class="mb-10">
                        <label for="item_type" class="form-label required">Type of item</label>
                        <select type="text" id="item_type" name="item_type"
                                class="form-control this-role-form-field">
                            <option value="character" selected>Character</option>
                            <option value="handout">Handout</option>
                        </select>
                    </div>
                    <div class="row gap-1 mb-5">
                        <?php if (isset($players) && !(count($players) === 1 && $players[0]['user_id'] === $_SESSION['user']['user_id'])): ?>
                            <span class="form-label text-gray-800 fw-bolder">Choose if players can see this item</span>
                            <div id="include_players" class="flex-row-wrap gap-12 fs-8">
                                <?php foreach ($players as $player):
                                    if ($player['user_id'] !== $_SESSION['user']['user_id']): ?>
                                        <div class="flex-column gap-2 can_see-can_edit">
                                            <span class="text-gray-800 text-italic fs-7"><?= $player['user_username'] ?></span>
                                            <div class="player-checkbox form-check form-check-solid can_see">
                                                <input type="checkbox" id="<?= $player['user_id'] ?>-can_see"
                                                       name="<?= $player['user_id'] ?>-can_see"
                                                       class="form-check-input form-check-inline player-can_see"/>
                                                <label for="<?= $player['user_id'] ?>-can_see"
                                                       class="form-check-label">
                                                    Can see
                                                </label>
                                            </div>
                                            <div class="player-checkbox form-check form-check-solid can_edit">
                                                <input type="checkbox" id="<?= $player['user_id'] ?>-can_edit"
                                                       name="<?= $player['user_id'] ?>-can_edit"
                                                       class="form-check-input form-check-inline player-can_edit"/>
                                                <label for="<?= $player['user_id'] ?>-can_edit"
                                                       class="form-check-label">
                                                    Can edit
                                                </label>
                                            </div>
                                        </div>
                                    <?php endif;
                                endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                    <p class="text-center text-danger error" style="display: none;">All fields are required</p>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-sm btn-dark dismiss_btn" data-bs-dismiss="modal"
                            tabindex="0">
                        Cancel
                    </button>
                    <button type="button" id="save_journal_item-btn" class="btn btn-sm btn btn-primary" tabindex="-1">
                        <!--begin::Indicator label-->
                        <span class="indicator-label">Save</span>
                        <!--end::Indicator label-->
                        <!--begin::Indicator progress-->
                        <span id="wait" class="indicator-progress">Please wait...
                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                        <!--end::Indicator progress-->
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!--end::Modal-->
<?php endif; ?>
<!--begin::Draggable Modals-->
<div id="draggable-modals_container"></div>
<!--emd::Draggable Modals-->
<script src="/assets/plugins/custom/ckeditor/ckeditor-classic.bundle.js"></script>
<script src="/assets/js/custom/apps/ckeditor/CKEditor.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/game.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/GameMap.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Chat.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Journal.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Board.js"></script>
<script type="text/javascript" src="/assets/js/custom/apps/draggable/Draggable.js"></script>
<script>
    // * Game details * //
    let dbGame =<?php echo json_encode($game ?? []) ?>;
    let session =<?php echo json_encode($_SESSION['user'] ?? []) ?>;
    document.addEventListener('DOMContentLoaded', function () {
        if (dbGame !== [] && dbGame.game_id) {
            // Pass game details to set board, chat and journal
            initGame();
        }
    });
</script>
