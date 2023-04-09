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
        session_destroy();
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

    function admin_users(): string
    {
        if (isset($_SESSION['user'])) return template('admin/users');
        return template('login');
    }

    function admin_games(): string
    {
        if (isset($_SESSION['user'])) return template('admin/games');
        return template('login');
    }

    function admin_patch_notes(): string
    {
        if (isset($_SESSION['user'])) return template('admin/patch');
        return template('login');
    }

    function admin($switch):string
    {
        if (isset($_SESSION['user'])) return (new Account())->$switch();
        return template('login');
    }
}
