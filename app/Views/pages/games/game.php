<div class="this-game w-100 h-100 bg-white">
    <?php var_dump($game ?? '');
    ?>
</div>
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_journal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4>Add journal item</h4>
            </div>
            <div class="modal-body">
                <div class="mb-10">
                    <label for="journal_title-input" class="form-label required">Enter a name or title</label>
                    <input type="text" id="journal_title-input"
                           class="form-control this-role-form-field"/>
                </div>
                <div class="mb-10">
                    <label for="journal-item_type" class="form-label required">Type of item</label>
                    <select type="text" id="journal-item_type"
                            class="form-control this-role-form-field">
                        <option disabled selected value="-1">Select one</option>
                        <option value="character">Character</option>
                        <option value="handout">Handout</option>
                    </select>
                </div>
                <div class="row">
                    <span class="form-label">Choose the players who can edit this item</span>
                    <div class="flex-row-wrap gap-5">
                        <div class="player-checkbox form-check form-check-solid">
                            <input type="checkbox" id="player_1" name="player_1"
                                   class="form-check-input form-check-inline"/>
                            <label for="player_1" class="form-check-label">Player 1</label>
                        </div>
                        <div class="player- form-check form-check-solid">
                            <input type="checkbox" id="player_2" name="player_2"
                                   class="form-check-input form-check-inline"/>
                            <label for="player_2" class="form-check-label">Player 2</label>
                        </div>
                    </div>
                </div>
                <p class="text-center text-danger pt-8 error d-none">All fields are required</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-dark dismiss_btn" data-bs-dismiss="modal" tabindex="0">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn btn-primary save_btn" tabindex="-1">
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
<script src="/assets/plugins/custom/ckeditor/ckeditor-classic.bundle.js"></script>
<script src="/assets/js/custom/apps/ckeditor/CKEditor.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/game.js"></script>
<script type="text/javascript" src="/assets/js/custom/games/Board.js"></script>
<script>
    // * Game details from DATABASE * //
    const dbGame =<?php echo json_encode($game ?? []) ?>;
    const session =<?php echo json_encode($_SESSION); ?>;

    document.addEventListener('DOMContentLoaded', function () {
        if (dbGame !== [] && dbGame.game_id) {
            initBoard(dbGame, session);
        }
    });
</script>
