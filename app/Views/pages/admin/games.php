<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header">
                <div class="card-toolbar gap-5">
                    <h2><?= $title ?? '' ?></h2>
                </div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body px-xxs-1 mx-sm-12 tab-content">
                <?php if (isset($games_list) && is_array($games_list) && count($games_list) > 0): ?>
                    <table id="msgs_list"
                           class="table align-middle table-row-dashed show-search-dt no-footer dataTable generate-datatable">
                        <thead>
                        <tr class="fw-bold fs-7 text-gray-800">
                            <td></td>
                            <td>Game Title</td>
                            <td>Game Creator</td>
                            <td>Delete</td>
                        </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($games_list as $k => $game) {
                            echo '<tr class="fs-8">'
                                . '   <td>'
                                . '      <div class="symbol symbol-25px circle">'
                                . '         <span class="symbol-15px symbol-label circle avatar-input-holder"'
                                . '              style="background: url(' . ($game['game_icon'] ?? '') . '); background-size: cover;">'
                                . '         </span>'
                                . '      </div>'
                                . '   </td>'
                                . '   <td>' . $game['game_title'] . '</td>'
                                . '   <td>' . $game['user_username'] . '</td>'
                                . '   <td>'
                                . '      <button class="btn btn-sm btn-warning px-3">'
                                . '         <i class="fa-solid fa-trash"></i>'
                                . '      </button>'
                                . '   </td>'
                                . '</tr>';
                        } ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <div class="text-center">
                        <h2>No data available</h2>
                    </div>
                <?php endif; ?>
            </div>
            <!--end::Body-->
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->