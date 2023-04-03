<!--begin::Form-->
<div class="d-flex flex-column justify-content-center align-items-center account-options mx-auto col-10">
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="username" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Username</label>
            <input type="text" id="username" name="username"
                   class="form-control form-control-solid ajax-login bg-transparent text-center this-role-form-field"/>
            <span class="popup alert-feedback">Necessary field.</span>
        </div>
        <!--end::Form Field-->
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="email" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Email</label>
            <input type="email" id="email" name="email"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
            <span class="popup alert-feedback">Enter a valid email.</span>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="pwd" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Password</label>
            <input type="password" id="pwd" name="pwd"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
            <span class="popup alert-feedback">Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (@#$%^&+=).</span>
        </div>
        <!--end::Form Field-->
        <!--begin::Form Field-->
        <div class="my-4 position-relative">
            <label for="pwd-repeat" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">Repeat Password</label>
            <input type="password" id="pwd-repeat"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
            <span class="popup alert-feedback">Passwords don't match.</span>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Form Button-->
    <div class="my-4">
        <button type="button" id="signupBtn" class="btn btn-primary">Sign up</button>
    </div>
    <!--end::Form Button-->
</div>
<!--begin::Form-->
<div class="m-auto my-4 text-center">
    <p>¿Ya tienes una cuenta?</p>
    <a href="/app/login" class="link-info">Log in</a>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {

        $('#signupBtn').click(attemptSignup);

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') attemptSignup();
        });

        function attemptSignup() {
            if (validateFields()) {
                let form = getForm('.signup');
                if (form) {
                    sendForm(form);
                }
            }
        }

        function sendForm(form) {
            $.ajax({
                type: "POST",
                url: "/account/signup",
                data: form,
                dataType: "json",
                success: function (data) {
                    if (!data['error']) window.location.assign('/account/created');
                    console.log(data);
                },
                fail: function (e) {
                    console.log(e);
                }
            });
        }

        function validateFields() {
            let usernameVal = validateUsername();
            let emailVal = validateEmail();
            let pwdVal = validatePwds();

            return (usernameVal && emailVal && pwdVal);

            function validateUsername() {
                let user = document.querySelector('#username');
                if (user.value.length > 2) {
                    user.classList.add('is-valid');
                    user.classList.remove('is-invalid');
                    return true;
                }
                console.log(document.querySelector('#username ~ .popup'))
                spanPopup(document.querySelector('#username ~ .popup'));
                user.classList.remove('is-valid');
                user.classList.add('is-invalid');
                return false;
            }

            function validateEmail() {
                let email = document.querySelector('#email');
                if (email.value.match(/^[A-Za-z0-9]+@[A-Za-z0-9-]+\.[A-Za-z]+$/)) {
                    email.classList.add('is-valid');
                    email.classList.remove('is-invalid');
                    return true;
                }
                spanPopup(document.querySelector('#email ~ .popup'));
                email.classList.remove('is-valid');
                email.classList.add('is-invalid');
                return false;
            }

            function validatePwds() {
                let pwd = document.querySelector('#pwd');
                let pwdRepeat = document.querySelector('#pwd-repeat');
                if (pwd.value.match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)) {
                    pwd.classList.add('is-valid');
                    pwd.classList.remove('is-invalid');
                    if (pwd.value === pwdRepeat.value) {
                        pwdRepeat.classList.add('is-valid');
                        pwdRepeat.classList.remove('is-invalid');
                        return true;
                    }
                    spanPopup(document.querySelector('#pwd-repeat ~ .popup'));
                    pwdRepeat.classList.remove('is-valid');
                    pwdRepeat.classList.add('is-invalid');
                    return false;
                }
                spanPopup(document.querySelector('#pwd ~ .popup'));
                pwd.classList.remove('is-valid');
                pwd.classList.add('is-invalid');
                return false;
            }
        }

        function spanPopup(popup) {
            popup.classList.add('show');
            setTimeout(function () {
                popup.classList.remove('show');
            }, 2000);
        }

    });
</script>