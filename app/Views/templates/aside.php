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
                           data-bs-original-title="">
                            <span class="menu-icon">
                                <i class="fa fa-solid fa-house fa-lg hover-flip"></i>
                            </span>
                            <span class="menu-title">Home</span>
                        </a>
                    </div>
                    <!--end::Menu Item-->
                    <!--begin::Menu Item-->
                    <div class="menu-item">
                        <a class="menu-link <?php if ($title === 'Games') echo 'hover'; ?>" href="/games/list" title=""
                           data-bs-toggle="tooltip" data-bs-trigger="hover"
                           data-bs-dismiss="click" data-bs-placement="right"
                           data-bs-original-title="Manage your games">
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
                        <a class="menu-link <?php if ($title === 'Compendium') echo 'hover'; ?>"
                           href="/compendium/index"
                           title="" data-bs-toggle="tooltip" data-bs-trigger="hover"
                           data-bs-dismiss="click" data-bs-placement="right"
                           data-bs-original-title="Search freely in the API">
                            <span class="menu-icon">
                                <i class="fa fa-solid fa-dragon fa-lg hover-flip"></i>
                            </span>
                            <span class="menu-title">Compendium</span>
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
                                <a class="menu-link" href="/admin/users">
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
                                <a class="menu-link" href="/admin/games">
										<span class="menu-bullet">
                                            <i class="fa fa-solid fa-dice-d20"></i>
										</span>
                                    <span class="menu-title">Games</span>
                                </a>
                                <!--end:Menu link-->
                            </div>
                            <!--end:Menu item-->
                            <!--begin:Menu item-->
                            <!--
                            <div class="menu-item">
                                <a class="menu-link" href="/admin/compendium">
										<span class="menu-bullet">
											<span class="bullet bullet-dot"></span>
										</span>
                                    <span class="menu-title">Compendium</span>
                                </a>
                            </div>
                            -->
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
        <!--begin::Footer-->

        <div class="aside-footer flex-column-auto pt-5 pb-7 px-5" id="kt_aside_footer">
            <a data-bs-toggle="modal" data-bs-target="#modal_suggestions"
               class="btn btn-bg-light btn-color-gray-500 btn-active-color-gray-900 w-100">
                <span class="btn-label">Buzón de sugerencias</span>
                <span class="svg-icon btn-icon svg-icon-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8.725C6 8.125 6.4 7.725 7 7.725H14L18 11.725V12.925L22 9.725L12.6 2.225C12.2 1.925 11.7 1.925 11.4 2.225L2 9.725L6 12.925V8.725Z"
                              fill="currentColor"></path>
                        <path opacity="0.3"
                              d="M22 9.72498V20.725C22 21.325 21.6 21.725 21 21.725H3C2.4 21.725 2 21.325 2 20.725V9.72498L11.4 17.225C11.8 17.525 12.3 17.525 12.6 17.225L22 9.72498ZM15 11.725H18L14 7.72498V10.725C14 11.325 14.4 11.725 15 11.725Z"
                              fill="currentColor"></path>
                    </svg>
			    </span>
            </a>
        </div>
        <!--end::Footer-->
        <div class="modal fade" tabindex="-1" id="modal_suggestions">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Buzón de sugerencias</h3>

                        <!--begin::Close-->
                        <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                            <span class="svg-icon svg-icon-1"></span>
                        </div>
                        <!--end::Close-->
                    </div>

                    <div class="modal-body">
                        <!-- FORMULARIO PARA ENVIO DE SUGERENCIAS -->
                        <form enctype="multipart/form-data" id="form_suggestions" name="form_suggestions">
                            <div class="form-group">
                                <label>Tipo</label>
                                <select class="form-select form-select-solid" id="type" name="type">
                                    <option value="Sugerencia">Sugerencia 💡</option>
                                    <option value="Queja">Queja 😩</option>
                                    <option value="Felicitación">Felicitación 🍾</option>
                                </select>
                            </div>
                            <div class="form-group mt-5">
                                <label for="name">Comentario</label>
                                <textarea class="form-control form-control-solid" id="comment" name="comment" rows="3"></textarea>
                            </div>
                            <!-- IMAGE INPUT -->
                            <div class="form-group mt-5">
                                <label for="image">Imagen</label>
                                <input class="form-control form-control-solid" multiple type="file" id="image" name="image[]" value="">
                            </div>
                            <div class="form-check form-check-custom form-check-solid mt-5">
                                <input class="form-check-input" name="anonymous" type="checkbox" value="1" id="anonymous"/>
                                <label class="form-check-label" for="anonymous">
                                    Enviar anónimamente
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" onclick="send_suggestion()" id="send_suggestion_btn" class="btn btn-primary">
                            <!--begin::Indicator label-->
                            <span class="indicator-label">Enviar</span>
                            <!--end::Indicator label-->
                            <!--begin::Indicator progress-->
                            <span class="indicator-progress">Por favor espere...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                            <!--end::Indicator progress-->
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--end::Aside-->
    <!--begin::Container-->
    <div class="d-flex flex-column flex-column-fluid container-fluid">
        <!--begin::Content-->
        <div class="content flex-column-fluid" id="kt_content">