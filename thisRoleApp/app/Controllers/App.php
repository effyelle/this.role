<?php

namespace App\Controllers;

/**
 * This is the controller that almost 90% of the application requests go through. The reason for that is that the
 * session checks are done in the constructor. if a user is logged in, the time elapsed since the last activity that
 * the user had on the page is checked through the {@link Common::check_user()} method, and if the user still exists
 * through the {@link Common::user_exists()} method. These functions are global (created in the /app/Common.php file),
 * so you can use them from any application file if you need to. check_user() is also in charge of updating the session
 * data in real time, which allows knowing if the user is logged in or not before loading any information anywhere on
 * the web.
 */
class App extends BaseController
{
    public function __construct()
    {
        if (check_session()) {
            user_exists();
        }
    }

    /**
     * ---
     * INDEX VIEW
     * ---
     * Return to index if user is logged, return to login form if not.
     *
     * @return string
     */
    public function index(): string
    {
        if (isset($_SESSION['user'])) {
            return template();
        }
        return template('login', ['unlogged' => 'unlogged']);
    }

    /**
     * ---
     * LOGIN VIEW
     * ---
     * Call {@link index()}.
     *
     * @return string
     */
    function login(): string
    {
        return $this->index();
    }

    /**
     * ---
     * SIGNUP VIEW
     * ---
     * If user is logged return to index, if not, return to the sign up form.
     *
     * @return string
     */
    function signup(): string
    {
        if (isset($_SESSION['user'])) {
            return template();
        }
        return template('signup', ['unlogged' => 'unlogged']);
    }

    /**
     * ---
     * LOG OUT VIEW
     * ---
     * Destroy session if there is a user logged in. Return to login form via {@link index()}.
     *
     * @return string
     */
    function logout(): string
    {
        if (isset($_SESSION['user'])) session_destroy();
        return $this->index();
    }

    /**
     * ---
     * ABOUT VIEW
     * ---
     * If user is logged return to the About page, if not, call {@link index()}.
     *
     * @return string
     */
    function about(): string
    {
        if (isset($_SESSION['user'])) return template('about');
        return $this->index();
    }

    /**
     * ---
     * MY PROFILE VIEW
     * ---
     * If user is logged return to My Profile page, if not, call {@link index()}.
     *
     * @return string
     */
    function myprofile(): string
    {
        if (isset($_SESSION['user'])) return (new Account)->profile_issues();
        return $this->index();
    }

    /**
     * ---
     * MY ISSUES VIEW
     * ---
     * If user is logged return to My Messages page, if not, call {@link index()}.
     *
     * @return string
     */
    function myissues(): string
    {
        if (isset($_SESSION['user'])) return (new Account)->profile_issues('myissues');
        return $this->index();
    }

    /**
     * ---
     * GAMES
     * ---
     * If user is logged call first parameter as a function of \App\Controllers\Games and give second paramater $id as
     * paramater of that function. If user is not logged call {@link index()}.
     *
     *
     * @param string $route
     * @param int|null $id
     *
     * @return string
     */
    function games(string $route, int $id = null): string
    {
        if (isset($_SESSION['user'])) {
            return (new Games)->$route($id);
        }
        return $this->index();
    }

    /**
     * ---
     * GAMES AJAX CALLS
     * ---
     * If user is logged, print the function of \App\Controllers\Games given as first parameter with second parameter
     * as that function's parameter. If user is not logged, print a response with that information.
     *
     * @param string $route
     * @param int|null $id
     *
     * @return void
     */
    function games_ajax(string $route, int $id = null): void
    {
        if (isset($_SESSION['user'])) {
            echo (new Games)->$route($id);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'It seems you\'re not logged in']);
    }

    /**
     * ---
     * GAME VIEW
     * ---
     * If user is logged return to the game view page, and if not, call {@link index()}.
     *
     *
     * @param int $id
     *
     * @return string
     */
    function game(int $id): string
    {
        if (isset($_SESSION['user'])) {
            return (new Games)->game($id);
        }
        return $this->index();
    }

    /**
     * ---
     * GAME AJAX CALLS
     * ---
     * If user is logged, print the function of \App\Controllers\Games given as first parameter.
     *
     * If user is not logged, print a response with that information.
     *
     * @param string $route
     *
     * @return void
     */
    function game_ajax(string $route): void
    {
        if (isset($_SESSION['user'])) {
            echo (new Games)->$route();
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Your session has expired']);
    }

    /**
     * ---
     * ADMIN FUNCTIONS
     * ---
     * Checks if user is logged and has permission to access the \App\Controllers\Admin functions.
     *
     * If both true, redirect to the \App\Controllers\Admin function given as parameter.
     *
     * If any of them is false, call {@link index()}
     *
     * @param $switch
     *
     * @return string
     */
    function admin($switch): string
    {
        if (isset($_SESSION['user'])) {
            $userRol = $_SESSION['user']['user_rol'];
            if ($userRol === 'admin' || $userRol === 'masteradmin') return (new Admin())->$switch();
        }
        return $this->index();
    }

    /**
     * ---
     * ADMIN FUNCTIONS AJAX
     * ---
     * Checks if user is logged and has permission to access the \App\Controllers\Admin functions.
     *
     * If both true, print the \App\Controllers\Admin function response.
     *
     * If any of them false, print an appropiate message.
     *
     * @param $route
     *
     * @return void
     */
    function admin_ajax($route): void
    {
        if (isset($_SESSION['user'])) {
            $userRol = $_SESSION['user']['user_rol'];
            if ($userRol === 'admin' || $userRol === 'masteradmin') {
                if ($route) echo (new Admin())->$route();
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'You don\'t have permission to do that.']);
        }
        echo json_encode(['response' => false, 'msg' => 'Your session has expired']);
    }

    /**
     * ---
     * CONFIRMATION ACCOUNT VIEW
     * ---
     *
     * @return string
     */
    function conf_account_email(): string
    {
        return view('templates/mail/confirm_account_html.php', ['token' => $this->now]);
    }

    /**
     * ---
     * SEND ACCOUNT VERIFY EMAIL
     * ---
     *
     * @return string
     */
    function send_confirmation_email(): string
    {
        if (isset($_SESSION['user'])) {
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
        return $this->index();
    }

    /**
     * ---
     * RESEND ACCOUNT VERIFY EMAIL
     * ---
     * This is an AJAX call
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

    /**
     * ---
     * PASSWORD RESET FORM VIEW
     * ---
     * Form to update password
     *
     * @return string
     */
    function pwd_email(): string
    {
        return view('templates/mail/reset_pwd_html.php', ['token' => $this->now]);
    }

    /**
     * ---
     * RESET PASSWORD REQUEST VIEW
     * ---
     * Form to request a password change
     *
     * @return string
     */
    function reset_pwd(): string
    {
        return template('tokens/reset_password_request', ['unlogged' => 'unlogged']);
    }

    /**
     * ---
     * PASSWORD RESETTED VIEW
     * ---
     *
     * @return string
     */
    function pwd_was_resetted(): string
    {
        return template('tokens/pwd_was_resetted', ['unlogged' => 'unlogged']);
    }

    /**
     * ---
     * SEND RESET PASSWORD EMAIL
     * ---
     *
     * @return string
     */
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
}
