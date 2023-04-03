<!--begin::Form-->
<form id="login" action="/account/login" method="post"
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
    </div>
    <!--end::Form Field-->
    <!--begin::Form Button-->
    <div class="my-4">
        <button type="button" id="loginBtn" class="btn btn-primary">Login</button>
    </div>
    <!--end::Form Button-->
</form>
<!--end::Form-->
<div class="m-auto my-4 text-center">
    <p>Still don't have an account?</p>
    <a href="/app/signup" class="link-info">Sign up</a>
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
            alert('Faltan datos');
        }

        function sendForm(form) {
            $.ajax({
                type: "POST",
                url: "/account/login",
                data: form,
                dataType: "json",
                success: function (data) {
                    if (data['response']) {
                        window.location.assign('/app/index');
                        return;
                    }
                    console.log(data);
                    console.log('Los datos son incorrectos');
                }
            });
        }

    });
</script>