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
    function __construct()
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
            if ($user = $this->usermodel->get(['user_email' => $email, 'user_deleted' => null])) {
                $user = $user[0];
                if (password_verify($pwd, $user['user_pwd'])) {
                    update_session($user);
                    echo json_encode(['response' => true]);
                    return;
                }
                echo json_encode(['response' => false, 'pwd' => 'There was an error logging in.']);
                return;
            }
            echo json_encode(['response' => false, 'user' => 'There was an error logging in.']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Some data seems to be missing.']);
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
        // Check username
        if ($this->usermodel->get(['user_username' => $username])) {
            echo json_encode(['response' => false, 'msg' => 'The username is already in use.']);
            return;
        }
        // Check email
        if ($this->usermodel->get(['user_email' => $email])) {
            echo json_encode(['response' => false, 'msg' => 'The email is already in use.']);
            return;
        }
        // Send confirmation email and insert new user into Database
        $email_response = $this->sendConfirmationEmail($email, $username);
        // If $email_response returns false means token could not be created.
        // If it returns a string it is a debug message and email could not be sent.
        if ($email_response !== true) {
            echo json_encode([
                'response' => false,
                'msg' => $email_response === false
                    ? 'There was a problem adding the token'
                    : 'Mail could not be sent',
                'email_response' => $email_response
            ]);
            return;
        }
        $pwd = password_hash($pwd, PASSWORD_DEFAULT);
        if (!$this->usermodel->new(['user_username' => $username, 'user_email' => $email, 'user_pwd' => $pwd])) {
            echo json_encode(['response' => false, 'msg' => 'User could not be added']);
            return;
        }
        echo json_encode(['response' => true]);
    }

    function updateProfile(): string
    {
        $error = '';
        if (isset($_POST['fname'])) {
            $new_username = validate($_POST['username']);
            $new_fname = validate($_POST['fname']);
            $new_email = validate($_POST['email']);

            //
            // Check if username and email are taken by another user
            //
            if ($new_username !== '' && $new_fname !== '' && $new_email !== '') {
                // Save old email and old username to variables
                $oldEmail = $_SESSION['user']['user_email'];
                $oldUsername = $_SESSION['user']['user_username'];
                if ( // Check if username or email are already taken
                    // Compare old username to new username
                    ($oldUsername !== $new_username && $this->usermodel->get(['user_username' => $new_username])) ||
                    // Compare old email to new email
                    ($oldEmail !== $new_email && $this->usermodel->get(['user_email' => $new_email]))
                ) { // If one of them match, return an error
                    return template('profile', ['error' => 'The username or email are already in use.']);
                }

                //
                // Start filling up $data=[]
                //

                $data = [
                    'user_username' => $new_username,
                    'user_fname' => $new_fname,
                    'user_email' => $new_email
                ];

                if ($_FILES['avatar']['error'] === 0) {
                    $img = upload_img('avatar', 'assets/media/avatars');
                    if (preg_match('/[0-9]/', $img)) $data['user_avatar'] = '/' . $img;
                    else return template('profile', ['error' => $img]);
                }
                // Unconfirm account if email was changed
                if ($new_email !== $oldEmail) $data['user_confirmed'] = null;

                //
                // Finish filling up $data=[]
                //

                // Update user in Database
                if ($this->usermodel->updt(
                    $data, // data
                    ['user_id' => $_SESSION['user']['user_id']] // where
                // If successfull, update session
                )) update_session($this->usermodel->get(['user_email' => $new_email])[0]);
                // Send confirmation account email if email was changed
                if ($new_email !== $oldEmail) {
                    $email_response = $this->sendConfirmationEmail($new_email, $new_username);
                    // Return error if email could not be sent
                    $error = ($email_response === true)
                        ? '<span class="fs-4">Your email was updated, an email has been sent for confirmation</span>'
                        : ($email_response === false
                            ? 'There was a problem adding the token'
                            : 'Mail could not be sent');
                }
            } // Fields missing
            else $error = 'Rellena todos los campos';
        }
        return template('profile', ['error' => $error]);
    }

    function myIssues(): string
    {
        $data = [];
        if ($issues = $this->issuesmodel->get(['issue_user' => $_SESSION['user']['user_username']])) $data['issues_list'] = $issues;
        return template('issues', $data);
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
        // Expire all tokens that have the email given before adding a new one
        $this->tokenmodel->updt(
            ['token_expires' => $this->now], // data
            ['token_user' => $email] // where
        );
        // Add a new token
        if ($this->tokenmodel->new(['token' => $token, 'token_user' => $email])) {
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
     * @param $user
     * @return bool|string
     */
    function sendConfirmationEmail($email, $user): bool|string
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $this->mailer->setTo($email);
        $this->mailer->setSubject('Welcome ' . $user . '! Please, confirm your Account.');
        $this->mailer->setMessage(view('templates/mail/confirm_account_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/confirm_account_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        if ($this->mailer->send()) return true;
        return $this->mailer->printDebugger();
    }

    /**
     * @param $email
     * @param $user
     * @return bool|string
     */
    function sendResetPasswordEmail($email, $user): bool|string
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $this->mailer->setTo($email);
        $this->mailer->setSubject("Hello, $user! Here is your password reset");
        $this->mailer->setMessage(view('templates/mail/reset_pwd_html', ['token' => $token]));
        $this->mailer->setAltMessage(view('templates/mail/reset_pwd_txt', ['token' => $token]));
        $this->mailer->setReplyTo(null);
        // Return true if email was send
        if ($this->mailer->send()) return true;
        // Return error if it was not
        return $this->mailer->printDebugger();
    }

    function confirm($token): string
    {
        $t = $this->tokenmodel->get(['token' => $token, 'token_expires>' => $this->now]);
        if (!$t) return template('tokens/token_expired', ['unlogged' => 'unlogged']);
        if (count($t) !== 1) return template('tokens/confirm_problem', ['unlogged' => 'unlogged']);
        $t = $t[0];

        // Update data
        if (!$this->usermodel->updt(
            ['user_email' => $t['token_user'], 'user_confirmed' => $this->now],
            ['user_email' => $t['token_user']]
        // Return an error view if the update is unsuccessfull
        )) return template('tokens/confirm_problem', ['unlogged' => 'unlogged']);

        // Expire token if user was correctly updated
        $this->tokenmodel->updt(['token_expires' => $this->now], ['token' => $token]);

        // Update was succesfull!!
        return template('tokens/account_confirmed', ['unlogged' => 'unlogged']);
    }

    function resetpwd($token): string
    {
        // Declare data
        $data = ['unlogged' => 'unlogged', 'token' => $token];

        // Exit if token has expired
        if (!$this->tokenmodel->get(['token' => $token, 'token_expires>' => $this->now]
        )) return template('tokens/token_pwd_expired');

        // Token is valid, return recovery form
        return template('tokens/new_password', $data);
    }

    function reset_password(): void
    {
        // Check request fields
        if (isset($_POST['pwd']) && isset($_POST['token'])) {
            // Hash new password
            $hash = password_hash($_POST['pwd'], PASSWORD_DEFAULT);
            // Get email from token
            $email = $this->tokenmodel->get(['token' => $_POST['token']])[0]['token_user'];
            // Update fields
            if ($this->usermodel->updt(
                ['user_pwd' => $hash], // data
                ['user_email' => $email] // where
            )) {
                // If fields were updated, expire token and destroy any session that could exist
                $this->tokenmodel->updt(
                    ['token_expires' => $this->now], // data
                    ['token' => $_POST['token'] // where
                    ]);
                if (isset($_SESSION['user'])) {
                    session_unset();
                    session_destroy();
                }
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
        return template('tokens/email_sent', ['unlogged' => 'unlogged']);
    }

    function canDelete(string $rol = 'admin'): bool
    {
        return !($_SESSION['user']['user_rol'] === $rol &&
            count($this->usermodel->get(['user_rol' => $rol, 'user_deleted' => null])) === 1);
    }

    function deactivate(): void
    {
        if (isset($_SESSION['user'])) {
            if (!$this->canDelete() || !$this->canDelete('masteradmin')) {
                echo json_encode(['response' => false, 'msg' => 'You are the last admin. Promote another to delete your account.']);
                return;
            }
            if ($this->usermodel->updt(
                ['user_deleted' => $this->now],
                ['user_id' => $_SESSION['user']['user_id']]
            )) {
                session_unset();
                session_destroy();
                echo json_encode(['response' => true]);
                return;
            }
        }
        echo json_encode(['response' => false]);
    }

    function updateIssuesMessages($old_username, $new_username): bool
    {
        // Get all issues
        $all_issues = $this->issuesmodel->get();

        // Update all matching usernames in messages with the new username
        if (is_array($all_issues) && count($all_issues) > 0) {
            foreach ($all_issues as $v) {
                var_dump($v);
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
        }
        return true;
    }

    function send_issue(): void
    {
        if (isset($_SESSION['user'])) {
            $data = [
                'issue_user' => $_SESSION['user']['user_username'],
                'issue_title' => validate($_POST['issue_title']),
                //'issue_type' => validate($_POST['issue_type']),
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

    function send_issue_msg(): void
    {
        if (isset($_SESSION['user'])) {
            // Get all issues
            $issue_id = intval($_POST['issue_id']);

            if ($issue_msg = $this->issuesmodel->get(['issue_id' => $issue_id])[0]['issue_msg']) {
                $issue_msg = json_decode($issue_msg);
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
            }
        }
        echo json_encode(['response' => false]);
    }

    /* *****************************************************************************************************************
     * AJAX CALLS ******************************************************************************************************
     ******************************************************************************************************************/

    /**
     * AJAX call to get session for debugging
     *
     * @return void
     */
    function myprofile(): void
    {
        if (isset($_SESSION['user'])) {
            if ($user = $this->usermodel->get(['user_username' => $_SESSION['user']['user_username']])) {
                $user = $user[0];
                update_session($user);
                echo json_encode(['response' => true, 'user' => $user]);
                return;
            }
        }
        echo json_encode(['response' => false]);
    }

    /**
     * AJAX call to send a Password Recovery Email
     *
     * @param $email
     * @return void
     */
    function send_reset_password_email($email): void
    {
        $user = $this->usermodel->get(['user_email' => $email]);
        if ($user && count($user) === 1) $user = $user[0];
        $email_response = $this->sendResetPasswordEmail($email, $user['user_username']);

        // Return an error if mail could not be sent
        if ($email_response !== true) {
            echo json_encode([
                'response' => false,
                'msg' => $email_response === false
                    ? 'There was a problem adding the token'
                    : 'There was an error sending the email',
                'email_response' => $email_response
            ]);
            return;
        }

        // Mail was sent successfully!!
        echo json_encode(['response' => true, 'msg' => 'An email has been sent to reset your password.']);
    }
}