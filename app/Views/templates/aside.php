<!--begin::Content Wrapper2-->
<div class="d-flex flex-column-fluid">
    <!--begin::Aside-->
    <div id="kt_aside" class="aside card" data-kt-drawer="true"
         data-kt-drawer-name="aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true"
         data-kt-drawer-width="{default:'200px', '300px': '250px'}" data-kt-drawer-direction="start"
         data-kt-drawer-toggle="#kt_aside_toggle" style="width: 250px !important;">
        <!--begin::Aside menu-->
        <div class="aside-menu flex-column-fluid px-5">
            <!--begin::Aside Menu-->
            <div class="hover-scroll-overlay-y my-5 pe-4 me-n4" id="kt_aside_menu_wrapper" data-kt-scroll="true"
                 data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-height="auto"
                 data-kt-scroll-dependencies="#kt_header, #kt_aside_footer"
                 data-kt-scroll-wrappers="#kt_aside, #kt_aside_menu" data-kt-scroll-offset="{lg: '75px'}" style="">
                <!--begin::Menu-->
                <div class="menu menu-column menu-rounded fw-bold fs-5 gap-6 mt-6" id="#kt_aside_menu"
                     data-kt-menu="true">
                    <!--begin::Menu Item-->
                    <div class="menu-item">
                        <a class="menu-link <?php if ($title === 'Home') echo 'hover'; ?>" href="/app/index" title=""
                           data-bs-toggle="tooltip" data-bs-trigger="hover"
                           data-bs-dismiss="click" data-bs-placement="right"
                           data-bs-original-title="Welcome to This.Role!">
                            <span class="menu-icon">
                                <i class="fa fa-solid fa-house fa-lg hover-flip"></i>
                            </span>
                            <span class="menu-title">Home</span>
                        </a>
                    </div>
                    <!--end::Menu Item-->
                    <!--begin::Menu Item-->
                    <div class="menu-item">
                        <a class="menu-link <?php if ($title === 'Games') echo 'hover'; ?>" href="/app/games_list"
                           data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click"
                           data-bs-placement="right" data-bs-original-title="Manage your games" title="">
                            <span class="menu-icon">
                                <i class="fa fa-solid fa-dice-d20 fa-lg hover-flip"></i>
                            </span>
                            <span class="menu-title">Your Games</span>
                        </a>
                    </div>
                    <!--end::Menu Item-->
                    <!--begin::Menu Item-->
                    <!--
                    <div class="menu-item">
                        <a class="menu-link <?php if ($title === 'Patch') echo 'hover'; ?>"
                           href="/patch/notes"
                           title="" data-bs-toggle="tooltip" data-bs-trigger="hover"
                           data-bs-dismiss="click" data-bs-placement="right"
                           data-bs-original-title="Search freely in the API">
                            <span class="menu-icon">
                                <i class="fa fa-solid fa-dragon fa-lg hover-flip"></i>
                            </span>
                            <span class="menu-title">Patch Notes</span>
                        </a>
                    </div>
                    -->
                    <!--end::Menu Item-->
                    <!--begin::Menu Item-->
                    <div class="menu-item">
                        <a class="menu-link <?php if ($title === 'About') echo 'hover'; ?>" href="/app/about" title=""
                           data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click"
                           data-bs-placement="right" data-bs-original-title="How did we started this?">
                            <span class="menu-icon">
                                <i class="fa fa-solid fa-mug-hot fa-lg hover-flip"></i>
                            </span>
                            <span class="menu-title">About This.Role</span>
                        </a>
                    </div>
                    <!--end::Menu Item-->
                    <!--begin::Menu Accordion-->
                    <div class="menu-item">
                        <div class="menu-content p-0">
                            <div class="separator mx-1"></div>
                        </div>
                    </div>
                    <!--end::Menu Accordion-->
                    <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                        <!--begin:Menu link-->
                        <span class="menu-link">
							<span class="menu-icon">
                                <i class="fa fa-solid fa-gear fa-lg hover-flip"></i>
							</span>
							<span class="menu-title">Settings</span>
							<span class="menu-arrow"></span>
						</span>
                        <!--end:Menu link-->
                        <!--begin:Menu sub-->
                        <div class="menu-sub menu-sub-accordion">
                            <!--begin:Menu item-->
                            <div class="menu-item">
                                <!--begin:Menu link-->
                                <a class="menu-link" href="/app/admin_users">
										<span class="menu-bullet">
                                            <i class="fa fa-solid fa-user"></i>
										</span>
                                    <span class="menu-title">Users</span>
                                </a>
                                <!--end:Menu link-->
                            </div>
                            <!--end:Menu item-->
                            <!--begin:Menu item-->
                            <div class="menu-item">
                                <!--begin:Menu link-->
                                <a class="menu-link" href="/app/admin_games">
										<span class="menu-bullet">
                                            <i class="fa fa-solid fa-dice-d20"></i>
										</span>
                                    <span class="menu-title">Games</span>
                                </a>
                                <!--end:Menu link-->
                            </div>
                            <!--end:Menu item-->
                            <!--begin:Menu item-->
                            <div class="menu-item">
                                <a class="menu-link" href="/app/admin_patch_notes">
										<span class="menu-bullet">
                                            <i class="fa fa-solid fa-dragon"></i>
										</span>
                                    <span class="menu-title">Patch Notes</span>
                                </a>
                            </div>
                            <!--end:Menu item-->
                        </div>
                        <!--end:Menu sub-->
                    </div>
                    <div class="menu-item">
                        <div class="menu-content p-0">
                            <div class="separator mx-1"></div>
                        </div>
                    </div>
                </div>
                <!--end::Menu-->
            </div>
        </div>
        <!--end::Aside menu-->
        <div class="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
            <a data-bs-toggle="modal" data-bs-target="#contact-support"
               class="btn btn-bg-light btn-color-gray-500 btn-active-color-gray-900 w-100">
                <span class="btn-label">Contact Support</span>
                <span class="svg-icon btn-icon svg-icon-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor"
                              d="M6 8.725C6 8.125 6.4 7.725 7 7.725H14L18 11.725V12.925L22 9.725L12.6 2.225C12.2 1.925 11.7 1.925 11.4 2.225L2 9.725L6 12.925V8.725Z">
                        </path>
                        <path opacity="0.3" fill="currentColor"
                              d="M22 9.72498V20.725C22 21.325 21.6 21.725 21 21.725H3C2.4 21.725 2 21.325 2 20.725V9.72498L11.4 17.225C11.8 17.525 12.3 17.525 12.6 17.225L22 9.72498ZM15 11.725H18L14 7.72498V10.725C14 11.325 14.4 11.725 15 11.725Z">
                        </path>
                    </svg>
			    </span>
            </a>
        </div>
    </div>
    <!--end::Aside-->
    <!--begin::Container-->
    <div class="d-flex flex-column flex-column-fluid container-fluid">
        <!--begin::Content-->
        <div class="content flex-column-fluid" id="kt_content">