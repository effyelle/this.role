document.addEventListener('DOMContentLoaded', function () {
    const userEditBtn = $('.usernameBtn');

    $('.this-role-form-field').keypress(function (e) {
        if (e.originalEvent.key === 'Enter') e.preventDefault();
    });

    for (let i = 0; i < userEditBtn.length; i++) {
        userEditBtn[i].addEventListener('click', function () {
            let user = usersData[this.value];
            $('#user').val(user.user_id);
            $('#username').val(user.user_username);
            $('#fname').val(user.user_fname);
            $('#email').val(user.user_email);
            $('#user_rol').val(user.user_rol);
            $('#user_status').val(user.user_deleted ? 'inactive' : 'active');
        });
    }

    $('#save_user_btn').click(function () {
        toggleProgressSpinner(true);
        let form = getForm('#edit_user');
        ajax("/app/admin_ajax/update_user", form).done((data) => {
            if (data.response) {
                $('#modal_success-toggle').click();
                if (data.msg && typeof data.msg === 'object' && data.msg.length !== 0) {
                    const response = data['msg'];
                    let totalResponse = '<b>The following errors where encountered:</b>';
                    for (let i in response) {
                        totalResponse += '<br/>' + response[i];
                    }
                    $('.modal_success_response').html(totalResponse);
                }
            } else {
                $('#modal_error-toggle').click();
                $('#modal_error .modal_error_response').html(data['msg']);
            }
            toggleProgressSpinner(false);
        }).fail((e) => {
            toggleProgressSpinner(false);
            console.log(e.responseText);
        });
    });

    const issueExpand = $('#msgs_list .menu-accordion .menu-link.open-link');
    const msgDisplay = $('#msgs_list .msg-display');
    const msgContent = $('.msg-content');

    for (let i = 0; i < issueExpand.length; i++) {
        $('.send_answer_btn')[i].addEventListener('click', function () {
            let answer = $('.issue_answer')[i].value;
            if (answer.length > 0) {
                ajax("/account/send_issue_msg", {
                    "msg": answer,
                    "issue_id": $('.issue_id')[i].value
                }).done((data) => {
                    console.log(data);
                    $('#modal_success-toggle').click();
                }).fail((e) => {
                    $('#modal_error-toggle').click();
                    console.log(e.responseText);
                });
            }
        });
        issueExpand[i].addEventListener('click', function () {
            issueExpand[i].classList.toggle('show');
            msgDisplay[i].classList.toggle('show');
            let totalHeight = '0';
            let content = '';
            if (msgDisplay[i].classList.contains('show')) {
                let messages = JSON.parse(messagesData[i].issue_msg);
                for (let j = 0; j < messages.length; j++) {
                    content += formatMessage(messages[j]);
                }
                totalHeight = $('.msg_textarea')[i].offsetHeight + 20;
            }
            msgContent[i].innerHTML = content;
            totalHeight += msgContent[i].offsetHeight;
            msgDisplay[i].style.height = totalHeight + 'px'; // calculate heights of children
        });
    }

    function formatMessage(message) {
        return '' +
            '<div class="d-flex flex-row align-items-start gap-5">' +
            '   <span class="menu-title fw-bolder">' + message.sender + '</span>' +
            '   <span class="d-flex flex-row justify-content-between align-items-center w-100">' +
            '       <span class="">' + message.msg + '</span>' +
            '       <i class="fs-8 col-3 text-end">' + message.time + '</i>' +
            '   </span>' +
            '</div>';
    }
});