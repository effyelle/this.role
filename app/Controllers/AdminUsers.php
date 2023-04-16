<?php

namespace App\Controllers;

class AdminUsers extends BaseController
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

    public function update_user(): void
    {
        // Save $_POST data
        $data = [
            'user_username' => validate($_POST['username']),
            'user_fname' => validate($_POST['fname']),
            'user_email' => validate($_POST['email']),
            'user_rol' => validate($_POST['user_rol']),
            'user_deleted' => ($_POST['user_status']) === 'inactive' ? $this->now : null
        ];
        $where = ['user_id' => intval($_POST['user'])];

        // Get old username from user
        $old_username = $this->usermodel->get(null, $where['user_id'])['user_username'];
        // Get all issues
        $all_issues = $this->issuesmodel->get();
        // Update all matching usernames in messages with the new username
        foreach ($all_issues as $v) {
            // Decode json
            $msgs = json_decode($v['issue_msg']);
            // Go through each message
            foreach ($msgs as $msg) {
                // Find the old username
                if ($msg->sender === $old_username) {
                    // Replace it with the new one
                    $msg->sender = $data['user_username'];
                }
            }
            // Encode message again
            $new_msgs = json_encode($msgs);
            // Update this issue msg by ID
            $this->issuesmodel->updt(
                ['issue_msg' => $new_msgs], // data
                ['issue_id' => $v['issue_id']] // where
            );
        }
        // Update username in issues messages
        $this->issuesmodel->updt(
            ['issue_user' => $data['user_username']],
            ['issue_user' => $old_username]
        );
        // Update username for user
        if ($this->usermodel->updt($data, $where)) {
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