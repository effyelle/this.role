<!--begin::Form-->
<form autocomplete="off" id="signup"
      class="d-flex flex-column justify-content-center align-items-center account-options mx-auto">
    <p id="ajax_signup-response" class="text-center text-danger fw-bold fs-6"></p>
    <p id="email-response" class="text-center text-danger fw-bold fs-6"></p>
    <p id="pwd-response" class="text-center text-danger fw-bold fs-6"></p>
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center col-10 w-md-600px">
        <!--begin::Form Field-->
        <div class="my-4 w-100">
            <label for="username" class="form-label my-2 bg-brush">Username</label>
            <input type="text" id="username" name="username"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center col-10 w-md-600px">
        <!--begin::Form Field-->
        <div class="my-4 w-100">
            <label for="email" class="form-label my-2 bg-brush">Email</label>
            <input type="email" id="email" name="email"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center col-10 w-md-600px">
        <!--begin::Form Field-->
        <div class="my-4 w-100">
            <label for="pwd" class="form-label my-2 bg-brush">Password</label>
            <input type="password" id="pwd" name="pwd"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center col-10 w-md-600px">
        <!--begin::Form Field-->
        <div class="my-4 w-100">
            <label for="pwd-repeat" class="form-label my-2 bg-brush">Repeat Password</label>
            <input type="password" id="pwd-repeat"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Form Button-->
    <div class="my-4">
        <button type="button" id="signupBtn" class="btn btn-primary">
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
<!--begin::Form-->
<div class="m-auto my-4 text-center">
    <p>Already have an account? <a href="<?= base_url() ?>app/login" class="link-info">Log in</a></p>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        $('#signupBtn').click(attemptSignup);

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') attemptSignup();
        });

        function attemptSignup() {
            if (validateFields()) sendForm(getForm('#signup'));
        }

        function sendForm(form) {
            $('#ajax_signup-response').html('');
            toggleProgressSpinner();
            ajax("account/signup", form).done((data) => {
                if (data.response) {
                    go_url('account/created');
                    return;
                }
                toggleProgressSpinner(false);
                if (!data.msg) return;
                $('#ajax_signup-response').html(data.msg);
                if (data.msg.match(/email/)) $('#email').addClass('is-invalid');
            }).fail((e) => {
                $('#ajax_signup-response').html('There was an unespected error');
                console.log("Error: ", e.responseText);
            });
        }

        const username = $('#username');
        username.keypress(function (e) {
            if (e.originalEvent.key === ' ') e.preventDefault();
        });

        function validateFields() {
            let usernameVal = false;
            let emailVal = false;
            let pwdVal = false;

            // Validate username
            if (username.val().length > 0) {
                usernameVal = true;
            }

            // Validate email
            let emailResponse = $('#email-response');
            emailResponse.html('');
            if ($('#email').val().length > 0) {
                emailVal = validateEmail('#email');
                if (emailVal) emailResponse.html('');
                else emailResponse.html('Not a valid email');
            }

            // Validate passwords
            let pwd = $('#pwd');
            let pwdResponse = $('#pwd-response');
            pwdResponse.html('');
            if (pwd.val().length > 0) {
                pwdVal = validPasswords();
            }

            return (usernameVal && emailVal && pwdVal);

            function validPasswords() {
                let pwdRepeat = $('#pwd-repeat');
                if (validatePwd('#pwd')) {
                    if (pwd.val() === pwdRepeat.val()) {
                        pwdRepeat.addClass('is-valid');
                        pwdRepeat.removeClass('is-invalid');
                        return true;
                    }
                    pwdRepeat.removeClass('is-valid');
                    pwdRepeat.addClass('is-invalid');
                    pwdResponse.html('Passwords must match');
                    return false;
                }
                pwdResponse.html('Password shoul be at least 8 character length, minimum of 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (!@#$%^&+=)');
                return false;
            }
        }
    });
</script>