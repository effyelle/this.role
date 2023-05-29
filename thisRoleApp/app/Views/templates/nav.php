<!--begin::Navigation Pane-->
<nav id="kt_header" class="header">
    <div class="container-fluid d-flex flex-stack position-relative">
        <!--begin::Brand-->
        <div class="d-flex align-items-center me-5">
            <!--begin::Aside small screen toggle-->
            <div class="d-lg-none btn btn-icon btn-active-color-white w-30px h-30px ms-n2 me-3"
                 id="kt_aside_toggle">
                <!--begin::Svg Icon | path: icons/duotune/abstract/abs015.svg-->
                <span class="svg-icon svg-icon-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path fill="black"
                              d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z">
                        </path>
						<path opacity="0.3" fill="black"
                              d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z">
                        </path>
					</svg>
				</span>
                <!--end::Svg Icon-->
            </div>
            <!--end::Aside small screen toggle-->
            <!--begin::Logo-->
            <a href="<?= base_url() ?>" class="d-flex align-items-center">
                <img class="w-40px w-lg-55px" src="/assets/media/logos/icon64x64.png" alt=""/>
                <div class="ms-5">
                    <div class="ff-poiret fs-4 fw-bolder text-white d-flex flex-column">
                        <span>THIS.</span>
                        <span class="ms-6">ROLE</span>
                    </div>
                </div>
            </a>
            <!--end::Logo-->
        </div>
        <!--end::Brand-->
        <!--begin::Topbar-->
        <div class="d-flex flex-row flex-nowrap gap-4 align-items-center d-none">
            <label for="searchRule" class="d-none col-1">
                <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
            </label>
            <input id="searchRule" class="form-control form-control-solid bg-secondary border-0" type="text"
                   placeholder="Search...">
        </div>
        <div class="d-flex align-items-center flex-shrink-0">
            <!--begin::User-->
            <div class="d-flex align-items-center ms-1" id="kt_header_user_menu_toggle">
                <!--begin::User info-->
                <div class="btn btn-flex align-items-center bg-hover-white bg-hover-opacity-10 py-2 px-2 px-md-3"
                     data-kt-menu-trigger="click" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                    <!--begin::Name-->
                    <div class="d-none d-md-flex flex-column align-items-end justify-content-center me-2 me-md-4">
                        <span class="text-muted fs-7 fw-bold lh-1 mb-1 nav_fname"><?= $_SESSION['user']['user_username'] ?? ''; ?></span>
                        <span class="text-white fs-8 fw-bolder lh-1">
                            <?php
                            if (isset($_SESSION['user']['user_rol']) && $_SESSION['user']['user_rol'] !== 'user') echo $_SESSION['user']['user_rol'];
                            ?>
                        </span>
                    </div>
                    <!--end::Name-->
                    <!--begin::Symbol-->
                    <div class="symbol symbol-30px symbol-md-40px">
                        <span class="symbol-label circle avatar-input-holder"
                              style="background: url(<?= $_SESSION['user']['user_avatar'] ?? '' ?>); background-size: cover;">
                        </span>
                    </div>
                    <!--end::Symbol-->
                </div>
                <!--end::User info-->
                <!--begin::User account menu-->
                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-300px"
                     data-kt-menu="true">
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                        <div class="menu-content d-flex align-items-center px-3">
                            <!--begin::Avatar-->
                            <div class="symbol symbol-50px me-5">
                                <span class="symbol-label circle avatar-input-holder"
                                      style="background: url(<?= $_SESSION['user']['user_avatar'] ?? '' ?>); background-size: cover;">
                                </span>
                            </div>
                            <!--end::Avatar-->
                            <!--begin::Username-->
                            <div class="d-flex flex-column">
                                <div class="fw-bolder d-flex align-items-center fs-5 nav_fname"><?= $_SESSION['user']['user_username'] ?? ''; ?></div>
                                <span class="fw-bold text-muted fs-7 nav_email"><?= $_SESSION['user']['user_email'] ?? '' ?></span>
                            </div>
                            <!--end::Username-->
                        </div>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu separator-->
                    <div class="separator my-2"></div>
                    <!--end::Menu separator-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-5">
                        <a href="<?= base_url() ?>app/myprofile" class="menu-link px-5">My Profile</a>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-5">
                        <a href="<?= base_url() ?>app/myissues" class="menu-link px-5">My Issues</a>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Separator-->
                    <div class="menu-item">
                        <div class="menu-content py-3 px-0">
                            <div class="separator mx-1"></div>
                        </div>
                    </div>
                    <!--end::Separator-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-5">
                        <a href="<?= base_url() ?>app/logout" class="menu-link px-5">Logout</a>
                    </div>
                    <!--end::Menu item-->
                </div>
                <!--end::User account menu-->
            </div>
            <!--end::User -->
        </div>
        <!--end::Topbar-->
    </div>
</nav>
<!--end::Navigation Pane-->