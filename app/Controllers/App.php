<?php

namespace App\Controllers;

class App extends BaseController
{
    public function __construct()
    {
        user_exists();
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
        return template('profile');
    }

    function games_list(): string
    {
        return (new Games)->list();
    }

    function admin_users():string
    {
        return template('admin/users');
    }

    function admin_games():string
    {
        return template('admin/games');
    }

    function admin_patch_notes():string
    {
        return template('admin/patch');
    }
}
