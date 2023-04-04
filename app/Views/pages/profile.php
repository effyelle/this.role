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
                <!--begin::Col-->
                <form id="user-profile" action="/account/change_profile" method="post"
                      class="d-flex flex-column justify-content-center gap-6 mx-auto">
                    <button id="userBtn" value="" class="d-none"></button>
                    <!--begin::Row-->
                    <div class="d-flex flex-row flex-wrap justify-content-between align-items-center gap-12">
                        <!--begin::Avatar-->
                        <div class="mb-5 w-200px avatar-container">
                            <div class="d-flex flex-column gap-6 align-items-center">
                                <div class="symbol symbol-125px symbol-xl-175px circle position-relative">
                                    <input id="avatar" name="avatar" type="file" accept="image/*" class="d-none">
                                    <span id="avatar-input-holder" class="symbol-label circle"></span>
                                </div>
                                <div class="d-flex flex-row flex-wrap gap-4 profile_editable d-none">
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
                        <!--begin::Full Name-->
                        <div class="mb-5 w-200px">
                            <label for="fname" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">
                                Full Name
                            </label>
                            <input id="fname" name="fname" type="text" disabled
                                   class="form-control form-control-solid bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Full Name-->
                        <!--begin::Username-->
                        <div class="mb-5 w-200px">
                            <label for="username" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">
                                Username
                            </label>
                            <input id="username" name="username" type="text" disabled
                                   class="form-control form-control-solid bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Username-->
                        <!--begin::Email-->
                        <div class="mb-5 w-200px">
                            <label for="email"
                                   class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Email</label>
                            <input id="email" name="email" type="email" disabled
                                   class="form-control form-control-solid bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Email-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <div class="d-flex flex-row flex-wrap justify-content-between align-items-center">
                        <button type="button" id="editProfile" class="btn btn-sm btn-warning align-self-start">Edit Profile</button>
                        <button id="resetPwdBtn" class="btn btn-sm btn-secondary align-self-center">Reset password</button>
                        <button type="button" id="deactivateProfile" class="btn btn-sm btn-dark align-self-end">Delete Profile</button>
                        <button type="submit" id="updateProfile" class="d-none"></button>
                    </div>
                    <!--end::Row-->
                </form>
                <!--end::Col-->
            </div>
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->
<script type="text/javascript" src="/assets/js/custom/account/profile.js"><script>