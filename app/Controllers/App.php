<?php

namespace App\Controllers;

class App extends BaseController
{

    public function index(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('signin');
    }

    public function dev_index(): string
    {
        $_SESSION['user'] = 'effy';
        return template();
    }

    function signin(): string
    {
        return template('signin');
    }

    function logout(): string
    {
        session_destroy();
        return template('signin');
    }

    function about(): string
    {
        return template('about');
    }

}
