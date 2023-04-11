document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        type: "post",
        url: "/account/my_profile",
        dataType: "json",
        success: formatProfile
    });

    $('#resetPwdBtn').click(function () {
        openConfirmation(sendResetPwdMail);
    });
    $('#deactivateProfile').click(function () {
        openConfirmation(deactivateAccount);
    });

    function openConfirmation(callback) {
        $('.modal-header h3').html('Are you sure?')
        $('.confirm_answer').unbind('click');
        $('.confirm_answer').click(function () {
            if (this.value === "true") {
                callback();
            }
        });
    }

    function sendResetPwdMail() {
        // send email
        if ($('#email').val() !== '') {
            $.ajax({
                url: "/account/send_reset_password_email/" + $('#email').val(),
                dataType: "json",
                success: function (data) {
                    $('.reset-pwd').html(data['msg']);
                }
            })
        }
    }

    function deactivateAccount() {
        console.log('Deactivate account -> yet to write');
    }

    function formatProfile(data) {
        if (data['response']) {
            let user = data['user'];
            $('#fname').val(user['user_fname']);
            $('#username').val(user['user_username']);
            $('#email').val(user['user_email']);
            formatAvatar('/assets/uploads/avatars/' + user['user_avatar']);
        }
    }

    function formatAvatar(img) {
        let avatarHolder = $('#avatar-input-holder');
        $.ajax({
            url: img,
            type: 'HEAD',
            error: function () {
                avatarHolder.css('background', 'url("/assets/media/avatars/blank.png") no-repeat');
                avatarHolder.css('background-size', 'cover');
            },
            success: function () {
                avatarHolder.css('background', 'url("' + img + '") no-repeat');
                avatarHolder.css('background-size', 'cover');
            }
        });
    }

    function toggleProfileEditable(editable = false) {
        const editProfileBtn = $('#editProfile');
        // Toggle visibility for form inputs and other tags
        $('.editable').toggleClass('show', editable);
        $('.this-role-form-field').prop('disabled', !editable);
        $('#deactivateProfile').toggleClass('d-none', editable);
        $('#resetPwdBtn').toggleClass('d-none', editable);
        $('#updateProfile').toggleClass('d-none', !editable);
        // Change Button HTML
        if (editable) editProfileBtn.html('Cancel');
        else editProfileBtn.html('Edit Profile');
        // Unbind previous event
        editProfileBtn.unbind('click');
        // Bind again with contrary boolean
        editProfileBtn.click(function () {
            toggleProfileEditable(!editable);
        });
    }

    toggleProfileEditable();
});