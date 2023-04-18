<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header align-content-center">
                <div class="mx-auto w-100">
                    <div class="d-flex flex-row-wrap justify-content-between align-items-stretch align-content-center">
                        <div class="card-toolbar gap-5">
                            <h2>My Messages</h2>
                        </div>
                    </div>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="mx-auto w-100 card-body">
                <!--begin::Col-->
                <!--begin::Col-->
                <div id="user-msgs">
                    <?php if (isset($issues_list) && is_array($issues_list) && count($issues_list) > 0): ?>
                        <table id="msgs_list"
                               class="table align-middle table-row-dashed show-search-dt no-footer">
                            <tbody>
                            <?php foreach ($issues_list as $k => $issue) {
                                echo '<tr>'
                                    . '   <td class="menu-item menu-accordion">'
                                    . '       <div class="text-muted text-hover-info cursor-pointer menu-link open-link">'
                                    . '           <span class="menu-title text-uppercase fs-3">' . $issue['issue_title'] . '</span>'
                                    . '           <span><i>Issue started by </i><b>' . $issue['issue_user'] . '</b></span>'
                                    . '           <span class="menu-arrow">'
                                    . '               <input class="d-none issue_id" value="' . $issue['issue_id'] . '"/>'
                                    . '           </span>'
                                    . '       </div>'
                                    . '       <div class="menu-sub menu-sub-accordion overflow-transition msg-display">'
                                    . '       <div class="msg-content px-6"></div>'
                                    . '           <div class="menu-item msg_textarea pt-5">'
                                    . '               <span class="menu-link">'
                                    . '                   <textarea placeholder="Your message..." rows="3" style="resize: none"'
                                    . '                       class="form-control form-control-solid this-role-form-field issue_answer menu-title"></textarea>'
                                    . '               </span>'
                                    . '               <button class="btn btn-primary ms-8 send_answer_btn">Send</button>'
                                    . '           </div>'
                                    . '       </div>'
                                    . '   </td>'
                                    . '</tr>';
                            } ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <div class="text-center">
                            <h2>You have no issues unresolved!</h2>
                        </div>
                    <?php endif; ?>
                </div>
                <!--end::Col-->
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
        const messagesData =<?php echo json_encode($issues_list ?? '{}');?>;
        const issueExpand = $('#msgs_list .menu-accordion .menu-link.open-link');
        const msgDisplay = $('#msgs_list .msg-display');
        const msgContent = $('.msg-content');

        for (let i = 0; i < issueExpand.length; i++) {
            $('.send_answer_btn')[i].addEventListener('click', function () {
                let answer = $('.issue_answer')[i];
                if (answer.value.length > 0) {
                    $.ajax({
                        type: "post",
                        url: "/account/send_issue_msg",
                        data: {
                            "msg": answer.value,
                            "issue_id": $('.issue_id')[i].value
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            if (data['response']) {
                                $('#modal_success-toggle').click();
                                $('#modal_data_sent')
                            }
                        }
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
                '<div class="d-flex flex-row align-items-center gap-5">' +
                '   <span class="menu-title fw-bolder">' + message.sender + '</span>' +
                '   <span class="d-flex flex-row justify-content-between align-items-center w-100">' +
                '       <span class="">' + message.msg + '</span>' +
                '       <i class="fs-8">' + message.time + '</i>' +
                '   </span>' +
                '</div>';
        }
    });
</script>