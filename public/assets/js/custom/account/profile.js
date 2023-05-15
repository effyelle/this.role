document.addEventListener('DOMContentLoaded', function () {
    // Reset password listener
    const resetPwdBtn = $('#resetPwdBtn');
    resetPwdBtn.click(function () {
        openConfirmation(sendResetPwdMail);
    });

    // Deactivate profile listener
    const deactivateProfile = $('#deactivateProfile');
    deactivateProfile.click(function () {
        openConfirmation(deactivateAccount);
    });

    $('#resend-conf_email').click(function () {
        openConfirmation(sendConfEmail);
    });

    $('#avatar').change(function () {
        readImageChange(this, q('#avatar_profile_holder')[0]);
    });

    /**
     * Email input type text
     * @type {jQuery|HTMLElement|*}
     */
    const emailBox = $('#email');

    /**
     * Send email to reset password
     */
    function sendResetPwdMail() {
        if (emailBox.val() !== '') {
            $.ajax({
                url: "/account/send_reset_password_email/" + emailBox.val(),
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (!data['response']) {
                        $('#modal_error-toggle').click();
                        $('.modal_error_response').html(data['msg']);
                    } else {
                        $('#modal_success-toggle').click();
                        $('.modal_success_response').html(data['msg']);
                    }
                }
            })
        }
    }

    /**
     * Deactivate account and close session
     */
    function deactivateAccount() {
        $.ajax({
            type: "get",
            url: "/account/deactivate",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data['response']) {
                    $('#modal_success-toggle').click();
                    $('.modal_success_response').html(
                        'Your account has been deactivated<br>' +
                        'You will be logged out'
                    );
                    $('#modal_data_sent').on('hidden.bs.modal', function () {
                        window.location.reload();
                    });
                }
                if (data['msg']) {
                    $('#modal_error-toggle').click();
                    $('.modal_error_response').html(data['msg']);
                }
            }
        })
    }

    const usernameInput = $('#username');

    function sendConfEmail() {
        if (emailBox.val() !== '' && usernameInput.val() !== '') {
            $.ajax({
                url: "/app/resend_email_confirmation/",
                dataType: "json",
                success: function (data) {
                    if (!data['response']) {
                        $('#modal_error-toggle').click();
                        $('.modal_error_response').html(data['msg']);
                    } else {
                        $('#modal_success-toggle').click();
                        $('.modal_success_response').html(data['msg']);
                    }
                }
            })
        }
    }

    const avatar_holder = $('.avatar-input-holder');

    function formatProfile(data) {
        if (!data['response']) return;
        let user = data['user'];
        usernameInput.val(user['user_username']);
        $('#fname').val(user['user_fname']);
        emailBox.val(user['user_email']);
        avatar_holder.css('background-image', 'url(' + user['user_avatar'] + ')');
        avatar_holder.css('background-size', 'cover');
    }

    /**
     * Toggle profile on editable
     * --------------------------
     * Toggle visibility and edition availability for form inputs and other tags
     *
     * @param editable
     */
    function toggleProfileEditable(editable = false) {
        const editProfileBtn = $('#editProfile');
        $('.editable').toggleClass('show', editable);
        $('#myprofile .this-role-form-field').prop('disabled', !editable);
        deactivateProfile.toggleClass('d-none', editable);
        resetPwdBtn.toggleClass('d-none', editable);
        $('#updateProfile').toggleClass('d-none', !editable);
        // Change Button HTML
        if (editable) editProfileBtn.html('Cancel');
        else {
            editProfileBtn.html('Edit Profile');
            updateSession(formatProfile);
        }
        // Unbind previous event
        editProfileBtn.unbind('click');
        // Bind again with contrary boolean
        editProfileBtn.click(function () {
            toggleProfileEditable(!editable);
        });
    }

    // Deactivate editable fields at page load
    toggleProfileEditable();
});