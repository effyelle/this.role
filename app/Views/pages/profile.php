<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header align-content-center">
                <div class="mx-auto w-100 w-xxl-800px">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-5">
                            <h2><?= $title ?></h2>
                        </div>
                        <div class="card-toolbar gap-5">
                            <button type="submit" id="updateProfile" class="btn btn-sm btn-primary align-self-end d-none">
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
            <div class="mx-auto w-100 w-xxl-800px">
                <div class="card-body">
                    <!--begin::Col-->
                    <form id="user-profile" action="/account/change_profile" method="post"
                          class="d-flex flex-column justify-content-center gap-6 mx-auto editable">
                        <button id="userBtn" value="" class="d-none"></button>
                        <!--begin::Row-->
                        <div class="d-flex flex-row-wrap justify-content-around align-items-center gap-12 w-100">
                            <!--begin::Avatar-->
                            <div class="mb-15 w-200px avatar-container">
                                <div class="d-flex flex-column gap-6 align-items-center">
                                    <div class="symbol symbol-125px symbol-xl-175px circle position-relative">
                                        <input id="avatar" name="avatar" type="file" accept="image/*" class="d-none">
                                        <span id="avatar-input-holder" class="symbol-label circle"></span>
                                    </div>
                                    <div class="d-flex flex-row flex-wrap gap-4 editable-item d-none">
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
                            <div class="d-flex flex-column">
                                <!--begin::Full Name-->
                                <div class="mb-3w-200px">
                                    <label for="fname" class="ff-poiret account-option bg-brush h2 z-index-3 mt-2">
                                        Full Name
                                    </label>
                                    <input id="fname" name="fname" type="text" disabled
                                           class="form-control bg-transparent text-center this-role-form-field"/>
                                </div>
                                <!--end::Full Name-->
                                <!--begin::Username-->
                                <div class="mb-3w-200px">
                                    <label for="username" class="ff-poiret account-option bg-brush h2 z-index-3 mt-2">
                                        Username
                                    </label>
                                    <input id="username" name="username" type="text" disabled
                                           class="form-control bg-transparent text-center this-role-form-field"/>
                                </div>
                                <!--end::Username-->
                                <!--begin::Email-->
                                <div class="mb-3w-200px">
                                    <label for="email"
                                           class="ff-poiret account-option bg-brush h2 z-index-3 mt-2">Email</label>
                                    <input id="email" name="email" type="email" disabled
                                           class="form-control bg-transparent text-center this-role-form-field"/>
                                </div>
                                <!--end::Email-->
                            </div>
                        </div>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <div class="d-flex flex-row-wrap justify-content-around align-items-center gap-6 mt-2 w-100">
                            <button type="button" id="resetPwdBtn" class="btn btn-sm btn-secondary align-self-center">
                                Reset password
                            </button>
                            <button type="button" id="deactivateProfile" class="btn btn-sm btn-dark align-self-end">
                                Delete Profile
                            </button>
                        </div>
                        <!--end::Row-->
                    </form>
                    <!--end::Col-->
                </div>
            </div>
            <!--end::Body-->
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->
<script type="text/javascript" src="/assets/js/custom/account/profile.js"><script>