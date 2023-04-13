<?php

namespace App\Controllers;

class Account extends BaseController
{
    protected mixed $usermodel;
    protected mixed $tokenmodel;
    protected mixed $mailer;
    protected string $now;

    /**
     * Construct of this class will always set up users model and the mailer.
     */
    public function __construct()
    {
        $this->usermodel = model('UsersModel');
        $this->tokenmodel = model('TokenModel');
        $this->mailer = \Config\Services::email();
        $this->now = date('Y-m-d H:i:s', time());
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
            if ($user = $this->usermodel->get($username, null, false)) {
                echo json_encode(['response' => false, 'msg' => 'This account has not been activated.', 'email' => $user['user_email']]);
                return;
            }
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
            }
        }
        echo json_encode(['response' => false]);
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
                echo json_encode(['response' => true, 'msg' => 'All good']);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'User could not be added']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Mail could not be sent']);
    }

    function update(): string
    {
        if (isset($_SESSION['user'])) {
            if (isset($_FILES['avatar'])) {
                var_dump($_FILES);
                echo "<br> UPLAOD == <br>";
                var_dump(upload_img('avatar', '/assets/media/avatars'));
            }
            return '';
            return template('profile');
        }
        return template('login', ['unlogged' => true]);
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
        if (!$token) return false;
        // Send email
        $to = $email;
        $this->mailer->setTo($to);
        $this->mailer->setSubject('Confirm Your Account');
        $this->mailer->setMessage(view('templates/mail/confirm_account_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/confirm_account_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        return $this->mailer->send();
    }

    function send_reset_password_email($email): void
    {
        if ($this->sendResetPasswordEmail($email)) {
            echo json_encode(['response' => true, 'msg' => 'An email has been sent to reset your password.']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'There was an error sending the email']);
    }

    function sendResetPasswordEmail($email): bool
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $to = $email;
        $this->mailer->setTo($to);
        $this->mailer->setSubject('Password Reset');
        $this->mailer->setMessage(view('templates/mail/reset_pwd_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/reset_pwd_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        return $this->mailer->send();
    }

    public function confirm($token): string
    {
        $t = $this->tokenmodel->get($token);
        if (!$t) return template('tokens/token_expired', ['unlogged' => true]);
        // Update data
        if (!$this->usermodel->updt([
            'user_email' => $t['token_user'],
            'user_confirmed' => $this->now
            // Return an error view if the update went wrong
        ])) return template('tokens/confirm_problem', ['unlogged' => true]);
        // Expire token if
        $this->tokenmodel->del($token);
        return template('tokens/account_confirmed', ['unlogged' => true]);
    }

    public function resetpwd($token): string
    {
        // Declare data
        $data = ['unlogged' => true, 'token' => $token];
        // Exit if token has expired
        if (!$this->tokenmodel->get($token)) return template('tokens/token_pwd_expired', $data);
        return template('tokens/new_password', $data);

    }

    function reset_password(): void
    {
        // Check request fields
        if (isset($_POST['pwd']) && isset($_POST['token'])) {
            // Hash new password
            $hash = password_hash($_POST['pwd'], PASSWORD_DEFAULT);
            // Get email from token
            $email = $this->tokenmodel->get($_POST['token'])['token_user'];
            // Update fields
            echo $this->now;
            if ($this->usermodel->updt(
                ['user_pwd' => $hash, 'user_confirmed' => $this->now],
                ['user_email' => $email]
            )) {
                // If fields were updated, expire token and destroy any session that could exist
                $this->tokenmodel->updt(['token_expires' => $this->now], ['token' => $_POST['token']]);
                if (isset($_SESSION['user'])) session_destroy();
                echo json_encode(['response' => true]);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'There was a problem in database']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Fields are missing', 'data' => $_POST]);
    }

    function created(): string
    {
        return template('tokens/email_sent', ['unlogged' => true]);
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