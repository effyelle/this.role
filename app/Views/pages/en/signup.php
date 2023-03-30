<div class="d-flex flex-column justify-content-center align-items-center account-options mx-auto col-10">
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4">
            <div class="account-option float-left position-relative w-100px ff-poiret ">
                <label for="username" class="h2 z-index-3 my-2">Username</label>
                <span class="bg-brush position-absolute"></span>
            </div>
            <input type="text" id="username"
                   class="form-control form-control-solid ajax-login bg-transparent text-center"/>
        </div>
        <!--end::Form Field-->
        <!--begin::Form Field-->
        <div class="my-4">
            <div class="account-option float-right position-relative w-100px ff-poiret ">
                <label for="email" class="h2 z-index-3 my-2">Email</label>
                <span class="bg-brush position-absolute"></span>
            </div>
            <input type="email" id="email"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Row-->
    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
        <!--begin::Form Field-->
        <div class="my-4">
            <div class="account-option float-right position-relative w-100px ff-poiret ">
                <label for="pwd" class="h2 z-index-3 my-2">Password</label>
                <span class="bg-brush position-absolute"></span>
            </div>
            <input type="password" id="pwd"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6"/>
        </div>
        <!--end::Form Field-->
        <!--begin::Form Field-->
        <div class="my-4">
            <div class="account-option float-right position-relative w-100px ff-poiret ">
                <label for="pwd-repeat" class="h2 z-index-3 my-2">Repeat Password</label>
                <span class="bg-brush position-absolute"></span>
            </div>
            <input type="password" id="pwd-repeat"
                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6"/>
        </div>
        <!--end::Form Field-->
    </div>
    <!--end::Row-->
    <!--begin::Form Button-->
    <div class="my-4">
        <button type="button" id="signinBtn" class="btn btn-primary">Signin</button>
    </div>
    <!--end::Form Button-->
</div>
<div class="m-auto my-4 text-center">
    <p>¿Ya tienes una cuenta?</p>
    <a href="/account/signin" class="link-info">Sign up</a>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {

        $('#signinBtn').click(attemptLogin);

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') attemptLogin();
        });

        function attemptLogin() {
            let username = $('#username').val();
            let pwd = $('#pwd').val();
            let pwdRepeat = $('#pwd-repeat')
            if (username !== '' && pwd !== '' && pwdRepeat !== '') {
                if (checkPassword()) {
                    sendSignup(username, pwd, pwdRepeat);
                    return;
                }
                toastr.error("Make sure password meets all the requirements.", "Password is incorrect");
                return;
            }
            toastr.error("Some fields seem to be empty.", "Information missing");
        }

        function checkPassword() {
            return true;
        }

        function sendSignup(username, pwd) {
            $.ajax({
                method: "POST",
                url: "/account/attempt_signup",
                data: {
                    login: {
                        username: username,
                        pwd: pwd,
                    }
                },
                dataType: "json"
            }).done(data => {
                console.log(data);
                alert('An activation email has been sent.');
                window.location.assign('/account/signin');
            }).fail(e => {
                console.log("ERROR: " + e);
            });
        }
    });
</script>