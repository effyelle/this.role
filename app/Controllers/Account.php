<?php

namespace App\Controllers;

class Account extends BaseController
{
    protected $model;

    /**
     * Construct of this class will always set up users model.
     */
    public function __construct()
    {
        $this->model = model('UsersModel');
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * LOGIN
     * -----------------------------------------------------------------------------------------------------------------
     * Verify user exists and password is correct and send a response through json_encode. This function is to be called
     * from a Javascript AJAX.
     *
     * @params @_POST['username'] -username to check account exists
     * @params @_POST['pwd'] -password to verify
     *
     * After login, the user data will be saved in @_SESSION. Session has to be already initialized at this point.
     *
     * @return void
     */
    function login(): void
    {
        $username = $_POST['username'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($username && $pwd) {
            if ($user = $this->model->get($username)) {
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
        echo json_encode(['response' => false]);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * SIGNUP
     * -----------------------------------------------------------------------------------------------------------------
     * Checks is username and email already exist in Database. If they don't,
     *
     * @params @_POST['username']
     * @params @_POST['email']
     * @params @_POST['pwd']
     *
     * @return void
     */
    function signup(): void
    {
        $user = $_POST['username'] ?? false;
        $email = $_POST['email'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if (!($user && $email && $pwd)) {
            echo json_encode(['response' => false, 'msg' => 'Some or all fields are empty.']);
            return;
        }
        if ($this->model->get($user)) {
            echo json_encode(['response' => false, 'msg' => 'A user with that username already exists.']);
            return;
        }
        if ($this->model->get($user, $email)) {
            echo json_encode(['response' => false, 'msg' => 'That email is already in use.']);
            return;
        }
        if ($this->send_confirmation_email($email)) {
            $pwd = password_hash($pwd, PASSWORD_DEFAULT);
            if ($id = $this->model->new($user, $email, $pwd)) {
                echo json_encode(['response' => true, 'id' => $id]);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'User could not be added']);
        }
        echo json_encode(['response' => false, 'msg' => 'Mail could not be sent']);
    }

    function created(): string
    {
        return template('account_created');
    }

    function my_profile(): void
    {
        if (isset($_SESSION['user'])) {
            $user = $this->model->get($_SESSION['user']['username']);
            echo json_encode(['response' => true, 'user' => $user]);
            return;
        }
        echo json_encode(['response' => false]);
    }

    public function generateToken(): string
    {
        return time();
    }

    public function send_confirmation_email($email): bool
    {
        $token = $this->generateToken();
        $to = 'ericapastorgracia@gmail.com';
        $email = \Config\Services::email();
        $email->setTo($to);
        $email->setSubject('Confirm Your Account');
        $email->setMessage(view('templates/mail/confirm_account_html', ['token' => $token]));
        $email->setAltMessage(view('templates/mail/confirm_account_txt', ['token' => $token]));
        $email->setReplyTo(null);
        return $email->send();
    }

    function read_file()
    {
        echo file_get_contents(__DIR__ . '/../Views/templates/mail/confirm_account.html', true);
        //echo file_get_contents(__DIR__ . '/../Views/templates/mail/confirm_account.txt', true);
    }
}