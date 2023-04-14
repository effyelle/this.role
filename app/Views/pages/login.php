<!--begin::Form-->
<form id="login" autocomplete="off"
      class="d-flex flex-column justify-content-center align-items-center account-options mx-auto col-10 w-sm-400px login">
    <!--begin::Form Field-->
    <div class="my-4">
        <label for="email" class="form-label required fs-5 my-2">Email</label>
        <input type="text" id="email" name="email"
               class="form-control form-control-solid ajax-login bg-transparent text-center this-role-form-field"/>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Field-->
    <div class="my-4">
        <label for="pwd" class="form-label required fs-5 my-2">Password</label>
        <input type="password" id="pwd" name="pwd"
               class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        <a href="/app/reset_pwd"
           class="d-block fw-bolder text-info text-hover-info fs-7 mx-auto text-center">Forgot password?</a>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Button-->
    <div class="my-6">
        <button type="button" id="loginBtn" class="btn btn-primary">
            <!--begin::Indicator label-->
            <span class="indicator-label">Send</span>
            <!--end::Indicator label-->
            <!--begin::Indicator progress-->
            <span class="indicator-progress">Please wait...
                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
            <!--end::Indicator progress-->
        </button>
    </div>
    <!--end::Form Button-->
</form>
<!--end::Form-->
<div class="m-auto my-4 text-center">
    <p class="m-0">Still don't have an account?
        <a href="/app/signup" class="link-info text-info text-hover-info">Sign up</a>
    </p>
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
                <p class="text-center text-danger">There was an error logging in.</p>
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
            $('button[data-bs-dismiss=modal]').css('display', 'block');
            if (form) {
                sendForm(form);
                return;
            }
            $('#login_error').trigger('click');
        }

        function sendForm(form) {
            $('.indicator-label').hide();
            $('.indicator-progress').show();
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
                    $('.indicator-label').show();
                    $('.indicator-progress').hide();
                    $('#login_error').trigger('click');
                }
            });
        }
    });
</script>