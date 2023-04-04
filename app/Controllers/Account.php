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
                if (password_verify($pwd, $user['pwd'])) {
                    $_SESSION['user'] = [
                        'fname' => $user['fname'],
                        'username' => $user['username'],
                        'avatar' => $user['avatar'],
                        'email' => $user['email'],
                    ];
                    echo json_encode(['response' => true]);
                    return;
                }
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

    function myprofile(): string
    {
        return template('profile');
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