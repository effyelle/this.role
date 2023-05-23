<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-xl-100 bg-transparent">
            <!--begin::Body-->
            <div class="card-body py-6 w-100 w-lg-50 mx-auto">
                <form action="<?= base_url(); ?>app/send_reset_pwd" method="post" autocomplete="on"
                      class="m-auto my-4 text-center">
                    <label for="email" class="form-label"></label>
                    <input type="email" id="email" name="email" placeholder="Your email..." required
                           class="form-control form-control-solid this-role-form-field required"/>
                    <button type="submit" class="btn btn-primary mt-5">Reset Password</button>
                </form>
            </div>
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->