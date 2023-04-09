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