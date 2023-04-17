<!--begin::Content Wrapper2-->
<div class="d-flex flex-column-fluid">
    <!--begin::Aside-->
    <div id="kt_aside" class="aside card top-0" data-kt-drawer="true"
         data-kt-drawer-name="aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true"
         data-kt-drawer-width="{default:'200px', '300px': '250px'}" data-kt-drawer-direction="start"
         data-kt-drawer-toggle="#kt_aside_toggle" style="z-index:2000;">
        <div class="aside-menu flex-column-fluid tab-content">
            <!--begin::Aside Menu-->
            <ul class="nav nav-tabs nav-line-tabs pt-2 px-2">
                <li class="nav-item">
                    <a class="nav-link py-2 px-3 active" data-bs-toggle="tab" href="#chat_container">
                        <i class="fa fa-comments f-lg text-this-role-light"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#journal_container">
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
            <div id="chat_container" class="tab-pane fade show active">
                <div class="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
                    <label for="chat" class="form-label mb-3">Chat</label>
                    <textarea id="chat" rows="3"
                              class="form-control form-control-solid this-role-form-field"></textarea>
                </div>
            </div>
            <!--end::Chat-->
            <!--begin::Journal-->
            <div id="journal_container" class="tab-pane fade">
                <div class="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
                    Sheets and notes
                </div>
            </div>
            <!--end::Journal-->
            <!--begin::Gallery list-->
            <div id="gallery_list_container" class="tab-pane fade">
                <div class="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
                    Picatures!!!!!!
                </div>
            </div>
            <!--end::Gallery list-->
            <!--begin::Settings-->
            <div id="settings_container" class="tab-pane fade">
                <div class="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
                    Settingssssssss
                </div>
            </div>
            <!--end::Settings-->
        </div>
    </div>
    <!--end::Aside-->
    <!--begin::Container-->
    <div class="d-flex flex-column flex-column-fluid container-fluid">
        <!--begin::Content-->
        <div class="content flex-column-fluid" id="kt_content">