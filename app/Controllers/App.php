<?php

namespace App\Controllers;

class App extends BaseController
{

    public function index(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('login');
    }

    function login(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('login');
    }

    function signup(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('signup');
    }

    function logout(): string
    {
        session_destroy();
        return template('login');
    }

    function about(): string
    {
        if (isset($_SESSION['user'])) return template('about');
        return template('login');
    }

}
