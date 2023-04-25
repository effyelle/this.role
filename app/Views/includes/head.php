<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>This.Role - <?php if (isset($title)) echo esc($title); ?></title>
    <link rel="icon" href="/assets/media/logos/icon64x64.png" sizes="64x64"/>

    <!-- begin::CustomFonts-->
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <!--end::CustomFonts-->

    <!--begin::Bootstrap-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
    <!--begin::Masterpanel Template-->
    <link href="/assets/plugins/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css"/>
    <link href="/assets/plugins/custom/formplugins/css/formplugins/bootstrap-datepicker/bootstrap-datepicker.css"
          rel="stylesheet" type="text/css"/>
    <link href="/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css"/>
    <link href="/assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css"/>
    <link href="/assets/css/style.bundle.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="/assets/css/custom_mp.css" type="text/css"/>
    <?php if (isset($_SESSION['user']['user_theme']) && $_SESSION['user']['user_theme'] === 'dark'): ?>
        <link rel="stylesheet" href="/assets/css/style.dark.bundle.css"/>
        <link rel="stylesheet" href="/assets/css/custom_mp.dark.css"/>
    <?php endif; ?>
    <!--end::CSSTemplates-->
</head>
<?php
$pageSplit = explode('/', ($page ?? ''));
$pageClass = $pageSplit[count($pageSplit) - 1];
?>
<body id="kt_body"
      class="header-fixed header-tablet-and-mobile-fixed bg-light-opacity-25 <?= $pageClass ?>">
<!--begin::Page Container-->
<div class="d-flex flex-column flex-root">
    <!--begin::Page-->
    <div class="page d-flex flex-row flex-column-fluid">
        <!--begin::Wrapper-->
        <div class="wrapper d-flex flex-column flex-row-fluid <?= $unlogged ?? ''; ?>"
             id="kt_wrapper">