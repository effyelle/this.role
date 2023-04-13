<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header">
                <div class="card-toolbar gap-5">
                    <h2><?= $title ?></h2>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body mx-12">
                <!--begin::Tabs-->
                <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#users-table">Users List</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#users-msgs">Messages Support</a>
                    </li>
                </ul>
                <!--end::Tabs-->
                <div id="users-table" class="tab-pane fade show active" role="tabpanel">
                    <?php if (isset($users_list) && is_array($users_list) && count($users_list) > 0): ?>
                        <table id="users_list"
                               class="table dataTable align-middle table-row-dashed generate-datatable show-search-dt no-footer">
                            <thead>
                            <tr class="fw-bold fs-6 text-gray-800">
                                <td>Avatar</td>
                                <td>Full Name</td>
                                <td>Username</td>
                                <td>Email</td>
                                <td>User Rol</td>
                                <td>Status</td>
                                <td>Edit</td>
                            </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($users_list as $k => $user) {
                                echo '<tr>'
                                    . '   <td><img src="' . $user['user_avatar'] . '" alt="" width="35" class="circle"/></td>'
                                    . '   <td>' . $user['user_fname'] . '</td>'
                                    . '   <td>' . $user['user_username'] . '</td>'
                                    . '   <td>' . $user['user_email'] . '</td>'
                                    . '   <td>' . ucfirst($user['user_rol']) . '</td>'
                                    . '   <td>' . ($user['user_deleted'] ? 'Inactive' : 'Active') . '</td>'
                                    . '   <td>'
                                    . '      <button value="' . $k . '"'
                                    . '         data-bs-toggle="modal" data-bs-target="#user_edit-modal"'
                                    . '         class="user_id-edit_btn btn btn-danger ps-3 pe-2 py-1 usernameBtn">'
                                    . '         <i class="fa fa-edit"></i>'
                                    . '      </button>'
                                    . '   </td>'
                                    . '</tr>';
                            } ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
                <div id="users-msgs">
                    <table id="msgs_list" class="tab-pane fade" role="tabpanel"></table>
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
                <form id="edit_user" name="edit_user">
                    <div class="mt-5">
                        <label class="form-label" for="fname">Full Name</label>
                        <input id="fname" name="fname" type="text"
                               class="form-control form-control-solid this-role-form-field"/>
                    </div>
                    <div class="mt-5">
                        <label class="form-label" for="uname">Username</label>
                        <input id="uname" name="uname" type="text"
                               class="form-control form-control-solid this-role-form-field"/>
                    </div>
                    <div class="mt-5">
                        <label class="form-label" for="email">Email</label>
                        <input id="email" name="email" type="text"
                               class="form-control form-control-solid this-role-form-field"/>
                    </div>
                    <div class="mt-5">
                        <label class="form-label" for="user_rol">Rol</label>
                        <select class="form-select form-select-solid this-role-form-field" id="user_rol"
                                name="user_rol">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="master">Master</option>
                        </select>
                    </div>
                    <div class="mt-5">
                        <label class="form-label" for="user_status">Status</label>
                        <select class="form-select form-select-solid this-role-form-field" id="user_status"
                                name="user_status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                <button type="button" id="save_user_btn" class="btn btn-primary">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Send</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress">
                        Por favor espere...
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
    document.addEventListener('DOMContentLoaded', function () {
        const usersData =<?php echo json_encode($users_list)?>;
        const userI = document.querySelectorAll('.usernameBtn');

        for (let i = 0; i < userI.length; i++) {
            userI[i].addEventListener('click', function () {
                let user = usersData[this.value];
                $('#fname').val(user.user_fname);
                $('#uname').val(user.user_username);
                $('#email').val(user.user_email);
                $('#user_rol').val(user.user_rol);
                $('#user_status').val(user.user_deleted ? 'inactive' : 'active');
            });
        }

        $('#save_user_btn').click(function () {
            let form = getForm('#edit_user');
            $.ajax({
                type: "post",
                url: "/adminusers/update_user",
                data: form,
                success: function (data) {
                    console.log(data);
                }
            })
        });
    });
</script>