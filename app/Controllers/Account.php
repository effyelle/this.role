<?php

namespace App\Controllers;

use Config\Paths;

class Account extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = model('UsersModel');
    }

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
                echo json_encode(['response' => false, 'pwd_incorrect' => $user]);
                return;
            }
            echo json_encode(['response' => false, 'user_not_found' => [$username, $pwd]]);
            return;
        }
        echo json_encode(['response' => false]);
    }

    function signup(): void
    {
        $user = $_POST['username'] ?? false;
        $email = $_POST['email'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($user && $email && $pwd) {
            if ($this->send_confirmation()) {
                $pwd = password_hash($pwd, PASSWORD_DEFAULT);
                if ($id = $this->model->new($user, $email, $pwd)) {
                    echo json_encode(['response' => true, 'id' => $id]);
                    return;
                }
                echo json_encode(['response' => false, 'msg' => 'User could not be added']);
            }
            echo json_encode(['response' => false, 'msg' => 'Mail could not be sent']);
        }
        echo json_encode(['response' => false, 'msg' => 'Some or all fields are empty']);
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

    public function send_confirmation($token): bool
    {
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