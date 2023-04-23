<!--begin::Content Wrapper2-->
<div class="d-flex flex-column-fluid">
    <!--begin::Aside-->
    <div id="kt_aside" class="aside card top-0" data-kt-drawer="true"
         data-kt-drawer-name="aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true"
         data-kt-drawer-width="{default:'250px', '350px': '350px'}" data-kt-drawer-direction="start"
         data-kt-drawer-toggle="#kt_aside_toggle" style="z-index:2000;">
        <div class="aside-menu flex-column-fluid tab-content">
            <!--begin::Aside Menu-->
            <ul class="nav nav-tabs nav-line-tabs pt-2 px-2 justify-content-evenly">
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
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#tools_list">
                        <i class="fa fa-tools text-this-role-light"></i>
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
                <div class="aside-footer d-flex flex-column py-3 px-5 chat-container mb-3 overflow-y-scroll">
                    <div class="chat-messages"></div>
                    <div class="d-flex flex-column justify-content-center">
                        <div class="chat-bubble">
                            <label for="chat" class="form-label mb-3">Chat</label>
                            <textarea id="chat" rows="3"
                                      class="form-control form-control-solid this-role-form-field"></textarea>
                        </div>
                        <div class="d-flex flex-row justify-content-between align-items-center mt-5">
                            <div class="select-charsheets">
                                <label for="charsheet_selected" class="form-label d-none">You're writing as...</label>
                                <select id="charsheet_selected"
                                        class="form-control form-select form-control-solid this-role-form-field">
                                    <option disabled selected
                                            value="-1"><?= $_SESSION['user']['user_username'] ?></option>
                                    <option value="0">Sabrina</option>
                                    <option value="1">Salem</option>
                                </select>
                            </div>
                            <button class="btn btn-garnet text-white px-3 py-2">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--end::Chat-->

            <!--begin::Journal-->
            <div id="journal" class="tab-pane fade show active"></div>
            <!--end::Journal-->

            <!--begin::Tools-->
            <div id="tools_list" class="tab-pane fade">
                <div class="aside-footer d-flex flex-column py-3 px-5">
                    <div data-kt-menu="true" id="menu_gallery"
                         class="menu menu-column menu-rounded fw-bold fs-7 gap-2 mt-3">
                        <!--begin::Menu Item-->
                        <div class="menu-item">
                            <span class="fs-5 text-dark">Welcome to out tools!</span>
                        </div>
                        <!--end::Menu Item-->
                    </div>
                </div>
            </div>
            <!--end::Tools-->

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