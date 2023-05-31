<?php

namespace App\Controllers;

class Admin extends BaseController
{

    /**
     * Instance of UsersModel class
     * @var mixed|\App\Models\UsersModel|null
     */
    protected mixed $usermodel;

    /**
     * Instance of IssuesModel class
     * @var mixed|\App\Models\IssuesModel|null
     */
    protected mixed $issuesmodel;

    /**
     * Instance of GamesModel class
     * @var mixed|\App\Models\GamesModel|null
     */
    protected mixed $gamesmodel;

    /**
     * Variable to save current datetime stamp in the desired format.
     * @var string
     */
    protected string $now;

    public function __construct()
    {
        $this->usermodel = model('UsersModel');
        $this->issuesmodel = model('IssuesModel');
        $this->gamesmodel = model('GamesModel');
        $this->now = date('Y-m-d H:i:s', time());
    }

    /**
     * ---
     * ADMIN USERS VIEW
     * ---
     * Redirects to the admin view for users with a list of all users.
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

    /**
     * ---
     * ADMIN GAMES VIEW
     * ---
     * Redirects to the admin view for games with a list of all games.
     *
     * WARNING: This area is still under development
     *
     * @return string
     */
    function games(): string
    {
        $data = [];
        if ($games = $this->gamesmodel->get(null, ['users' => 'users.user_id=games.game_creator'])) $data['games_list'] = $games;
        return template('admin/games', $data);
    }

    /**
     * ---
     * CHECK LAST ADMINS/MASTERADMINS
     * ---
     * A more detailed checking than {@link Account::canDeleteUser()} of the admin/masteradmin state before updating a
     * user. It compares if the user is going to be deactivated, demoted o promoted before the update.
     *
     * This method is called from the Users Admin section.
     *
     * @param array $target_user
     * @param array $new_data
     * @param string $rol
     *
     * @return bool
     */
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

    /**
     * ---
     * UPDATE USER
     * ---
     * Updates user from admin side. Checks if email and/or username are already taken. If promoting/demoting or
     * deactivating an admin/masteradmin, check user is not the last of its rol via {@link canEditAdmin()}.
     *
     * There are some parts of this method that are currently under supervision so they have been commented.
     *
     * @return string
     */
    public function update_user(): string
    {
        // Save where for DB
        $where = ['user_id' => intval($_POST['user'])];

        /////////////////////////////
        // Save old data from user //
        /////////////////////////////
        if ($old_userdata = $this->usermodel->get(['user_id' => $where['user_id']])) {
            $old_userdata = $old_userdata[0];
        }
        // Return if not found
        if (!$old_userdata) {
            return json_encode(['response' => false, 'msg' => 'User not found']);
        }
        // Return if permission is invalid
        if (!($_SESSION['user']['user_rol'] === 'masteradmin' || (
                $_SESSION['user']['user_rol'] === 'admin' && (
                    $old_userdata['user_rol'] === 'user' || $_SESSION['user']['user_id'] === $old_userdata['user_id']
                )
            )
        )) {
            return json_encode(['response' => false, 'msg' => 'You can only edit basic users or yourself.']);
        }

        $post = [];
        foreach ($_POST as $k => $v) {
            $post[$k] = trim($v);
        }
        // Set default data if not set by post
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
            // $data['user_confirmed'] = null;
            $emailChanged = true;
        }

        //////////////////////////
        // Check status and rol //
        //////////////////////////
        if (!$this->canEditAdmin($old_userdata, $post)) {
            return json_encode(['response' => false, 'msg' => 'This user is the last Admin,<br>promote another user to change its role or delete it']);
        } elseif (!$this->canEditAdmin($old_userdata, $post, 'masteradmin')) {
            return json_encode(['response' => false, 'msg' => 'This user is the last Master Admin, <br>promote another user change its role or to delete it']);
        }

        // Set rol and status if there was no failure response
        if (!isset($msgResponse['rol_status'])) {
            $data['user_rol'] = $post['user_rol'];
            $data['user_deleted'] = $post['user_status'] === 'inactive' ? $this->now : null;
        }

        // At this point, user can be edited and username and email are unique

        // * begin::Update issues * //
        if ((new Account())->updateIssuesMessages($old_userdata['user_username'], $data['user_username'])) {
            // Update user
            if ($this->usermodel->updt($data, $where)) {
                // If email changes unconfirm user
                if ($emailChanged) {
                    // Send confirmation email
                    // (new Account())->sendConfirmationEmail($data['email']);
                }
                return json_encode(['response' => true, 'msg' => $msgResponse]);
            }
        }
        return json_encode(['response' => false]);
        // * end::Update issues * //
    }

    /**
     * ---
     * UPDATE GAME
     * ---
     * This function is still under development
     *
     * @return string
     */
    public function update_game(): string
    {
        $data ['response'] = false;
        // Update here and fill $data
        return json_encode($data);
    }
}