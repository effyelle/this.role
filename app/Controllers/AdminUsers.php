<?php

namespace App\Controllers;

class AdminUsers extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = model('UsersModel');
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Get all users
     * -----------------------------------------------------------------------------------------------------------------
     * Redirects the the admin view for users with a list of all users.
     *
     * @return string
     */
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