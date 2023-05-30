<!--begin::Form-->
<form id="login" autocomplete="off"
      class="d-flex flex-column justify-content-center align-items-center account-options mx-auto text-center">
    <!--begin::Form Field-->
    <div class="my-4 col-10 w-md-600px">
        <label for="user" class="form-label my-2 bg-brush">Email or Username</label>
        <input type="text" id="user" name="user"
               class="form-control form-control-solid ajax-login bg-transparent this-role-form-field"/>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Field-->
    <div class="my-4 col-10 w-md-600px fs-5">
        <label for="pwd" class="form-label my-2 bg-brush">Password</label>
        <input type="password" id="pwd" name="pwd"
               class="form-control form-control-solid ajax-login bg-transparent mb-6 this-role-form-field"/>
    </div>
    <!--end::Form Field-->
    <div class="col-10 w-md-600px">
        <a href="<?= base_url() ?>app/reset_pwd"
           class="d-block fw-bolder text-info text-hover-info fs-7 mx-auto text-center">Forgot password?</a>
    </div>
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
        <a href="<?= base_url() ?>app/signup" class="link-info text-info text-hover-info">Sign up</a>
    </p>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {

        $('#loginBtn').click(attemptLogin);

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') attemptLogin();
        });

        function attemptLogin() {
            let form = getForm('#login');
            $('button[data-bs-dismiss=modal]').css('display', 'block');
            if (form) {
                sendForm(form);
                return;
            }
            $('.modal_error_response').html('There was an error logging in.');
            $('#modal_error-toggle').trigger('click');
        }

        function sendForm(form) {
            toggleProgressSpinner();
            ajax("account/login", form).done((data) => {
                if (data.response) {
                    if (window.location.href.match(/logout/)) {
                        go_url('/app/index');
                        return;
                    }
                    window.location.reload();
                    return;
                }
                toggleProgressSpinner(false);
                $('.modal_error_response').html('There was an error logging in.');
                $('#modal_error-toggle').trigger('click');
            }).fail((e) => {
                console.log(e.responseText);
            });
        }
    });
</script>