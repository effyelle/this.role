<?php

namespace App\Controllers;

class App extends BaseController
{

    public function index(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('login');
    }

    public function dev_index(): string
    {
        $_SESSION['user'] = 'effy';
        return template();
    }

    function login(): string
    {
        return template('login');
    }

    function logout(): string
    {
        session_destroy();
        return template('login');
    }

    function about(): string
    {
        return template('about');
    }

}
