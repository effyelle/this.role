<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header">
                <div class="card-toolbar gap-5">
                    <h2><?= $title ?></h2>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body mx-12">
                <table id="users-admin_table"></table>
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
        $.ajax({
            type: "post",
            url: "/app/admin/users",
            success: function (data) {
                console.log(data);
            }
        })

        $('#users-admin_table').DataTable({
            ajax: '/app/admin/users',
            columns: [
                {title: "Full Name", data: "user_fname"},
                {title: "Username", data: "user_username"},
                {title: "Email", data: "user_email"},
                {title: "Confirmed", data: "user_confirmed_acc"},
                {title: "Deleted", data: "user_deleted"}
            ]
        });
    });
</script>