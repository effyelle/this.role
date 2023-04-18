<?php

namespace App\Controllers;

class Admin extends BaseController
{
    protected mixed $usermodel;
    protected mixed $issuesmodel;
    protected string $now;

    public function __construct()
    {
        $this->usermodel = model('UsersModel');
        $this->issuesmodel = model('IssuesModel');
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
        if ($users = $this->usermodel->get()) $data['users_list'] = $users;
        if ($issues = $this->issuesmodel->get()) $data['issues_list'] = $issues;
        return template('admin/users', $data);
    }

    function games(): string
    {
        return template('admin/games');
    }

    /* *****************************************************************************************************************
     * AJAX CALLS ******************************************************************************************************
     ******************************************************************************************************************/

    /**
     * Update user from Admin side
     *
     * @return void
     */
    public function update_user(): void
    {
        // Save where for DB
        $where = ['user_id' => intval($_POST['user'])];

        // Save old data from user
        $old_userdata = $this->usermodel->get(['user_id' => $where['user_id']])[0];

        $post = [];
        foreach ($_POST as $k => $v) {
            $post[$k] = validate($v);
        }

        // Save $_POST data only for full name
        $data = [
            'user_username' => $old_userdata['user_username'],
            'user_fname' => $post['fname'],
            'user_email' => $old_userdata['user_email'],
            // Do not change rol by default
            'user_rol' => $old_userdata['user_rol'],
            // Do not delete by default
            'user_deleted' => $old_userdata['user_deleted']
        ];

        // Message(s) to be display if error(s)
        $msgResponse = [];

        // If user is master admin, do look into rol and status
        if ($_SESSION['user']['user_rol'] === 'masteradmin') {
            // User must not be demoted or deleted if it's last admin or the last masteradmin
            if (
                $post['user_status'] === 'inactive' ||
                ($old_userdata['user_rol'] === 'admin' && $post['user_rol'] !== 'admin') ||
                ($old_userdata['user_rol'] === 'masteradmin' && $post['user_rol'] !== 'masteradmin')
            ) {
                // Check if admin
                if (
                    ($old_userdata['user_rol'] === 'admin' && count($this->usermodel->get(['user_rol' => 'admin'])) < 2) ||
                    ($old_userdata['user_rol'] === 'masteradmin' && count($this->usermodel->get(['user_rol' => 'masteradmin'])) < 2)
                ) {
                    $msgResponse['rol_status'] = $old_userdata['user_rol'] === 'admin'
                        ? 'This user is the last Admin.<br>Promote another user to delete it or change its role.'
                        : 'This user is the last Master Admin.<br>Promote another user to delete it or change its role.';
                }
            }
            // Set rol and status if there's no response
            if (!isset($msgResponse['rol_status'])) {
                $data['user_rol'] = $post['user_rol'];
                $data['user_deleted'] = $post['user_status'] === 'inactive' ? $this->now : null;
            }
        }

        // Check username
        if ($old_userdata['user_username'] !== $post['username'] &&
            $this->usermodel->get(['user_username' => $post['username']])) {
            $msgResponse[] = 'The username is already in use.';
        } else {
            $data['user_username'] = $post['username'];
        }

        // Check email
        if ($old_userdata['user_email'] !== $post['email'] &&
            $this->usermodel->get(['user_email' => $post['email']])) {
            $msgResponse[] = 'The email is already in use.';
        } else {
            // Unconfirm user if email changed
            $data['user_email'] = $post['email'];
        }

        // Update issues
        if ((new Account())->updateIssuesMessages($old_userdata['user_username'], $data['user_username'])) {
            // If email changes unconfirm user
            if ($old_userdata['user_email'] !== $data['user_email']) {
                $data['user_confirmed'] = null;
                // Send confirmation email
                // (new Account())->sendConfirmationEmail($data['email']);
            }
            // Update user
            if ($this->usermodel->updt($data, $where)) {
                echo json_encode(['response' => true, 'msg' => $msgResponse]);
                return;
            }
        }

        echo json_encode(['response' => false]);
    }
}