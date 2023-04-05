<?php

namespace App\Controllers;

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
                    ];
                    echo json_encode(['response' => true]);
                    return;
                }
                echo json_encode(['response' => false, 'user' => $user]);
                return;
            }
        }
        echo json_encode(['response' => false]);
    }

    function signup(): void
    {
        $user = $_POST['username'] ?? false;
        $email = $_POST['email'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($user && $email && $pwd) {
            $pwd = password_hash($pwd, PASSWORD_DEFAULT);
            if ($id = $this->model->new($user, $email, $pwd)) {
                echo json_encode(['response' => true, 'id' => $id]);
                return;
            }
        }
        echo json_encode(['response' => false]);
    }

    function created(): string
    {
        return template('account_created');
    }

    function my_profile()
    {
        if (isset($_SESSION['user'])) {
            $user = $this->model->get($_SESSION['user']['username']);
            echo json_encode(['response' => true, 'user' => $user]);
            return;
        }
        echo json_encode(['response' => false]);
    }

}