<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-xl-100 bg-transparent">
            <!--begin::Body-->
            <div class="card-body py-6 w-50 mx-auto">
                <form autocomplete="off" id="resetpwd-form" class="m-auto my-4 text-center">
                    <div class="text-center text-danger mb-6" id="error">
                        <?= $error ?? '' ?>
                    </div>
                    <!--begin::Row-->
                    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
                        <!--begin::Form Field-->
                        <div class="my-4 position-relative">
                            <label for="pwd" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">
                                Password
                            </label>
                            <input type="password" id="pwd" name="pwd" required
                                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Form Field-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Row-->
                    <div class="d-flex flex-row flex-wrap gap-12 justify-content-center">
                        <!--begin::Form Field-->
                        <div class="my-4 position-relative">
                            <label for="pwd-repeat" class="ff-poiret account-option bg-brush h2 z-index-3 my-2">
                                Repeat Password
                            </label>
                            <input type="password" id="pwd-repeat" required
                                   class="form-control form-control-solid ajax-login bg-transparent text-center mb-6 this-role-form-field"/>
                        </div>
                        <!--end::Form Field-->
                    </div>
                    <!--end::Row-->
                    <!--begin::Button-->
                    <button type="button" id="token" name="token" value="<?= $token ?? '' ?>"
                            class="btn btn-primary this-role-form-field">Reset Password
                    </button>
                </form>
            </div>
            <!--end::Body-->
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const pwd = $('#pwd');
        const error = $('#error');

        $('.form-control.ajax-login').keyup(function (e) {
            if (e.originalEvent.key === 'Enter') $('#token').click();
        });

        $('#token').click(resetPwd);

        function resetPwd() {
            if (!(pwd.val()).match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)) {
                error.html('Minimum eight characters: one uppercase letter, one lowercase letter, one number and one special character (@#$%^&+=)');
                return;
            }
            if (!(pwd.val() === $('#pwd-repeat').val())) {
                error.html('Passwords should match');
                return;
            }
            let form = getForm('#resetpwd-form');
            return ajax("/account/reset_password", form).done((data) => {
                if (data['response']) {
                    go_url('/app/pwd_was_resetted');
                    return;
                }
                error.html(data['msg']);
            }).fail((e) => {
                console.log(e.responseText);
            });
        }
    });
</script>