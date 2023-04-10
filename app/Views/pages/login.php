<!--begin::Form-->
<form id="login" autocomplete="off"
      class="d-flex flex-column justify-content-center align-items-center account-options mx-auto col-10 w-sm-400px">
    <!--begin::Form Field-->
    <div class="my-4">
        <label for="username" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Username</label>
        <input type="text" id="username" name="username"
               class="form-control form-control-solid ajax-login bg-transparent text-center this-role-form-field"/>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Field-->
    <div class="my-4">
        <label for="pwd" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Password</label>
        <input type="password" id="pwd" name="pwd"
               class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        <a href="#" class="d-block fw-bolder text-info text-hover-info fs-7 mx-auto text-center">Forgot your password?</a>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Button-->
    <div class="my-6">
        <button type="button" id="loginBtn" class="btn btn-primary">Login</button>
    </div>
    <!--end::Form Button-->
</form>
<!--end::Form-->
<div class="m-auto my-4 text-center">
    <p class="m-0">Still don't have an account?</p>
    <a href="/app/signup" class="link-info text-info text-hover-info">Sign up</a>
</div>
<button id="login_error" class="d-none" data-bs-toggle="modal" data-bs-target="#modal-login_error"></button>
<div class="modal fade" id="modal-login_error">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-12">
                <div class="icon-login_error mx-auto">
                </div>
            </div>
            <div class="modal-body gap-5 d-flex flex-column justify-content-around">
                <p class="text-center">
                    We seem to have encoutered some errors, please try again.
                </p>
                <button class="btn btn-primary d-block mx-auto mt-5" data-bs-dismiss="modal" tabindex="-1">Okay</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {

        $('#loginBtn').click(attemptLogin);

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') attemptLogin();
        });

        function attemptLogin() {
            let form = getForm('.login');
            if (form) {
                sendForm(form);
                return;
            }
            $('#login_error').trigger('click');
        }

        function sendForm(form) {
            $.ajax({
                type: "POST",
                url: "/account/login",
                data: form,
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data['response']) {
                        window.location.assign('/app/index');
                        return;
                    }
                    $('#login_error').trigger('click');
                }
            });
        }

    });
</script>