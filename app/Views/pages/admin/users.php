<?php if ($_SESSION['user']['user_rol'] !== 'user') { ?>
    <!--begin::Row-->
    <div class="row g-5 g-lg-10">
        <!--begin::Col-->
        <div class="mb-xl-10">
            <!--begin::List Widget 6-->
            <div class="card h-100vh">
                <!--begin::Header-->
                <div class="card-header border-0">
                    <div class="card-toolbar gap-5">
                        <div class="fs-5 fs-lg-3 fw-bolder"><?= $title ?? '' ?></div>
                    </div>
                </div>
                <!--end::Header-->
                <!--begin::Body-->
                <div class="card-body px-xxs-1 mx-sm-12 tab-content">
                    <!--begin::Tabs-->
                    <ul class="nav nav-tabs nav-line-tabs mb-5 fs-xxs-8 fs-6">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#users-table">Users List</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#users-msgs">Messages Support</a>
                        </li>
                    </ul>
                    <!--end::Tabs-->
                    <div id="users-table" class="tab-pane fade show active fs-xxs-8" role="tabpanel">
                        <?php if (isset($users_list) && is_array($users_list) && count($users_list) > 0): ?>
                            <table id="users_list"
                                   class="table dataTable align-middle table-row-dashed generate-datatable show-search-dt no-footer">
                                <thead>
                                <tr class="fw-bold fs-7 text-gray-800">
                                    <td></td>
                                    <td>Username</td>
                                    <td class="d-none d-lg-table-cell">Email</td>
                                    <td class="d-none d-lg-table-cell">User Rol</td>
                                    <td class="d-none d-lg-table-cell">Status</td>
                                    <td>Edit</td>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($users_list as $k => $user) {
                                    $editBtn = '<button value="' . $k . '"'
                                        . '          data-bs-toggle="modal" data-bs-target="#user_edit-modal"'
                                        . '          class="btn btn-primary ps-3 pe-2 py-1 usernameBtn">'
                                        . '         <i class="fa fa-edit"></i>'
                                        . '     </button>';
                                    $canEdit = function ($user) {
                                        // Can edit all if masteradmin or if admin and target is user or self
                                        return $_SESSION['user']['user_rol'] === 'masteradmin' || (
                                                $_SESSION['user']['user_rol'] === 'admin' && (
                                                    $user['user_rol'] === 'user' || $_SESSION['user']['user_id'] === $user['user_id']
                                                )
                                            );
                                    };
                                    echo '<tr class="fs-8">'
                                        . '   <td>'
                                        . '      <div class="symbol symbol-25px circle">'
                                        . '         <span class="symbol-15px symbol-label circle avatar-input-holder"'
                                        . '              style="background: url(' . $user['user_avatar'] . '); background-size: cover;">'
                                        . '         </span>'
                                        . '      </div>'
                                        . '   </td>'
                                        . '   <td>' . $user['user_username'] . '</td>'
                                        . '   <td class="d-none d-lg-table-cell">' . $user['user_email'] . '</td>'
                                        . '   <td class="d-none d-lg-table-cell">' . ucfirst($user['user_rol']) . '</td>'
                                        . '   <td class="d-none d-lg-table-cell">' . ($user['user_deleted'] ? 'Inactive' : 'Active') . '</td>'
                                        . '   <td>' . ($canEdit($user) ? $editBtn : "") . '</td>'
                                        . '</tr>';
                                } ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>
                    <div id="users-msgs" class="tab-pane fade" role="tabpanel">
                        <?php if (isset($issues_list) && is_array($issues_list) && count($issues_list) > 0): ?>
                            <table id="msgs_list"
                                   class="table align-middle table-row-dashed show-search-dt no-footer dataTable generate-datatable">
                                <thead class="d-none">
                                <tr class="fw-bold fs-6 text-gray-800">
                                    <td></td>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($issues_list as $k => $issue) {
                                    echo '<tr>'
                                        . '   <td class="menu-item menu-accordion">'
                                        . '       <div class="text-muted text-hover-info cursor-pointer menu-link open-link">'
                                        . '           <span class="menu-title text-uppercase fs-3">' . $issue['issue_title'] . '</span>'
                                        . '           <span><i>Issue started by </i><b>' . $issue['issue_user'] . '</b></span>'
                                        . '           <span class="menu-arrow">'
                                        . '               <input class="d-none issue_id" value="' . $issue['issue_id'] . '"/>'
                                        . '           </span>'
                                        . '       </div>'
                                        . '       <div class="menu-sub menu-sub-accordion overflow-transition msg-display">'
                                        . '       <div class="msg-content px-6"></div>'
                                        . '           <div class="menu-item msg_textarea pt-5">'
                                        . '               <span class="menu-link">'
                                        . '                   <textarea placeholder="Your answer..." rows="3" style="resize: none"'
                                        . '                       class="form-control form-control-solid this-role-form-field issue_answer menu-title"></textarea>'
                                        . '               </span>'
                                        . '               <button class="btn btn-primary ms-8 send_answer_btn">Send</button>'
                                        . '           </div>'
                                        . '       </div>'
                                        . '   </td>'
                                        . '</tr>';
                                } ?>
                                </tbody>
                            </table>
                        <?php else: ?>
                            <div class="text-center">
                                <h2>No data available</h2>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                <!--end::Body-->
            </div>
            <!--end::List Widget 6-->
        </div>
        <!--end::Col-->
    </div>
    <!--end::Row-->
    <!--begin::User Edit Modal-->
    <div class="modal fade" tabindex="-1" id="user_edit-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit User</h3>
                    <!--begin::Close-->
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal"
                         aria-label="Close">
                        <span class="svg-icon svg-icon-1"></span>
                    </div>
                    <!--end::Close-->
                </div>
                <div class="modal-body">
                    <!--begin::Form-->
                    <form id="edit_user" name="edit_user">
                        <!--begin::Username-->
                        <div class="mt-5">
                            <label class="form-label" for="username">Username</label>
                            <input id="username" name="username" type="text"
                                   class="form-control form-control-solid this-role-form-field"/>
                        </div>
                        <!--end::Username-->
                        <!--begin::Full Name-->
                        <div class="mt-5">
                            <label class="form-label" for="fname">Full Name</label>
                            <input id="fname" name="fname" type="text"
                                   class="form-control form-control-solid this-role-form-field"/>
                        </div>
                        <!--end::Full Name-->
                        <!--begin::Email-->
                        <div class="mt-5">
                            <label class="form-label" for="email">Email</label>
                            <input id="email" name="email" type="text"
                                   class="form-control form-control-solid this-role-form-field"/>
                        </div>
                        <!--end::Email-->
                        <?php if (isset($_SESSION['user']) &&
                            $_SESSION['user']['user_rol'] === 'masteradmin'): ?>
                            <!--begin::Rol change-->
                            <div class="mt-5">
                                <label class="form-label" for="user_rol">Rol</label>
                                <select class="form-select form-select-solid this-role-form-field" id="user_rol"
                                        name="user_rol">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="masteradmin">Master Admin</option>
                                </select>
                            </div>
                            <!--end::Rol change-->
                        <?php endif; ?>
                        <!--begin::Delete-->
                        <div class="mt-5">
                            <label class="form-label" for="user_status">Status</label>
                            <select class="form-select form-select-solid this-role-form-field" id="user_status"
                                    name="user_status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <!--end::Delete-->
                        <button id="user" name="user" class="d-none this-role-form-field"></button>
                    </form>
                    <!--end::Form-->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                    <button type="button" id="save_user_btn" class="btn btn-primary" tabindex="0">
                        <!--begin::Indicator label-->
                        <span class="indicator-label">Send</span>
                        <!--end::Indicator label-->
                        <!--begin::Indicator progress-->
                        <span class="indicator-progress">
                        Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                        <!--end::Indicator progress-->
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!--end::User Edit Modal-->
    <script>
        const usersData =<?php echo json_encode($users_list ?? '{}')?>;
        const messagesData =<?php echo json_encode($issues_list ?? '{}');?>;
    </script>
    <script src="/assets/js/custom/admin/users.js"></script>
<?php } ?>