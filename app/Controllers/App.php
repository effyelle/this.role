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
        if (isset($_SESSION['user'])) return (new Account)->update_profile();
        return template('login', ['unlogged' => true]);
    }

    function games_list(): string
    {
        if (isset($_SESSION['user'])) return (new Games)->list();
        return template('login', ['unlogged' => true]);
    }

    function admin($switch): string
    {
        if (isset($_SESSION['user']) && $_SESSION['user']['rol'] !== 'user') {
            return (new AdminUsers())->$switch();
        }
        return $this->index();
    }

    function send_confirmation_email(): string
    {
        if (isset($_POST['email']) && $this->validate(['email' => 'required|valid_email'], ['email' => $_POST['email']])) {
            if (model('UsersModel')->get(null, $_POST['email'])) {
                if ((new Account())->sendConfirmationEmail($_POST['email'])) {
                    return template('tokens/email_sent', ['unlogged' => true]);
                }
            }
            return template('tokens/confirm_problem', ['unlogged' => true, 'problem' => 'Email given is not registered.']);
        }
        return template('tokens/token_expired', ['unlogged' => true]);
    }

    function reset_pwd(): string
    {
        return template('tokens/reset_password_request', ['unlogged' => true]);
    }

    function send_reset_pwd(): string
    {
        // Check email is not empty and is valid
        if (isset($_POST['email'])) {
            $email = validate($_POST['email']);
            // Check email is in Database
            if (model('UsersModel')->get($email)) {
                // Send reset mail
                if ((new Account())->sendResetPasswordEmail($email)) {
                    return template('tokens/email_sent', ['unlogged' => true]);
                }
                return template('tokens/confirm_problem', ['unlogged' => true, 'problem' => 'Email could not be sent']);
            }
            return template('tokens/confirm_problem', ['unlogged' => true, 'problem' => 'Email given is not registered.']);
        }
        return template('tokens/token_expired', ['unlogged' => true]);
    }

    function pwd_was_resetted(): string
    {
        return template('tokens/pwd_was_resetted', ['unlogged' => true]);
    }
}
