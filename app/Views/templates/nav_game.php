<!--begin::Content Wrapper2-->
<div class="d-flex flex-column-fluid">
    <!--begin::Aside-->
    <div id="kt_aside" class="aside card top-0" data-kt-drawer="true"
         data-kt-drawer-name="aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true"
         data-kt-drawer-width="{default:'250px', '350px': '350px'}" data-kt-drawer-direction="start"
         data-kt-drawer-toggle="#kt_aside_toggle">
        <div class="aside-menu flex-column-fluid tab-content">
            <!--begin::Aside Menu-->
            <ul class="nav nav-tabs nav-line-tabs pt-2 px-2 justify-content-evenly">
                <li class="nav-item">
                    <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#chat_container">
                        <i class="fa fa-comments f-lg text-this-role-light"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link py-2 px-3 active" data-bs-toggle="tab" href="#journal">
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
                    <div class="chat-messages">
                        <!--Chat messages go here-->
                    </div>
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
                                    <option selected value="-1"><?= $_SESSION['user']['user_username'] ?></option>
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
            <div id="journal" class="tab-pane fade active show"></div>
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
            <!--begin::Navigation Pane-->
            <nav class="game-header">
                <!--begin::Aside small screen toggle-->
                <div class="d-lg-none btn btn-icon btn-active-color-dark w-50px h-50px w-md-100px h-md-100px ms-2"
                     id="kt_aside_toggle">
                    <!--begin::Svg Icon | path: icons/duotune/abstract/abs015.svg-->
                    <span class="svg-icon svg-icon-0">
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
                <div class="dices-container">
                    <div class="dices-flex-content text-center">
                        <!--begin::Dice d4-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d4" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d4" class="d-none d-md-block">d4</label>
                            </div>
                            <button class="btn dice border-0 shadow d4" value="d4"></button>
                        </div>
                        <!--end::Dice d4-->
                        <!--begin::Dice d6-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d6" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d6" class="d-none d-md-block">d6</label>
                            </div>
                            <button class="btn dice border-0 shadow d6" value="d6"></button>
                        </div>
                        <!--end::Dice d6-->
                        <!--begin::Dice d8-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d8" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d8" class="d-none d-md-block">d8</label>
                            </div>
                            <button class="btn dice border-0 shadow d8" value="d8"></button>
                        </div>
                        <!--end::Dice d8-->
                        <!--begin::Dice d10-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d10" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d10" class="d-none d-md-block">d10</label>
                            </div>
                            <button class="btn dice border-0 shadow d10" value="d10"></button>
                        </div>
                        <!--end::Dice d10-->
                        <!--begin::Dice d12-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d12" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d12" class="d-none d-md-block">d12</label>
                            </div>
                            <button class="btn dice border-0 shadow d12" value="d12"></button>
                        </div>
                        <!--end::Dice d12-->
                        <!--begin::Dice d20-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d20" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d20" class="d-none d-md-block">d20</label>
                            </div>
                            <button class="btn dice border-0 shadow d20" value="d20"></button>
                        </div>
                        <!--end::Dice d20-->
                        <!--begin::Dice d100-->
                        <div class="dice-roll">
                            <div class="roll">
                                <input id="roll-d100" value="1"
                                       class="form-control form-control-solid this-role-form-field p-0"/>
                                <label for="roll-d100" class="d-none d-md-block">d100</label>
                            </div>
                            <button class="btn dice border-0 shadow d100" value="d100"></button>
                        </div>
                        <!--end::Dice d100-->
                    </div>
                </div>
            </nav>
            <!--end::Navigation Pane-->