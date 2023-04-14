<!--begin::Form-->
<form autocomplete="off"
      class="d-flex flex-column justify-content-center align-items-center account-options mx-auto col-10 signup">
    <p id="ajax_signup-response" class="text-center text-danger fw-bold fs-6"></p>
    <p id="email-response" class="text-center text-danger fw-bold fs-6"></p>
    <p id="pwd-response" class="text-center text-danger fw-bold fs-6"></p>
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="email" class="form-label fs-5 my-2 required">Email</label>
            <input type="email" id="email" name="email"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="pwd" class="form-label fs-5 my-2 required">Password</label>
            <input type="password" id="pwd" name="pwd"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="pwd-repeat" class="form-label fs-5 my-2 required">Repeat Password</label>
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
    <p>Already have an account? <a href="/app/login" class="link-info">Log in</a></p>

</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        $('#signupBtn').click(attemptSignup);

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') attemptSignup();
        });

        function attemptSignup() {
            if (validateFields()) sendForm(getForm('.signup'));
        }

        function sendForm(form) {
            $('#ajax_signup-response').html('');
            $('.indicator-label').hide();
            $('.indicator-progress').show();
            $.ajax({
                type: "POST",
                url: "/account/signup",
                data: form,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data['response']) {
                        window.location.assign('/account/created');
                        return;
                    }
                    $('.indicator-label').show();
                    $('.indicator-progress').hide();
                    $('#ajax_signup-response').html(data['msg']);
                    if (data.msg.match(/email/)) $('#email').addClass('is-invalid');
                },
                fail: function (e) {
                    $('#ajax_signup-response').html('There was an unespected error');
                    console.log(e);
                }
            });
        }

        function validateFields() {
            let emailVal = false;
            let pwdVal = false;

            if ($('#email').val().length > 0) {
                let emailResponse = $('#email-response');
                emailVal = validateEmail('#email');
                if (emailVal) emailResponse.html('');
                else emailResponse.html('Not a valid email');
            }
            let pwd = $('#pwd');
            if (pwd.val().length > 0) {
                pwdVal = validPasswords();
            }

            return (emailVal && pwdVal);

            function validPasswords() {
                let pwdRepeat = $('#pwd-repeat');
                let pwdResponse = $('#pwd-response');
                pwdResponse.html('');
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