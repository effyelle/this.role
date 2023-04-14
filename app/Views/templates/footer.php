<!--begin::Footer-->
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="contact-support">
    <div class="modal-dialog">
        <!--begin::Form-->
        <form class="modal-content">
            <!--begin::Header-->
            <div class="modal-header">
                <h3 class="modal-title">Issues and suggestions Mail</h3>
                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal"
                     aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
                <!--end::Close-->
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="modal-body">
                <div class="form-group mt-5">
                    <label for="issue_title">Issue</label>
                    <input id="issue_title" name="issue_title" type="text" maxlength="50"
                           class="form-control form-control-solid this-role-form-field"/>
                </div>
                <div class="form-group mt-5">
                    <label for="issue_details">Message</label>
                    <textarea id="issue_details" name="issue_details" rows="3" maxlength="500"
                              class="form-control form-control-solid this-role-form-field"></textarea>
                </div>
                <div class="form-group mt-5">
                    <label for="issue_type">Issue type</label>
                    <select class="form-select form-select-solid this-role-form-field" id="issue_type"
                            name="issue_type">
                        <option value="suggestion">Suggestion 💡</option>
                        <option value="congratulation">Congratulation 🥳</option>
                        <option value="complaint">Complaint 😩</option>
                        <option value="help">Help 😭</option>
                    </select>
                </div>
            </div>
            <!--end::Body-->
            <!--begin::Footer-->
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="send_issue_btn" data-bs-toggle="modal" data-bs-target="#modal_confirmation"
                        class="btn btn-primary">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Send</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress">
                        Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                    <!--end::Indicator progress-->
                </button>
            </div>
            <!--end::Footer-->
        </form>
        <!--end::Form-->
    </div>
</div>
<!--end::Modal-->
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_confirmation">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title text-center mx-auto">Are you sure?</h3>
            </div>
            <div class="modal-body">
                <div class="d-flex flex-row justify-content-between">
                    <button class="btn btn-primary confirm_answer" value="true" data-bs-dismiss="modal">Yes</button>
                    <button class="btn btn-danger confirm_answer" value="false" data-bs-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Modal-->
<!--end::Footer-->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        $('#send_issue_btn').click(function () {
            openConfirmation(sendIssue)
        });

        function sendIssue() {
            toggleProgressSpinner();
            let form = getForm('#contact-support');
            $.ajax({
                type: "post",
                url: "/account/send_issue",
                data: form,
                dataType: "json",
                success: function (data) {
                    if (data['response']) {

                    }
                    toggleProgressSpinner(false);
                },
                error: function (e) {
                    console.log(e);
                    toggleProgressSpinner(false);
                }
            });
        }
    });
</script>