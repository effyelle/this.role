<!--begin::Row-->
<div class="row g-5 g-lg-10">
    <!--begin::Col-->
    <div class="mb-xl-10">
        <!--begin::List Widget 6-->
        <div class="card h-100vh">
            <!--begin::Header-->
            <div class="card-header border-0">
                <div class="card-toolbar gap-5">
                    <h2>My Profile</h2>
                </div>
            </div>
            <!--end::Header-->
            <div class="card-body px-xxs-1 mx-sm-12 tab-content">
                <!--begin::Tabs-->
                <ul class="nav nav-tabs nav-line-tabs mb-5 fs-xxs-8 fs-6">
                    <li class="nav-item">
                        <a class="nav-link <?= isset($tab) && $tab === 'myprofile' ? ' active' : "" ?>"
                           data-bs-toggle="tab" href="#myprofile">My Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= isset($tab) && $tab === 'myissues' ? ' active' : "" ?>"
                           data-bs-toggle="tab" href="#myissues">My issues</a>
                    </li>
                </ul>
                <!--end::Tabs-->
                <?php
                $profile = APPPATH . 'Views/pages/user_profile/profile.php';
                if (is_file($profile)) include $profile;
                $issues = APPPATH . 'Views/pages/user_profile/issues.php';
                if (is_file($profile)) include $issues;
                ?>
            </div>
        </div>
        <!--end::List Widget 6-->
    </div>
    <!--end::Col-->
</div>
<!--end::Row-->