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

    const avatar = $('#avatar');
    avatar.change(function () {
        console.log(avatar.val());
    });

    const emailBox = $('#email');
    emailBox.keyup(function () {
        console.log('here')
        $('.emailchange').removeClass('d-none');
    });

    /**
     * Send email to reset password
     */
    function sendResetPwdMail() {
        if (emailBox.val() !== '') {
            $.ajax({
                url: "/account/send_reset_password_email/" + emailBox.val(),
                dataType: "json",
                success: function (data) {
                    $('.ajax-response').html(data['msg']);
                }
            })
        }
    }

    /**
     * Deactivate account and close session
     */
    function deactivateAccount() {
        console.log("Deactivate account= ", "This is yet to write");
    }

    function formatProfile(data) {
        if (!data['response']) return;
        let user = data['user'];
        emailBox.val(user['user_email']);
        $('#fname').val(user['user_fname']);
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
        $('#update-profile .this-role-form-field').prop('disabled', !editable);
        deactivateProfile.toggleClass('d-none', editable);
        resetPwdBtn.toggleClass('d-none', editable);
        $('#updateProfile').toggleClass('d-none', !editable);
        // Change Button HTML
        if (editable) editProfileBtn.html('Cancel');
        else {
            $('.emailchange').addClass('d-none');
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