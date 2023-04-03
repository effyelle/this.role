<!--begin::Form-->
<div class="d-flex flex-column justify-content-center align-items-center account-options mx-auto col-10 w-sm-400px">
    <!--begin::Form Field-->
    <div class="my-4">
        <div class="float-left position-relative w-100px ff-poiret account-option">
            <label for="username" class="h2 z-index-3 my-2">Username</label>
            <span class="bg-brush position-absolute"></span>
        </div>
        <input type="text" id="username"
               class="form-control form-control-solid ajax-login bg-transparent text-center this-role-input"/>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Field-->
    <div class="my-4">
        <div class="float-right position-relative w-100px ff-poiret account-option">
            <label for="pwd" class="h2 z-index-3 my-2">Password</label>
            <span class="bg-brush position-absolute"></span>
        </div>
        <input type="password" id="pwd"
               class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-input"/>
    </div>
    <!--end::Form Field-->
    <!--begin::Form Button-->
    <div class="my-4">
        <button type="button" id="signinBtn" class="btn btn-primary">Signin</button>
    </div>
    <!--end::Form Button-->
</div>
<!--end::Form-->
<div class="m-auto my-4 text-center">
    <p>¿Todavía no tienes una cuenta?</p>
    <a href="/account/signup" class="link-info">Sign up</a>
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
            if (username !== '' && pwd !== '') {
                sendLogin(username, pwd);
                return;
            }
            toastr.error("Recuerda rellenar todos los campos", "Faltan datos.");
        }

        function sendLogin(username, pwd) {
            $.ajax({
                method: "POST",
                url: "/account/attempt_signin",
                data: {
                    login: {
                        username: username,
                        pwd: pwd
                    }
                },
                dataType: "json"
            }).done(data => {
                console.log(data);
                window.location.assign('/app/dev_index');
            }).fail(e => {
                console.log("ERROR: " + e);
            });
        }
    });
</script>