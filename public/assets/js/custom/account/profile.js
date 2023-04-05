document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        type: "post",
        url: "/account/my_profile",
        dataType: "json",
        success: formatProfile
    });

    function formatProfile(data) {
        if (data['response']) {
            let user = data['user'];
            $('#fname').val(user['fname']);
            $('#username').val(user['username']);
            $('#email').val(user['email']);
            formatAvatar('/assets/uploads/avatars/' + user['avatar']);
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