<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <form action="/app/myprofile" method="post" enctype="multipart/form-data" autocomplete="off"
              class="card h-100vh" id="update-profile">
            <!--begin::Header-->
            <div class="card-header align-content-center">
                <div class="mx-auto w-100 w-xxl-800px">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-5">
                            <h2>My Profile</h2>
                        </div>
                        <div class="card-toolbar gap-5">
                            <button type="submit" id="updateProfile"
                                    class="btn btn-sm btn-primary align-self-end d-none">
                                Save
                            </button>
                            <button type="button" id="editProfile" class="btn btn-sm btn-warning align-self-start">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="mx-auto w-100 w-xxl-800px card-body">
                <!--begin::Col-->
                <div id="user-profile" class="">
                    <div class="d-flex flex-column justify-content-center align-items-center align-content-center gap-6 mx-auto editable">
                        <button id="userBtn" value="" class="d-none"></button>
                        <!--begin::Row-->
                        <div class="text-info fs-6 text-center mb-5">
                            <?php
                            if (
                                !isset($_SESSION['user']['user_confirmed'])
                                || !isset($_SESSION['user']['user_fname'])
                                || $_SESSION['user']['user_avatar'] === '/assets/media/avatars/blank.png'
                            ) {
                                echo 'Complete your profile to enjoy all services in our web! 💡';
                            }
                            ?>
                        </div>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <div class="d-flex flex-row-wrap justify-content-center align-items-center gap-20">
                            <!--begin::User Data-->
                            <div class="d-flex flex-column">
                                <!--begin::Username-->
                                <div class="mb-3 w-300px text-center">
                                    <label for="username" class="form-label mt-2 bg-brush ff-poiret fs-2 mx-auto">
                                        Username
                                    </label>
                                    <input id="username" name="username" type="text" disabled
                                           value="<?= $_SESSION['user']['user_username'] ?? '' ?>"
                                           class="form-control bg-transparent this-role-form-field"/>
                                </div>
                                <!--end::Username-->
                                <!--begin::Full Name-->
                                <div class="mb-3 w-300px text-center">
                                    <label for="fname" class="form-label mt-2 bg-brush">
                                        Full Name
                                    </label>
                                    <input id="fname" name="fname" type="text" disabled
                                           value="<?= $_SESSION['user']['user_fname'] ?? '' ?>"
                                           class="form-control bg-transparent this-role-form-field"/>
                                </div>
                                <!--end::Full Name-->
                                <!--begin::Email-->
                                <div class="mb-3 w-300px text-center">
                                    <label for="email" class="form-label mt-2 bg-brush">
                                        Email
                                    </label>
                                    <input id="email" name="email" type="email" disabled required
                                           value="<?= $_SESSION['user']['user_email'] ?? '' ?>"
                                           class="form-control bg-transparent this-role-form-field"/>
                                    <div class="text-danger fs-7 d-none emailchange">If you change your email, you will
                                        be logged out.
                                    </div>
                                    <?php
                                    if (!isset($_SESSION['user']['user_confirmed'])) {
                                        echo '<div class="text-danger fs-7 required">This email has not been confirmed yet</div>'
                                            . '<a href="#" class="btn btn-warning py-1 px-3">Resend code</a>';
                                    }
                                    ?>
                                </div>
                                <!--end::Email-->
                            </div>
                            <!--end::User Data-->
                            <!--begin::Avatar-->
                            <div class="avatar-container">
                                <div class="d-flex flex-column gap-6 align-items-center">
                                    <div class="symbol symbol-175px symbol-xl-200px circle position-relative">
                                        <input id="avatar" name="avatar" type="file"
                                               class="d-none this-role-form-field"/>
                                        <span id="avatar-input-holder" class="symbol-label circle"
                                              style="background: url('<?= $_SESSION['user']['user_avatar'] ?? '' ?>'); background-size: cover;">
                                            </span>
                                    </div>
                                    <div class="d-flex flex-row flex-wrap gap-4 editable-item">
                                        <label for="avatar" class="btn p-1 text-hover-primary fs-7">
                                            Change
                                        </label>
                                        <button id="delAvatar" type="button" class="btn p-1 text-hover-danger fs-7">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <!--end::Avatar-->
                        </div>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <div class="d-flex flex-row-wrap justify-content-start align-content-start align-items-start gap-20 mt-2">
                            <button type="button" id="resetPwdBtn" class="btn btn-sm btn-secondary align-self-center"
                                    data-bs-toggle="modal" data-bs-target="#modal_confirmation">
                                Reset password
                            </button>
                            <button type="button" id="deactivateProfile" class="btn btn-sm btn-dark align-self-end"
                                    data-bs-toggle="modal" data-bs-target="#modal_confirmation">
                                Delete Profile
                            </button>
                        </div>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <div class="d-flex flex-row-wrap justify-content-around align-items-center gap-6 mt-2">
                            <p class="text-center text-danger fs-6 my-5 fw-bold reset-pwd"></p>
                        </div>
                        <!--end::Row-->
                    </div>
                </div>
                <!--end::Col-->
            </div>
            <!--end::Body-->
        </form>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->
<script src="/assets/js/custom/account/profile.js"></script>