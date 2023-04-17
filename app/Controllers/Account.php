<?php

namespace App\Controllers;

use org\bovigo\vfs\content\SeekableFileContent;

class Account extends BaseController
{
    protected mixed $usermodel;
    protected mixed $tokenmodel;
    protected mixed $issuesmodel;
    protected mixed $mailer;
    protected string $now;

    /**
     * Construct of this class will always set up users model and the mailer.
     */
    public function __construct()
    {
        $this->usermodel = model('UsersModel');
        $this->tokenmodel = model('TokenModel');
        $this->issuesmodel = model('IssuesModel');
        $this->mailer = \Config\Services::email();
        $this->now = date('Y-m-d H:i:s', time());
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * LOGIN
     * -----------------------------------------------------------------------------------------------------------------
     * Verify user exists and password is correct and send a response through json_encode. This function is to be called
     * from a Javascript AJAX.
     *
     * -----------------------------------------------------------------------------------------------------------------
     * Parameters via $_REQUEST:
     * - $_POST['username']: username to check account exists
     * - $_POST['pwd']: password to verify
     *
     * -----------------------------------------------------------------------------------------------------------------
     * After login, the user data will be saved in $_SESSION. Session has to be already initialized at this point.
     *
     * @return void
     */
    function login(): void
    {
        $email = $_POST['email'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($email && $pwd) {
            if ($user = $this->usermodel->get($email)) {
                if (password_verify($pwd, $user['user_pwd'])) {
                    update_session($user);
                    echo json_encode(['response' => true]);
                    return;
                }
            }
        }
        echo json_encode(['response' => false]);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * SIGNUP
     * -----------------------------------------------------------------------------------------------------------------
     * Checks is username and email already exist in Database. If they don't, attempts to create a new user.
     *
     * -----------------------------------------------------------------------------------------------------------------
     * Parameters via $_REQUEST:
     * - $_POST['username']
     * - $_POST['email']
     * - $_POST['pwd']
     *
     * @return void
     */
    function signup(): void
    {
        $username = validate($_POST['username']) ?? false;
        $email = validate($_POST['email']) ?? false;
        $pwd = validate($_POST['pwd']) ?? false;
        // Check fields are not empty
        if (!($username && $email && $pwd)) {
            echo json_encode(['response' => false, 'msg' => 'Necessary fields are empty.', 'data' => $_POST]);
            return;
        }
        // Check email
        if ($this->usermodel->get($email)) {
            echo json_encode(['response' => false, 'msg' => 'The email is already in use.']);
            return;
        }
        // Send confirmation email and insert new user into Database
        //if ($this->sendConfirmationEmail($email)) {
        $pwd = password_hash($pwd, PASSWORD_DEFAULT);
        if ($this->usermodel->new(['user_username' => $username, 'user_email' => $email, 'user_pwd' => $pwd])) {
            echo json_encode(['response' => true]);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'User could not be added']);
        return;
        //}
        //echo json_encode(['response' => false, 'msg' => 'Mail could not be sent']);
    }

    function avatar_change()
    {
        if ($_FILES['avatar']['error'] === 0) {
            $img = upload_img('avatar', 'assets/media/avatars');
            echo json_encode(['reponse' => true, 'img' => '/' . $img]);
            return;
        }
        echo json_encode(['reponse' => false]);
    }

    function updateProfile(): string
    {
        if (isset($_POST['fname'])) {
            $username = $_POST['username'];
            $fname = $_POST['fname'];
            $email = $_POST['email'];
            $oldEmail = $_SESSION['user']['user_email'];
            if ($fname === '') $fname = null;
            $data = [
                'user_username' => $username,
                'user_fname' => $fname,
                'user_email' => $email
            ];
            $where = ['user_email' => $oldEmail];
            if ($_FILES['avatar']['error'] === 0) {
                $img = upload_img('avatar', 'assets/media/avatars');
                if ($img) $data['user_avatar'] = '/' . $img;
            }
            if ($email !== $oldEmail) $data['user_confirmed'] = null;
            if ($this->usermodel->updt($data, $where)) update_session($this->usermodel->get($email));
            if ($email !== $oldEmail) {
                // Send new confirmation email
                // $this->sendConfirmationEmail($email);
                session_unset();
                session_destroy();
                return $this->created();
            }
        }
        return template('profile');
    }

    function myIssues(): string
    {
        $data = [];
        if ($issues = $this->issuesmodel->get(null, $_SESSION['user']['user_username'])) $data['issues_list'] = $issues;
        return template('messages', $data);
    }

    function myprofile()
    {
        if (isset($_SESSION['user'])) {
            $user = $this->usermodel->get($_SESSION['user']['user_email']);
            update_session($user);
            echo json_encode(['response' => true, 'user' => $user]);
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Generate Token for email
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param string $email
     * @return string|bool
     */
    private function generateToken(string $email): string|bool
    {
        $token = time();
        if ($this->tokenmodel->new($token, $email)) {
            return $token;
        }
        return false;
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Confirmation email
     * -----------------------------------------------------------------------------------------------------------------
     * Generates token and includes it in the email body sent to the address given.
     *
     * @param $email
     * @return bool
     */
    function sendConfirmationEmail($email): bool
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $this->mailer->setTo($email);
        $this->mailer->setSubject('Confirm Your Account');
        $this->mailer->setMessage(view('templates/mail/confirm_account_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/confirm_account_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        return $this->mailer->send();
    }

    function send_reset_password_email($email): void
    {
        if ($this->sendResetPasswordEmail($email)) {
            echo json_encode(['response' => true, 'msg' => 'An email has been sent to reset your password.']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'There was an error sending the email']);
    }

    function sendResetPasswordEmail($email): bool
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $this->mailer->setTo($email);
        $this->mailer->setSubject('Password Reset');
        $this->mailer->setMessage(view('templates/mail/reset_pwd_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/reset_pwd_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        return $this->mailer->send();
        // For debug
        // -->
        /*
        if (!$this->mailer->send()) {
            return $this->mailer->printDebugger();
        }
        */
    }

    public function confirm($token): string
    {
        $t = $this->tokenmodel->get($token);
        if (!$t) return template('tokens/token_expired', ['unlogged' => true]);
        // Update data
        if (!$this->usermodel->updt([
            'user_email' => $t['token_user'],
            'user_confirmed' => $this->now
            // Return an error view if the update went wrong
        ])) return template('tokens/confirm_problem', ['unlogged' => true]);
        // Expire token if
        $this->tokenmodel->del($token);
        return template('tokens/account_confirmed', ['unlogged' => true]);
    }

    public function resetpwd($token): string
    {
        // Declare data
        $data = ['unlogged' => true, 'token' => $token];
        // Exit if token has expired
        if (!$this->tokenmodel->get($token)) return template('tokens/token_pwd_expired', $data);
        return template('tokens/new_password', $data);

    }

    function reset_password(): void
    {
        // Check request fields
        if (isset($_POST['pwd']) && isset($_POST['token'])) {
            // Hash new password
            $hash = password_hash($_POST['pwd'], PASSWORD_DEFAULT);
            // Get email from token
            $email = $this->tokenmodel->get($_POST['token'])['token_user'];
            // Update fields
            echo $this->now;
            if ($this->usermodel->updt(
                ['user_pwd' => $hash, 'user_confirmed' => $this->now],
                ['user_email' => $email]
            )) {
                // If fields were updated, expire token and destroy any session that could exist
                $this->tokenmodel->updt(['token_expires' => $this->now], ['token' => $_POST['token']]);
                if (isset($_SESSION['user'])) session_destroy();
                echo json_encode(['response' => true]);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'There was a problem in database']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Fields are missing', 'data' => $_POST]);
    }

    function created(): string
    {
        return template('tokens/email_sent', ['unlogged' => true]);
    }

    public function update_user(): void
    {
        // Save $_POST data
        $data = [
            'user_username' => validate($_POST['username']),
            'user_fname' => validate($_POST['fname']),
            'user_email' => validate($_POST['email'])
        ];
        if (isset($_POST['user_rol'])) $data['user_rol'] = validate($_POST['user_rol']);
        if (isset($_POST['user_status'])) $data['user_deleted'] = $_POST['user_status'] === 'inactive' ? $this->now : null;

        $where = ['user_id' => intval($_POST['user'])];

        // Get old username from user
        $old_username = $this->usermodel->get(null, $where['user_id'])['user_username'];

        // Update issues
        if ($this->updateIssuesMessages($old_username, $data['user_username'])) {
            // Update user
            if ($this->usermodel->updt($data, $where)) {
                echo json_encode(['response' => true]);
                return;
            }
        }

        echo json_encode(['response' => false]);
    }

    private function updateIssuesMessages($old_username, $new_username): bool
    {
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
                    $msg->sender = $new_username;
                }
            }
            // Encode message again
            $new_msgs = json_encode($msgs);
            // Update this issue msg by ID
            if (!$this->issuesmodel->updt(
                ['issue_msg' => $new_msgs], // data
                ['issue_id' => $v['issue_id']] // where
            )) return false;
        }
        // Update username in issues messages
        if (!$this->issuesmodel->updt(
            ['issue_user' => $new_username],
            ['issue_user' => $old_username]
        )) return false;
        return true;
    }

    public function send_issue(): void
    {
        if (isset($_SESSION['user'])) {
            $data = [
                'issue_user' => $_SESSION['user']['user_username'],
                'issue_title' => validate($_POST['issue_title']),
                'issue_type' => validate($_POST['issue_type']),
                'issue_msg' => json_encode([
                    0 => [
                        "time" => $this->now,
                        "sender" => $_SESSION['user']['user_username'],
                        "msg" => validate($_POST['issue_details'])
                    ]
                ]),
            ];
            if ($this->issuesmodel->new($data)) {
                echo json_encode(['response' => true]);
                return;
            }
        }
        echo json_encode(['response' => false]);
    }

    public function send_issue_msg(): void
    {
        // Get all issues
        $issue_id = intval($_POST['issue_id']);
        $issue_msg = json_decode($this->issuesmodel->get($issue_id)['issue_msg']);
        $issue_msg[] = [
            "time" => $this->now,
            "sender" => $_SESSION['user']['user_username'],
            "msg" => validate($_POST['msg'])
        ];
        $new_msg = json_encode($issue_msg);
        if ($this->issuesmodel->updt(
            ['issue_msg' => $new_msg],
            ['issue_id' => $issue_id]
        )) {
            echo json_encode(['response' => true]);
            return;
        }
        echo json_encode(['response' => false]);
    }
}