<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-xl-100 bg-transparent">
            <!--begin::Body-->
            <div class="card-body py-6 w-100 mx-auto" style="max-width: 700px;">
                <div class="text-center text-danger mb-6" id="error">
                    <?= $error ?? '' ?>
                </div>
                <form autocomplete="on" class="m-auto my-4 text-center" id="resetpwd-form">
                    <!--begin::Row-->
                    <input type="text" id="username" name="username" placeholder="Your username..." required
                           class="form-control form-control-solid this-role-form-field required mb-6"/>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <input type="password" id="pwd" name="pwd" required placeholder="New password"
                           class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
                    <!--begin::Row-->
                    <input type="password" id="pwd-repeat" required placeholder="Repeat password"
                           class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
                    <button type="button" id="resetPwdBtn" class="btn btn-primary mt-5">Reset Password</button>
                </form>
            </div>
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Reset password listener
        const resetPwdBtn = $('#resetPwdBtn');

        $('.this-role-form-field').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') resetPwdBtn.click();
        });

        resetPwdBtn.click(resetPwd);

        function resetPwd() {
            const pwd = $('#pwd');
            const error = $('#error');
            if (!(pwd.val()).match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)) {
                error.html('Minimum eight characters: one uppercase letter, one lowercase letter, one number and one special character (@#$%^&+=)');
                return;
            }
            if (!(pwd.val() === $('#pwd-repeat').val())) {
                error.html('Passwords should match');
                return;
            }
            if ($('#username').val() === '') {
                error.html('Please enter a username');
                return;
            }
            let form = getForm('#resetpwd-form');
            return ajax("account/reset_password", form).done((data) => {
                if (data.response) {
                    go_url('app/pwd_was_resetted');
                    return;
                }
                console.log(data)
                error.html(data.msg);
            }).fail((e) => {
                console.log(e.responseText);
            });
        }
    });
</script>