<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-xl-100 bg-transparent">
            <!--begin::Header-->
            <div class="card-header flex-column justify-content-center align-items-center py-6 bg-transparent border-0">
                <div class="card-toolbar gap-5">
                    <h2 class="m-auto">The token has expired</h2>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body py-6 w-50 mx-auto">
                <form action="<?= base_url(); ?>app/send_confirmation_email" method="post" autocomplete="on"
                      class="m-auto my-4 text-center">
                    <label for="email" class="form-label"></label>
                    <input type="email" id="email" name="email" placeholder="Your email..." required
                           class="form-control form-control-solid this-role-form-field required"/>
                    <button type="submit" class="btn btn-primary mt-5">Get New Token</button>
                </form>
            </div>
            <!--end::Body-->
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->