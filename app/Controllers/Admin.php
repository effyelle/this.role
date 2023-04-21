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

    function canEditAdmin(array $target_user, array $new_data, string $rol = 'admin'): bool
    {
        // If user is to be deleted
        $userToBeDeleted = $new_data['user_status'] === 'inactive';

        // Count active users with the same rol
        $activeAdmins = count($this->usermodel->get(['user_rol' => $rol, 'user_deleted' => null]));

        // User must not be demoted or deleted if it is last admin or the last masteradmin
        return !($target_user['user_rol'] === $rol && $target_user['user_deleted'] === null &&
            ($new_data['user_rol'] !== $rol || $userToBeDeleted) && $activeAdmins === 1);
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

        /////////////////////////////
        // Save old data from user //
        /////////////////////////////
        $old_userdata = $this->usermodel->get(['user_id' => $where['user_id']])[0];

        if ($_SESSION['user']['user_rol'] === 'admin' && $old_userdata['user_rol'] === 'masteradmin') {
            echo json_encode(['response' => false, 'msg' => 'You cannot edit a Master Admin']);
            return;
        }

        $post = [];
        foreach ($_POST as $k => $v) {
            $post[$k] = validate($v); // Clean and save $_POST variables
        }
        if (!isset($post['user_rol'])) $post['user_rol'] = $old_userdata['user_rol'];
        if (!isset($post['user_status'])) $post['user_status'] = $old_userdata['user_deleted'] === null ? 'active' : 'inactive';

        // Save $_POST data only for full name
        $data = [ // Most of default data will be the old ones
            'user_username' => $old_userdata['user_username'],
            'user_fname' => $post['fname'] ?? '',
            'user_email' => $old_userdata['user_email'],
            'user_rol' => $old_userdata['user_rol'],
            'user_deleted' => $old_userdata['user_deleted']
        ];

        // Message(s) to be display if error(s)
        $msgResponse = [];

        //////////////////////////////////
        // Check username is not picked //
        //////////////////////////////////
        if ($old_userdata['user_username'] !== $post['username'] &&
            $this->usermodel->get(['user_username' => $post['username']])) {
            $msgResponse[] = 'The username is already in use';
        } else {
            $data['user_username'] = $post['username'];
        }

        ///////////////////////////////
        // Check email is not picked //
        ///////////////////////////////
        $emailChanged = false;
        if ($old_userdata['user_email'] !== $post['email'] &&
            $this->usermodel->get(['user_email' => $post['email']])) {
            $msgResponse[] = 'The email is already in use';
        } elseif ($data['user_email'] !== $post['email']) {
            // Unconfirm user if email changed
            $data['user_email'] = $post['email'];
            $emailChanged = true;
        }

        //////////////////////////
        // Check status and rol //
        //////////////////////////
        if (!($_SESSION['user']['user_rol'] === 'admin' && // False if the user updating data is admin and
            ($post['user_status'] === 'inactive' && // is deleteting another user admin that is not himself
                $old_userdata['user_rol'] === 'admin')
        )) { // Set response if failure

            if (!$this->canEditAdmin($old_userdata, $post)) {
                $msgResponse['rol_status'] = 'This user is the last Admin,<br>promote another user to delete it or change its role';
            }/* elseif (!$this->canEditAdmin($old_userdata, $post, 'masteradmin')) {
                $msgResponse['rol_status'] = 'This user is the last Master Admin, <br>promote another user to delete it or change its role';
            }*/
        } else {
            $msgResponse['rol_status'] = 'You cannot delete, promote or demote an Admin or a Master Admin';
        }

        // Set rol and status if there was no failure response
        if (!isset($msgResponse['rol_status'])) {
            $data['user_rol'] = $post['user_rol'];
            $data['user_deleted'] = $post['user_status'] === 'inactive' ? $this->now : null;
        }

        ///////////////////
        // Update issues //
        ///////////////////
        if ((new Account())->updateIssuesMessages($old_userdata['user_username'], $data['user_username'])) {
            // Update user
            if ($this->usermodel->updt($data, $where)) {
                // If email changes unconfirm user
                if ($emailChanged) {
                    $data['user_confirmed'] = null;
                    // Send confirmation email
                    // (new Account())->sendConfirmationEmail($data['email']);
                }
                echo json_encode(['response' => true, 'msg' => $msgResponse]);
                return;
            }
        }

        echo json_encode(['response' => false]);
    }
}