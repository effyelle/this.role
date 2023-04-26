<!--begin::Footer-->
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="contact_support">
    <div class="modal-dialog">
        <!--begin::Form-->
        <form class="modal-content" autocomplete="off">
            <!--begin::Header-->
            <div class="modal-header">
                <h3 class="modal-title">Contact Support</h3>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="modal-body">
                <div class="text-center text-danger fs-5 issues_error d-none">One or more fields are missing</div>
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
                <!--
                <div class="form-group mt-5">
                    <label for="issue_type">Issue type</label>
                    <select class="form-select form-select-solid this-role-form-field" id="issue_type"
                            name="issue_type">
                        <option value="-1" disabled selected>Select one</option>
                        <optgroup label="" class="dropdown-divider">
                            <option value="suggestion">Suggestion 💡</option>
                            <option value="congratulation">Congratulation 🥳</option>
                            <option value="complaint">Complaint 😩</option>
                            <option value="help">Help 😭</option>
                        </optgroup>
                    </select>
                </div>
                -->
            </div>
            <!--end::Body-->
            <!--begin::Footer-->
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="send_issue_btn" class="btn btn-primary">
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
<!--begin::Modal toggle-->
<button type="button" id="modal_confirmation-toggle" data-bs-target="#modal_confirmation" data-bs-toggle="modal"
        class="d-none"></button>
<!--end::Modal toggle-->
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_confirmation">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title text-center mx-auto">Are you sure?</h3>
            </div>
            <div class="modal-body">
                <div class="d-flex flex-row justify-content-between">
                    <button class="btn btn-danger" data-bs-dismiss="modal">No</button>
                    <button class="btn btn-primary confirm_answer" data-bs-dismiss="modal">Yes</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Modal-->
<!--begin::Modal Toggle-->
<button class="d-none" id="modal_error-toggle" data-bs-target="#modal_error" data-bs-toggle="modal"></button>
<!--end::Modal Toggle-->
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_error">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-12">
                <div class="icon-error mx-auto"></div>
            </div>
            <div class="modal-body">
                <div class="mb-5">
                    <p class="text-center">There was an unexpected error</p>
                    <p class="text-center modal_error_response">We apologize for the inconveniences</p>
                </div>
                <div class="d-flex flex-row justify-content-center">
                    <button class="btn btn-danger confirm_answer" data-bs-dismiss="modal" tabindex="-1">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Modal-->
<!--begin::Modal Toggle-->
<button class="d-none" id="modal_success-toggle" data-bs-target="#modal_success" data-bs-toggle="modal"></button>
<!--end::Modal Toggle-->
<!--begin::Modal-->
<div class="modal fade" tabindex="-1" id="modal_success">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-12">
                <div class="icon-success mx-auto">
                </div>
            </div>
            <div class="modal-body">
                <p class="text-center modal_success_response"></p>
                <div class="d-flex flex-row justify-content-center">
                    <button class="btn btn-primary confirm_answer" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Modal-->
<!--end::Footer-->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        $('#modal_alert .confirm_answer').click(function () {
            window.location.reload();
        });

        $('#send_issue_btn').click(function () {
            const issues_error_msg = $('.issues_error');
            if (
                $('#issue_title').val().length > 0 && $('#issue_details').val().length > 0
                //&& $('#issue_type option:selected').val() !== '-1'
            ) {
                console.log('in ere')
                issues_error_msg.addClass('d-none');
                sendIssue();
                return;
            }
            issues_error_msg.removeClass('d-none');
        });

        <?php if(isset($page) && $page !== 'games/details'): ?>
        $('#modal_success').on('hidden.bs.modal', function () {
            window.location.reload();
        });
        <?php endif; ?>

        $('#contact_support').on('hidden.bs.modal', function () {
            $('#contact_support .this-role-form-field').val('');
            $('#issue_type option[value="-1"').prop('selected', true);
        })

        function sendIssue() {
            toggleProgressSpinner();
            let form = getForm('#contact_support');
            $.ajax({
                type: "post",
                url: "/account/send_issue",
                data: form,
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data['response']) {
                        $('#modal_success-toggle').click();
                    } else {
                        $('#modal_error-toggle').click();
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