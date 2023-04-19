<!--begin::Content Wrapper2-->
<div class="d-flex flex-column-fluid">
    <!--begin::Aside-->
    <div id="kt_aside" class="aside card top-0" data-kt-drawer="true"
         data-kt-drawer-name="aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true"
         data-kt-drawer-width="{default:'250px', '350px': '350px'}" data-kt-drawer-direction="start"
         data-kt-drawer-toggle="#kt_aside_toggle" style="z-index:2000;">
        <div class="aside-menu flex-column-fluid tab-content">
            <!--begin::Aside Menu-->
            <ul class="nav nav-tabs nav-line-tabs pt-2 px-2">
                <li class="nav-item">
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#chat_container">
                        <i class="fa fa-comments f-lg text-this-role-light"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link py-2 px-3 active" data-bs-toggle="tab" href="#journal_container">
                        <i class="fa fa-newspaper text-this-role-light"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#gallery_list_container">
                        <i class="fa fa-images text-this-role-light"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#settings_container">
                        <i class="fa fa-solid fa-gear text-this-role-light"></i>
                    </a>
                </li>
            </ul>
            <!--end::Aside menu-->

            <!--begin::Chat-->
            <div id="chat_container" class="tab-pane fade">
                <div class="aside-footer d-flex flex-column py-3 px-5 chat-container">
                    <div class="chat-messages"></div>
                    <div class="chat-bubble">
                        <label for="chat" class="form-label mb-3">Chat</label>
                        <textarea id="chat" rows="3"
                                  class="form-control form-control-solid this-role-form-field"></textarea>
                    </div>
                </div>
            </div>
            <!--end::Chat-->

            <!--begin::Journal-->
            <div id="journal_container" class="tab-pane fade show active">
                <div class="aside-footer d-flex flex-column py-3 px-5">
                    <div class="menu menu-column menu-rounded fw-bold fs-7 gap-2 mt-3" data-kt-menu="true">
                        <div class="menu-item">
                            <span class="fs-5 text-dark">Welcome to your journal!</span>
                        </div>
                        <!--begin::Menu Item-->
                        <div class="menu-item">
                            <a class="menu-link" data-bs-toggle="modal" data-bs-target="#add_token-modal">
                                <span class="menu-title">Add sheet</span>
                                <span class="menu-icon bg-garnet circle h-25px w-25px p-0">
                                    <i class="fa-solid fa-plus text-white fs-6 d-block"></i>
                                </span>
                            </a>
                        </div>
                        <!--end::Menu Item-->
                        <!--begin::Separator-->
                        <div class="menu-item">
                            <div class="menu-content p-0">
                                <div class="separator mx-1"></div>
                            </div>
                        </div>
                        <!--end::Separator-->
                        <!--begin::Menu Item-->
                        <div class="menu-item">
                            <a class="menu-link" href="#">
                                <!--begin::Symbol-->
                                <div class="me-2 symbol symbol-20px symbol-md-30px">
                                    <span class="symbol-label circle sheet_icon"></span>
                                </div>
                                <!--end::Symbol-->
                                <span class="menu-title">Ficha</span>
                            </a>
                        </div>
                        <!--end::Menu Item-->
                    </div>
                </div>
            </div>
            <!--end::Journal-->

            <!--begin::Gallery list-->
            <div id="gallery_list_container" class="tab-pane fade">
                <div class="aside-footer d-flex flex-column py-3 px-5">
                    <div class="menu menu-column menu-rounded fw-bold fs-7 gap-2 mt-3" data-kt-menu="true">
                        <!--begin::Menu Item-->
                        <div class="menu-item">
                            <span class="fs-5 text-dark">Welcome to your files!</span>
                        </div>
                        <!--end::Menu Item-->
                        <!--begin::Menu Item-->
                        <div class="menu-item">
                            <a class="menu-link" data-bs-toggle="modal" data-bs-target="#add_token-modal">
                                <span class="menu-title">Add image</span>
                                <span class="menu-icon bg-garnet circle h-25px w-25px p-0">
                                    <i class="fa-solid fa-plus text-white fs-6 d-block"></i>
                                </span>
                            </a>
                        </div>
                        <!--end::Menu Item-->
                        <!--begin::Separator-->
                        <div class="menu-item">
                            <div class="menu-content p-0">
                                <div class="separator mx-1"></div>
                            </div>
                        </div>
                        <!--end::Separator-->
                        <!--begin::Menu Item-->
                        <div class="menu-item">
                            <a class="menu-link" href="#">
                                <!--begin::Symbol-->
                                <div class="me-2 symbol symbol-20px symbol-md-30px">
                                    <span class="symbol-label circle sheet_icon"></span>
                                </div>
                                <!--end::Symbol-->
                                <span class="menu-title">Ficha</span>
                            </a>
                        </div>
                        <!--end::Menu Item-->
                    </div>
                </div>
            </div>
            <!--end::Gallery list-->
            <!--begin::Settings-->
            <div id="settings_container" class="tab-pane fade">
                <div class="aside-footer d-flex flex-column py-3 px-5">
                    Settingssssssss
                </div>
            </div>
            <!--end::Settings-->
        </div>
    </div>
    <!--end::Aside-->
    <!--begin::Container-->
    <div class="d-flex flex-column flex-column-fluid container-fluid this-table-margin">
        <!--begin::Content-->
        <div class="content flex-column-fluid" id="kt_content">