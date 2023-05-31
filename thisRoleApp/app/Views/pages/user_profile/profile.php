<form action="<?= base_url(); ?>app/myprofile" method="post" enctype="multipart/form-data" autocomplete="off" id="myprofile"
      class="tab-pane fade <?= isset($tab) && $tab === 'myprofile' ? ' show active' : "" ?>">
    <!--begin::Header-->
    <div class="card-header align-content-center border-0">
        <div class="d-flex flex-row-wrap justify-content-end align-items-stretch align-content-center w-100">
            <div class="card-toolbar gap-5">
                <button type="submit" id="updateProfile"
                        class="btn btn-sm btn-primary align-self-end d-none">
                    Save
                </button>
                <button type="button" id="editProfile" class="btn btn-sm btn-danger align-self-start">
                    Edit Profile
                </button>
            </div>
        </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="mx-auto card-body w-100">
        <!--begin::Col-->
        <div id="user-profile" class="">
            <div class="d-flex flex-column justify-content-center align-items-center align-content-center gap-6 mx-auto editable">
                <!--begin::Row-->
                <div class="text-info fs-6 text-center">
                    <?php
                    if (!(//isset($_SESSION['user']['user_confirmed']) &&
                        isset($_SESSION['user']['user_username']) && $_SESSION['user']['user_username'] !== '' &&
                        isset($_SESSION['user']['user_fname']) && $_SESSION['user']['user_email'] !== '' &&
                        $_SESSION['user']['user_avatar'] !== '/assets/media/avatars/blank.png')
                    ) {
                        echo 'Your profile is not complete! 💡';
                    }
                    ?>
                </div>
                <!--end::Row-->
                <!--begin::Row-->
                <div class="text-danger fs-6 text-center"><?= $error ?? '' ?></div>
                <!--end::Row-->
                <!--begin::Row-->
                <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-md-around align-items-center w-100">
                    <!--begin::User Data-->
                    <div class="d-flex flex-column align-items-center col-5">
                        <!--begin::Username-->
                        <div class="mb-3 w-200px w-sm-300px text-center">
                            <label for="username" class="form-label mt-2 bg-brush ff-poiret fs-2 mx-auto">
                                Username
                            </label>
                            <input id="username" name="username" type="text" disabled
                                   value="<?= $_SESSION['user']['user_username'] ?? '' ?>"
                                   class="form-control bg-transparent this-role-form-field"/>
                        </div>
                        <!--end::Username-->
                        <!--begin::Full Name-->
                        <div class="mb-3 w-200px w-sm-300px text-center">
                            <label for="fname" class="form-label fs-2 mt-2 bg-brush">
                                Full Name
                            </label>
                            <input id="fname" name="fname" type="text" disabled
                                   value="<?= $_SESSION['user']['user_fname'] ?? '' ?>"
                                   class="form-control bg-transparent this-role-form-field"/>
                        </div>
                        <!--end::Full Name-->
                        <!--begin::Email-->
                        <div class="mb-3 w-200px w-sm-300px text-center">
                            <label for="email" class="form-label fs-2 mt-2 bg-brush">
                                Email
                            </label>
                            <input id="email" name="email" type="email" disabled required
                                   value="<?= $_SESSION['user']['user_email'] ?? '' ?>"
                                   class="form-control bg-transparent this-role-form-field"/>
                            <?php
                            if (!isset($_SESSION['user']['user_confirmed'])) {
                                /*echo '<div class="text-danger fs-7 required">This email has not been confirmed yet</div>' .
                                    '<button type="button" id="resend-conf_email" class="btn btn-warning py-1 px-3"' .
                                    '    data-bs-toggle="modal" data-bs-target="#modal_confirmation">' .
                                    '      Resend code' .
                                    '</button>';*/
                            }
                            ?>
                        </div>
                        <!--end::Email-->
                    </div>
                    <!--end::User Data-->
                    <!--begin::Row-->
                    <div class="d-flex flex-column align-items-center col-5">
                        <!--begin::Avatar-->
                        <div class="avatar-container">
                            <div class="d-flex flex-column gap-6 align-items-center">
                                <div class="symbol symbol-175px symbol-xl-200px circle position-relative">
                                    <input id="avatar" name="avatar" type="file"
                                           class="d-none this-role-form-field"/>
                                    <span class="symbol-label circle avatar-input-holder" id="avatar_profile_holder"
                                          style="background: url(<?= $_SESSION['user']['user_avatar'] ?? '' ?>); background-size: cover;">
                                        </span>
                                </div>
                                <div class="d-flex flex-row flex-wrap gap-4 editable-item mt-5">
                                    <label for="avatar" class="btn btn-sm btn-link fs-7">
                                        Change
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!--end::Avatar-->
                        <!--end::Buttons-->
                        <div class="d-flex flex-column justify-content-center align-items-center gap-5 mt-2 w-100">
                            <button type="button" id="" class="btn btn-sm btn-secondary"
                                    data-bs-toggle="modal" data-bs-target="#modal_resetpwd">
                                Reset password
                            </button>
                            <button type="button" id="deactivateProfile" class="btn btn-sm btn-dark"
                                    data-bs-toggle="modal" data-bs-target="#modal_confirmation">
                                Delete Profile
                            </button>
                        </div>
                        <!--end::Buttons-->
                    </div>
                    <!--end::Row-->
                </div>
                <!--end::Row-->
                <!--begin::Row-->
                <div class="d-flex flex-row-wrap justify-content-around align-items-center gap-6 mt-2">
                    <p class="text-center text-danger fs-6 my-5 fw-bold reset-pwd"></p>
                </div>
                <!--end::Row-->
                <button id="userBtn" value="" class="d-none"></button>
            </div>
        </div>
        <!--end::Col-->
    </div>
    <!--end::Body-->
</form>

<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_resetpwd">
    <div class="modal-dialog">
        <!--begin::Form-->
        <div class="modal-content">
            <!--begin::Header-->
            <div class="modal-header">
                <h3 class="modal-title">Reset password</h3>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="modal-body py-6 mx-auto">
                <form autocomplete="off" id="resetpwd-form" class="m-auto my-4 text-center">
                    <div class="text-center text-danger mb-6" id="error">
                        <?= $error ?? '' ?>
                    </div>
                    <!--begin::Row-->
                    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
                        <!--begin::Form Field-->
                        <div class="my-4 position-relative">
                            <label for="pwd" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">
                                Password
                            </label>
                            <input type="password" id="pwd" name="pwd" required
                                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Form Field-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
                        <!--begin::Form Field-->
                        <div class="my-4 position-relative">
                            <label for="pwd-repeat" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">
                                Repeat Password
                            </label>
                            <input type="password" id="pwd-repeat" required
                                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Form Field-->
                    </div>
                    <!--end::Row-->
                </form>
            </div>
            <!--end::Body-->
            <!--begin::Footer-->
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="resetPwdBtn" class="btn btn-primary">
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
            <!--end::Footer-->
        </div>
        <!--end::Form-->
    </div>
</div>
<!--end::Modal-->
<!--end::List Widget 6-->
<script src="/assets/js/custom/account/profile.js"></script>