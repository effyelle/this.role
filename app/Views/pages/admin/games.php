<?php if ($_SESSION['user']['user_rol'] !== 'user') { ?>

    <!--begin::Row-->
    <div class="row g-5 g-lg-10">
        <!--begin::Col-->
        <div class="mb-xl-10">
            <!--begin::List Widget 6-->
            <div class="card text-center py-5">
                <h2 class="text-danger">WARNING!</h2>
                <h4>This area is still in development, most actions will not work.</h4>
            </div>
            <!--end::List Widget 6-->
        </div>
        <!--end::Col-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="row g-5 g-lg-10">
        <!--begin::Col-->
        <div class="mb-xl-10">
            <!--begin::List Widget 6-->
            <div class="card">
                <!--begin::Header-->
                <div class="card-header">
                    <div class="card-toolbar gap-5">
                        <div class="fs-5 fs-lg-3 fw-bolder"><?= $title ?? '' ?></div>
                    </div>
                </div>
                <!--end::Header-->
                <!--begin::Body-->
                <div class="card-body px-xxs-1 mx-sm-12 tab-content">
                    <?php if (isset($games_list) && is_array($games_list) && count($games_list) > 0): ?>
                        <table id="msgs_list"
                               class="table align-middle table-row-dashed show-search-dt no-footer dataTable generate-datatable">
                            <thead>
                            <tr class="fw-bold fs-7 text-gray-800">
                                <td></td>
                                <td>Game Title</td>
                                <td>Game Creator</td>
                                <td>Edit</td>
                            </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($games_list as $k => $game) {
                                echo '<tr class="fs-8">'
                                    . '   <td>'
                                    . '      <div class="symbol symbol-25px circle">'
                                    . '         <span class="symbol-15px symbol-label circle avatar-input-holder">'
                                    . '         </span>'
                                    . '      </div>'
                                    . '   </td>'
                                    . '   <td>' . $game['game_title'] . '</td>'
                                    . '   <td>' . $game['user_username'] . '</td>'
                                    . '   <td>'
                                    . '      <button value="' . $k . '"'
                                    . '          data-bs-toggle="modal" data-bs-target="#game_edit-modal"'
                                    . '          class="btn btn-warning ps-3 pe-2 py-1 usernameBtn">'
                                    . '         <i class="fa fa-edit ms-1"></i>'
                                    . '      </button>'
                                    . '   </td>'
                                    . '</tr>';
                            } ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <div class="text-center">
                            <h2>No data available</h2>
                        </div>
                    <?php endif; ?>
                </div>
                <!--end::Body-->
            </div>
            <!--end::List Widget 6-->
        </div>
        <!--end::Col-->
    </div>
    <!--end::Row-->
    <!--begin::User Edit Modal-->
    <div class="modal fade" tabindex="-1" id="game_edit-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Game</h3>
                    <!--begin::Close-->
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal"
                         aria-label="Close">
                        <span class="svg-icon svg-icon-1"></span>
                    </div>
                    <!--end::Close-->
                </div>
                <div class="modal-body">
                    <!--begin::Form-->
                    <form id="edit_user" name="edit_user">
                        <!--begin::Game title-->
                        <div class="mt-5">
                            <label class="form-label" for="fname">Full Name</label>
                            <input id="fname" name="fname" type="text"
                                   class="form-control form-control-solid this-role-form-field"/>
                        </div>
                        <!--end::Game title-->
                        <!--begin::Delete-->
                        <div class="mt-5">
                            <button class="btn btn-danger" id="delete_game" value="">Delete</button>
                        </div>
                        <!--end::Delete-->
                    </form>
                    <!--end::Form-->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                    <button type="button" id="save_user_btn" class="btn btn-primary" tabindex="0">
                        <!--begin::Indicator label-->
                        <span class="indicator-label">Send</span>
                        <!--end::Indicator label-->
                        <!--begin::Indicator progress-->
                        <span class="indicator-progress">
                        Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                        <!--end::Indicator progress-->
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!--end::User Edit Modal-->
    <script> const games = <?=json_encode($games_list ?? []);?>; </script>
    <script src="/assets/js/custom/admin/games.js"></script>
<?php } ?>