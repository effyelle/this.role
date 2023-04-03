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
        if ($username && $pwd && $user = $this->model->login($username)) {
            if (password_verify($pwd, $user['pwd'])) {
                session_start();
                $_SESSION['user'] = $user;
                echo json_encode(['response' => true]);
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
            if ($this->model->new($user, $email, $pwd)) {
                echo json_encode(['response' => true]);
                return;
            }
        }
        echo json_encode(['response' => false]);
    }

    function created(): string
    {
        return template('account_created');
    }

}