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

    public function update_user(): void
    {
        // Still have to write -> $_POST validation
        $data = [
            'user_fname' => validate($_POST['fname']),
            'user_email' => validate($_POST['email']),
            'user_rol' => validate($_POST['user_rol']),
            'user_deleted' => ($_POST['user_status']) === 'inactive' ? $this->now : null
        ];
        $where = ['user_id' => $_POST['user']];

        if ($this->model->updt($data, $where)) {
            echo json_encode(['response' => true]);
            return;
        }
        echo json_encode(['response' => false, 'data' => $_POST]);
    }

    function games(): string
    {
        return template('admin/games');
    }
}