<?php

use \App\Controllers\App as app;

/*
 *---------------------------------------------------------------
 * TEMPLATE FOR VIEWS
 *---------------------------------------------------------------
 */

function template(string $page = 'home', $data = null): string
{
    $data = $data ?? [];
    if (!isset($data['title'])) $data['title'] = get_title($page);
    $data['page'] = $page;
    if (is_file(APPPATH . 'Views/pages/' . $page . '.php')) {
        return view('includes/head', $data)
            . view('includes/view_includes')
            . view('pages/' . $page)
            . view('templates/footer')
            . view('includes/foot');
    } else {
        return view('includes/head', $data)
            . view('includes/view_includes')
            . view('pages/view_not_found')
            . view('includes/foot');
    }
}

function get_title($str): string
{
    $split = explode('/', $str);
    $title = '';
    foreach ($split as $v) {
        $title .= ucfirst($v) . " ";
    }
    return trim($title);
}

function check_session(): bool
{
    /*
     * CONFIG TIMEOUT FOR SESSION
     */
    if (isset($_SESSION['session_last_activity']) && (time() - $_SESSION['session_last_activity']) > 1800) {// time() measure is in seconds
        session_unset();
        session_destroy();
        return false;
    }
    $_SESSION['session_last_activity'] = time();
    //echo 'session_last_activity: ' . $_SESSION['session_last_activity'];
    return true;
}

/*
 *---------------------------------------------------------------
 * CHECK USER STILL EXISTS AND HASN'T BEEN DELETED OR UPDATED
 *---------------------------------------------------------------
 */

function user_exists(): void
{
    if (isset($_SESSION['user'])) {
        $user = (model('\App\Models\UsersModel'))->get($_SESSION['user']['username']);
        if (!$user) {
            session_unset();
            session_destroy();
            session_start();
        }
    }
}

function upload_img($formname, $target_dir)
{
    $target_file = $target_dir . basename($_FILES[$formname]["name"]);
    // Save image file type
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    // Limit file types
    if (!preg_match('/jpg|png|jpeg|gif/', $imageFileType)) return 'Type not allowed';
    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES[$formname]["tmp_name"]);
    if (!$check) return 'Not an image';
    // Check image size
    if ($_FILES[$formname]["size"] > 500000) return 'File too large';
    // Change image name
    do {
        $new_filename = $target_dir . "/" . time() . "." . $imageFileType;
    } while (file_exists($new_filename));
    return move_uploaded_file($_FILES[$formname]["tmp_name"], $target_dir);
}