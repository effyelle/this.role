<?php

namespace App\Controllers;

class AdminUsers extends BaseController
{
    protected mixed $model;
    protected string $now;

    public function __construct()
    {
        $this->model = model('UsersModel');
        $this->now = date('Y-m-d H:i:s', time());
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

    function update_user(): void
    {
        // Still have to write -> $_POST validation
        $rules=[];

        if ($this->model->updt(
            [ // Params to change
                'user_fname' => $_POST['fname'],
                'user_username' => $_POST['uname'],
                'user_email' => $_POST['email'],
                'user_rol' => $_POST['user_rol'],
                'user_deleted' => $_POST['user_status'] === 'inactive' ? $this->now : null
            ],
            [ // Where condition
                'user_username' => $_POST['uname']
            ]
        )) {
            echo json_encode(['response' => true]);
            return;
        }
        echo json_encode(['response' => false]);
    }

    function games(): string
    {
        return template('admin/games');
    }
}