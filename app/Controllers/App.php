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
        return template('login', ['unlogged' => true]);
    }

    function login(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('login', ['unlogged' => true]);
    }

    function signup(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('signup', ['unlogged' => true]);
    }

    function logout(): string
    {
        if (isset($_SESSION['user'])) session_destroy();
        return template('login', ['unlogged' => true]);
    }

    function about(): string
    {
        if (isset($_SESSION['user'])) return template('about');
        return template('login', ['unlogged' => true]);
    }

    function myprofile(): string
    {
        if (isset($_SESSION['user'])) return template('profile');
        return template('login', ['unlogged' => true]);
    }

    function games_list(): string
    {
        if (isset($_SESSION['user'])) return (new Games)->list();
        return template('login', ['unlogged' => true]);
    }

    function admin($switch): string
    {
        if (isset($_SESSION['user'])) {
            return (new AdminUsers())->$switch();
        }
        return template('login', ['unlogged' => true]);
    }

    function send_confirmation_email()
    {
        if (isset($_POST['email']) && $this->validate(['email' => 'required|valid_email'], ['email' => $_POST['email']])) {
            if ((new Account())->sendConfirmationEmail($_POST['email'])) {
                return template('tokens/account_created', ['unlogged' => true]);
            }
        }
        return template('tokens/token_expired', ['unlogged' => true]);
    }
}
