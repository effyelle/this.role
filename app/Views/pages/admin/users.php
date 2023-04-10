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
                            <?php foreach ($users_list as $user) {
                                echo '<tr>'
                                    . '   <td><img src="' . $user['user_avatar'] . '" alt="" width="35" class="circle"/></td>'
                                    . '   <td>' . $user['user_fname'] . '</td>'
                                    . '   <td>' . $user['user_username'] . '</td>'
                                    . '   <td>' . $user['user_email'] . '</td>'
                                    . '   <td>' . ucfirst($user['user_rol']) . '</td>'
                                    . '   <td>' . ($user['user_deleted'] ? 'Inactive' : 'Active') . '</td>'
                                    . '   <td>'
                                    . '      <button value="' . $user['user_id'] . '" data-bs-toggle="modal" data-bs-target="#user_edit-modal"'
                                    . '         class="user_id-edit_btn btn btn-danger ps-3 pe-2 py-1">'
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
                <!-- FORMULARIO PARA ENVIO DE SUGERENCIAS -->
                <form enctype="multipart/form-data" id="form_suggestions" name="form_suggestions">
                    <div class="form-group">
                        <label for="type">Tipo</label>
                        <select class="form-select form-select-solid" id="type" name="type">
                            <option value="Sugerencia">Sugerencia 💡</option>
                            <option value="Queja">Queja 😩</option>
                            <option value="Felicitación">Felicitación 🍾</option>
                        </select>
                    </div>
                    <div class="form-group mt-5">
                        <label for="comment">Comentario</label>
                        <textarea class="form-control form-control-solid" id="comment" name="comment"
                                  rows="3"></textarea>
                    </div>
                    <!-- IMAGE INPUT -->
                    <div class="form-group mt-5">
                        <label for="image">Imagen</label>
                        <input class="form-control form-control-solid" multiple type="file" id="image"
                               name="image[]" value="">
                    </div>
                    <div class="form-check form-check-custom form-check-solid mt-5">
                        <input class="form-check-input" name="anonymous" type="checkbox" value="1"
                               id="anonymous"/>
                        <label class="form-check-label" for="anonymous">
                            Enviar anónimamente
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="send_suggestion_btn" class="btn btn-primary">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Enviar</span>
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
    document.addEventListener('DOMContentLoaded', function (){
        // Fill form for edition by button
    });
</script>