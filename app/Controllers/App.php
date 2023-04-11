<?php

namespace App\Controllers;

class App extends BaseController
{
    public function __construct()
    {
        if (check_session()) {
            user_exists();
        }
    }

    public function hola(): bool
    {
        var_dump($_SESSION);
        return true;
    }

    public function index(): string
    {
        if (isset($_SESSION['user'])) {
            return template();
        }
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
        if (isset($_SESSION['user'])) session_destroy();
        return template('login');
    }

    function about(): string
    {
        if (isset($_SESSION['user'])) return template('about');
        return template('login');
    }

    function myprofile(): string
    {
        if (isset($_SESSION['user'])) return template('profile');
        return template('login');
    }

    function games_list(): string
    {
        if (isset($_SESSION['user'])) return (new Games)->list();
        return template('login');
    }

    function admin($switch): string
    {
        if (isset($_SESSION['user'])) {
            return (new AdminUsers())->$switch();
        }
        return template('login');
    }
}
