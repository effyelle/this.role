<?php

namespace App\Controllers;

class Users extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = model('UsersModel');
    }

    function users(): string
    {
        $data = [];
        if ($users = $this->model->get()) {
            $data['users_list'] = $users;
        }
        return template('admin/users', $data);
    }

    function games(): string
    {
        return template('admin/games');
    }
}