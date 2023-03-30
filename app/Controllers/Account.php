<?php

namespace App\Controllers;

class Account extends BaseController
{
    function signin(): string
    {
        return template('signin');
    }

    function attempt_signin(): void
    {
        if (isset($_POST['login'])) {
            $user = $_POST['login']['username'];
            $pwd = $_POST['login']['pwd'];
            echo json_encode(['user' => $user, 'pwd' => $pwd]);
        }
    }

    function attempt_signup(): void
    {
        if (isset($_POST['login'])) {
            $user = $_POST['login']['username'];
            $pwd = $_POST['login']['pwd'];
            echo json_encode(['user' => $user, 'pwd' => $pwd]);
        }
    }

    function signup(): string
    {
        return template('signup');
    }
}