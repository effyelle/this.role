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

    function game(int $id): string
    {
        if (isset($_SESSION['user'])) return (new Games)->game($id);
        return template('login', ['unlogged' => 'unlogged']);
    }

    function game_ajax(string $route): void
    {
        if (isset($_SESSION['user'])) echo (new Games)->$route();
        echo json_encode(['response' => false, 'msg' => 'Your session has expired']);
    }

    function admin($switch): string
    {
        if (isset($_SESSION['user'])) {
            $userRol = $_SESSION['user']['user_rol'];
            if ($userRol === 'admin' || $userRol === 'masteradmin') return (new Admin())->$switch();
        }
        return $this->index();
    }

    function pwd_email(): string
    {
        return view('templates/mail/reset_pwd_html.php', ['token' => '1234566789']);
    }

    function conf_account_email(): string
    {
        return view('templates/mail/confirm_account_html.php', ['token' => '1234567890']);
    }

    function send_confirmation_email(): string
    {
        if (isset($_POST['email']) && $this->validate(['email' => 'required | valid_email'], ['email' => $_POST['email']])) {
            if (model('UsersModel')->get(['user_email' => $_POST['email']])) {
                if ((new Account())->sendConfirmationEmail($_POST['email'])) {
                    return template('tokens/email_sent', ['unlogged' => 'unlogged']);
                }
            }
            return template('tokens/confirm_problem', ['unlogged' => 'unlogged', 'problem' => 'Email given is not registered . ']);
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
            $user = model('UsersModel')->get(['user_email' => $email]);
            if ($user && count($user) === 1) {
                $username = $user[0]['user_username'];
                // Send reset mail
                if ((new Account())->sendResetPasswordEmail($email, $username)) {
                    return template('tokens/email_sent', ['unlogged' => 'unlogged']);
                }
                return template('tokens/confirm_problem', ['unlogged' => 'unlogged', 'problem' => 'Email could not be sent']);
            }
            return template('tokens/confirm_problem', ['unlogged' => 'unlogged', 'problem' => 'Email given is not registered . ']);
        }
        return template('tokens/token_expired', ['unlogged' => 'unlogged']);
    }

    /**
     * AJAX call to resend email confirmation link
     *
     * @return void
     */
    function resend_email_confirmation(): void
    {
        if (isset($_SESSION['user'])) {
            $email_response = (new Account())->sendConfirmationEmail($_SESSION['user']['user_email'], $_SESSION['user']['user_username']);
            if ($email_response === true) {
                echo json_encode([
                    'response' => true,
                    'msg' => 'Your email was updated, an email has been sent for confirmation']);
                return;
            }
            echo json_encode([
                'response' => false,
                'msg' => $email_response === false
                    ? 'There was a problem adding the token'
                    : 'There was an error sending the email'
            ]);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'It seems like you\'re not logged in']);
    }

    function pwd_was_resetted(): string
    {
        return template('tokens/pwd_was_resetted', ['unlogged' => 'unlogged']);
    }
}
