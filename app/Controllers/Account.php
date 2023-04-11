<?php

namespace App\Controllers;

class Account extends BaseController
{
    protected mixed $usermodel;
    protected mixed $tokenmodel;
    protected mixed $mailer;

    /**
     * Construct of this class will always set up users model and the mailer.
     */
    public function __construct()
    {
        $this->usermodel = model('UsersModel');
        $this->tokenmodel = model('TokenModel');
        $this->mailer = \Config\Services::email();
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * LOGIN
     * -----------------------------------------------------------------------------------------------------------------
     * Verify user exists and password is correct and send a response through json_encode. This function is to be called
     * from a Javascript AJAX.
     *
     * -----------------------------------------------------------------------------------------------------------------
     * Parameters via $_REQUEST:
     * - $_POST['username']: username to check account exists
     * - $_POST['pwd']: password to verify
     *
     * -----------------------------------------------------------------------------------------------------------------
     * After login, the user data will be saved in $_SESSION. Session has to be already initialized at this point.
     *
     * @return void
     */
    function login(): void
    {
        $username = $_POST['username'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($username && $pwd) {
            if ($user = $this->usermodel->get($username)) {
                if (password_verify($pwd, $user['user_pwd'])) {
                    $_SESSION['user'] = [
                        'id' => $user['user_id'],
                        'fname' => $user['user_fname'],
                        'username' => $user['user_username'],
                        'avatar' => $user['user_avatar'],
                        'email' => $user['user_email'],
                        'rol' => $user['user_rol']
                    ];
                    echo json_encode(['response' => true]);
                    return;
                }
                echo json_encode(['response' => false, 'msg' => 'Password is incorrect.']);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'User not found.']);
            return;
        }
        echo json_encode(['response' => false, 'data'=>[$username, $pwd]]);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * SIGNUP
     * -----------------------------------------------------------------------------------------------------------------
     * Checks is username and email already exist in Database. If they don't, attempts to create a new user.
     *
     * -----------------------------------------------------------------------------------------------------------------
     * Parameters via $_REQUEST:
     * - $_POST['username']
     * - $_POST['email']
     * - $_POST['pwd']
     *
     * @return void
     */
    function signup(): void
    {
        $user = $_POST['username'] ?? false;
        $email = $_POST['email'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        // Check fields
        if (!($user && $email && $pwd)) {
            echo json_encode(['response' => false, 'msg' => 'Some or all fields are empty.']);
            return;
        }
        // Check username
        if ($this->usermodel->get($user)) {
            echo json_encode(['response' => false, 'msg' => 'That username has already been chosen.']);
            return;
        }
        // Check email
        if ($this->usermodel->get($user, $email)) {
            echo json_encode(['response' => false, 'msg' => 'That email is already in use.']);
            return;
        }
        // Send confirmation email and insert new user into Database
        if ($this->sendConfirmationEmail($email)) {
            $pwd = password_hash($pwd, PASSWORD_DEFAULT);
            if ($this->usermodel->new($user, $email, $pwd)) {
                echo json_encode(['response' => true, 'msg' => '']);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'User could not be added']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Mail could not be sent']);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Generate Token for email
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param string $email
     * @return string|bool
     */
    private function generateToken(string $email): string|bool
    {
        $token = time();
        if ($this->tokenmodel->new($token, $email)) {
            return $token;
        }
        return false;
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Confirmation email
     * -----------------------------------------------------------------------------------------------------------------
     * Generates token and includes it in the email body sent to the address given.
     *
     * @param $email
     * @return bool
     */
    function sendConfirmationEmail($email): bool
    {
        // Generate token
        $token = $this->generateToken($email);
        var_dump($token);
        if (!$token) return false;
        // Send email
        echo '<br>here';
        $to = $email;
        $this->mailer->setTo($to);
        $this->mailer->setSubject('Confirm Your Account');
        $this->mailer->setMessage(view('templates/mail/confirm_account_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/confirm_account_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        return $this->mailer->send();
    }

    public function confirm($token): string
    {
        $t = $this->tokenmodel->get($token);
        if (!$t) return template('tokens/token_expired', ['unlogged' => true]);
        if (!$this->usermodel->confirmAccount($t['token_user'])) return template('tokens/confirm_problem', ['unlogged' => true]);
        $this->tokenmodel->del($token);
        return template('tokens/account_confirmed', ['unlogged' => true]);
    }

    function created(): string
    {
        return template('tokens/account_created');
    }

    function my_profile(): void
    {
        if (isset($_SESSION['user'])) {
            $user = $this->usermodel->get($_SESSION['user']['username']);
            echo json_encode(['response' => true, 'user' => $user]);
            return;
        }
        echo json_encode(['response' => false]);
    }
}