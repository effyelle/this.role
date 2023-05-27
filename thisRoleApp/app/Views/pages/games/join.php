<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh" id="update-profile">
            <!--begin::Body-->
            <div class="mx-auto card-body w-100">
                <div class="fs-1 flex-row-wrap align-items-center justify-content-center mt-20 text-center">
                    <!--begin::Indicator label-->
                    <span class="indicator-label"></span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <div class="indicator-progress">
                        Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </div>
                    <!--end::Indicator progress-->
                </div>
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
        toggleProgressSpinner();
        ajax("/app/games_ajax/ajax_join/<?=$game['game_id'] ?? null; ?>").done((data) => {
            if (data.response) {
                $('.indicator-label').html(
                    'You joined <?=$game['game_title'] ?? null; ?>' +
                    '<br/>' +
                    '<a href="<?= base_url() ?>/app/games/list">Go to My Games</a>'
                );
            } else $('.indicator-label').html(data.msg);
            toggleProgressSpinner(false);
        }).fail((e) => {
            console.log(e.responseText);
        });
    });
</script>