<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card pb-4">
            <!--begin::Header-->
            <div class="card-header p-6">
                <h2><?= $game['game_title'] ?? '' ?></h2>
                <?php
                if ($game['game_creator'] === $_SESSION['user']['user_id']) {
                    echo '<button class="edit_game btn btn-sm btn-warning">Edit Game</button>'
                        . '<button class="edit_game btn btn-sm btn-primary d-none">Save</button>';
                }
                ?>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body">
                <div class="symbol symbol-200px float-left mb-5 me-10">
                    <span class="symbol-label circle"
                          style="background: url(<?= $game['game_icon'] ?? '' ?>) no-repeat; background-size: cover;"></span>
                </div>
                <h4>Details</h4>
                <p class="text-justify"><?= $game['game_details'] ?? '' ?></p>
            </div>
            <!--end:Body-->
            <?php var_dump($game) ?>
        </div>
    </div>
</div>