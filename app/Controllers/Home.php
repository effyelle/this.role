<?php

namespace App\Controllers;

class Home extends BaseController
{

    public function index(): string
    {
        if (isset($_SESSION['user'])) return template('');
        return template('signin');
    }

    public function dev_index():string
    {
        return template();
    }

    function signin(): string
    {
        return template('signin');
    }

}
