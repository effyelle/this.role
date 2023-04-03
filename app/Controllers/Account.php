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
        $user = $_POST['username'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($user && $pwd) {
            //$pwd = password_hash($pwd, PASSWORD_DEFAULT);
            // I have to get password dehash it and then compare it
            // This here and now does not work
            if ($user = $this->model->login($user, $pwd)) {
                $_SESSION['user'] = $user;
                echo json_encode(['error' => false]);
                return;
            }
        }
        echo json_encode(['error' => true]);
    }

    function signup(): void
    {
        $user = $_POST['username'] ?? false;
        $email = $_POST['email'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($user && $email && $pwd) {
            $pwd = password_hash($pwd, PASSWORD_DEFAULT);
            if ($this->model->new($user, $email, $pwd)) {
                echo json_encode(['error' => false]);
                return;
            }
        }
        echo json_encode(['error' => true]);
    }

    function created(): string
    {
        return template('account_created');
    }

}