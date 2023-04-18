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
        return template('login', ['unlogged' => 'unlogged']);
    }

    function login(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('login', ['unlogged' => 'unlogged']);
    }

    function signup(): string
    {
        if (isset($_SESSION['user'])) return template();
        return template('signup', ['unlogged' => 'unlogged']);
    }

    function logout(): string
    {
        if (isset($_SESSION['user'])) session_destroy();
        return template('login', ['unlogged' => 'unlogged']);
    }

    function about(): string
    {
        if (isset($_SESSION['user'])) return template('about');
        return template('login', ['unlogged' => 'unlogged']);
    }

    function myprofile(): string
    {
        if (isset($_SESSION['user'])) return (new Account)->updateProfile();
        return template('login', ['unlogged' => 'unlogged']);
    }

    function myissues(): string
    {
        if (isset($_SESSION['user'])) return (new Account)->myIssues();
        return template('login', ['unlogged' => 'unlogged']);
    }

    function games(): string
    {
        if (isset($_SESSION['user'])) return (new Games)->games();
        return template('login', ['unlogged' => 'unlogged']);
    }

    function admin($switch): string
    {
        if (isset($_SESSION['user'])) {
            $userRol = $_SESSION['user']['user_rol'];
            if ($userRol === 'admin' || $userRol === 'masteradmin') return (new Admin())->$switch();
        }
        return $this->index();
    }

    function send_confirmation_email(): string
    {
        if (isset($_POST['email']) && $this->validate(['email' => 'required|valid_email'], ['email' => $_POST['email']])) {
            if (model('UsersModel')->get(['user_email' => $_POST['email']])) {
                if ((new Account())->sendConfirmationEmail($_POST['email'])) {
                    return template('tokens/email_sent', ['unlogged' => 'unlogged']);
                }
            }
            return template('tokens/confirm_problem', ['unlogged' => 'unlogged', 'problem' => 'Email given is not registered.']);
        }
        return template('tokens/token_expired', ['unlogged' => 'unlogged']);
    }

    function reset_pwd(): string
    {
        return template('tokens/reset_password_request', ['unlogged' => 'unlogged']);
    }

    function send_reset_pwd(): string
    {
        // Check email is not empty and is valid
        if (isset($_POST['email'])) {
            $email = validate($_POST['email']);
            // Check email is in Database
            if (model('UsersModel')->get(['user_email'=>$email])) {
                // Send reset mail
                if ((new Account())->sendResetPasswordEmail($email)) {
                    return template('tokens/email_sent', ['unlogged' => 'unlogged']);
                }
                return template('tokens/confirm_problem', ['unlogged' => 'unlogged', 'problem' => 'Email could not be sent']);
            }
            return template('tokens/confirm_problem', ['unlogged' => 'unlogged', 'problem' => 'Email given is not registered.']);
        }
        return template('tokens/token_expired', ['unlogged' => 'unlogged']);
    }

    function pwd_was_resetted(): string
    {
        return template('tokens/pwd_was_resetted', ['unlogged' => 'unlogged']);
    }
}
