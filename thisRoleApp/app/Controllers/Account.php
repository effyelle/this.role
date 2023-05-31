<?php

namespace App\Controllers;

/**
 * \App\Controllers\Account manages all basic user actions and responses, such as creating an account, logging in,
 * updating user details, deactivating the account, sending a confirmation or password recovery email, redirecting to
 * the user's profile or messages, manage user issues, and generate the necessary tokens. About half of these
 * functions print a response encoded in .json format because they are called from Javascript via AJAX.
 */
class Account extends BaseController
{
    /**
     * Instance of UsersModel class
     * @var mixed|\App\Models\UsersModel|null
     */
    protected mixed $usermodel;

    /**
     * Instance of TokenModel class
     * @var mixed|\App\Models\TokenModel|null
     */
    protected mixed $tokenmodel;

    /**
     * Instance of IssuesModel class
     * @var mixed|\App\Models\IssuesModel|null
     */
    protected mixed $issuesmodel;

    /**
     * Variable to save current datetime stamp in the desired format.
     * @var string
     */
    protected string $now;
    /**
     * Default avatar for users
     *
     * @var string
     */
    protected string $defaultAvatar = '/assets/media/avatars/blank.png';

    function __construct()
    {
        $this->usermodel = model('UsersModel');
        $this->tokenmodel = model('TokenModel');
        $this->issuesmodel = model('IssuesModel');
        $this->now = date('Y-m-d H:i:s', time());
    }

    /**
     * ---
     * LOGIN
     * ---
     * Verify user exists and password is correct and send a response through json_encode. This function is to be called
     * from a Javascript AJAX.
     *
     * ---
     * Parameters via $_REQUEST:
     * - $_POST['username']: username to check account exists
     * - $_POST['pwd']: password to verify
     *
     * ---
     * After login, the user data will be saved in $_SESSION. Session has to be already initialized at this point.
     *
     * @return void
     */
    function login(): void
    {
        $userIdentification = $_POST['user'] ?? false;
        $pwd = $_POST['pwd'] ?? false;
        if ($userIdentification && $pwd) {
            $userByUsername = $this->usermodel->get(['user_username' => $userIdentification, 'user_deleted' => null]);
            $userByEmail = $this->usermodel->get(['user_email' => $userIdentification, 'user_deleted' => null]);
            if (count($userByEmail) === 1) $user = $userByEmail[0];
            if (count($userByUsername) === 1) $user = $userByUsername[0];
            if (isset($user)) {
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
     * ---
     * SIGNUP
     * ---
     * Check if username and email already exist in Database. If they don't, attempts to create a new user.
     *
     * Parameters via $_POST:
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
        // * WARNING - Email being rejected for spam * //
        // Send confirmation email and insert new user into Database
        /*
        $email_response = $this->sendConfirmationEmail($email, $username);
        // If $email_response returns false means token could not be created.
        // If it returns a string it is a debug message and email could not be sent.
        if ($email_response !== true) {
            echo json_encode([
                'response' => false,
                'msg' => $email_response === false
                    ? 'There was a problem adding the token'
                    : 'Mail could not be sent=> ',
                'email_response' => $email_response
            ]);
            return;
        }
        */
        $pwd = password_hash($pwd, PASSWORD_DEFAULT);
        if (!$this->usermodel->new([
            'user_username' => $username,
            'user_email' => $email,
            'user_pwd' => $pwd,
            'user_avatar' => $this->defaultAvatar,
            'user_confirmed' => $this->now // Comment this line if email is working
        ])) {
            echo json_encode(['response' => false, 'msg' => 'User could not be added']);
            return;
        }
        echo json_encode(['response' => true]);
    }

    /**
     * ---
     * UPDATE PROFILE
     * ---
     * Check if username and email were changed and if they match existing ones in database. If not, send a confirmation
     * email if it was changed. Attempt to upload new avatar if it was set.
     *
     * Returns a string with a response message.
     *
     * Parameters via $_POST
     *  - username
     *  - fname
     *  - email
     * Possible parameter via $_FILES -> avatar
     *
     * @return string
     */
    function updateProfile(): string
    {
        $response = '';
        $newUsername = validate($_POST['username']);
        $newFullName = validate($_POST['fname']);
        $newEmail = validate($_POST['email']);
        // * Check if username and email are taken by another user * //
        if ($newUsername !== '' && $newFullName !== '' && $newEmail !== '') {
            // Save old email and old username to variables
            $oldEmail = $_SESSION['user']['user_email'];
            $oldUsername = $_SESSION['user']['user_username'];
            if (// Check if username or email changed and are already taken
                ($oldUsername !== $newUsername && $this->usermodel->get(['user_username' => $newUsername])) ||
                ($oldEmail !== $newEmail && $this->usermodel->get(['user_email' => $newEmail]))
            ) { // If one of them match, return an error
                return 'The username or email are already in use.';
            }

            // * Begin::Filling up $data=[] * //
            $data = [
                'user_username' => $newUsername,
                'user_fname' => $newFullName,
                'user_email' => $newEmail
            ];
            // Unconfirm account if email was changed
            // if ($newEmail !== $oldEmail) $data['user_confirmed'] = null;

            if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
                /* Begin::Upload new avatar */
                $img = upload_img('avatar', 'assets/media/avatars');
                if (preg_match('/[0-9]/', $img)) {
                    $data['user_avatar'] = '/' . $img;
                    // Return error if file was not uploaded
                } else $response = $img;
                // * End::Upload new avatar * //
            }
            // * End::Filling up $data=[] * //

            // Update user in Database
            if ($this->usermodel->updt(
                $data, // data
                ['user_id' => $_SESSION['user']['user_id']] // where
            // If successfull, update session
            )) update_session($this->usermodel->get(['user_email' => $newEmail])[0]);
            // Send confirmation account email if email was changed
            /*if ($newEmail !== $oldEmail) {
                $email_response = $this->sendConfirmationEmail($newEmail, $newUsername);
                // Return error if email could not be sent
                $response = ($email_response === true)
                    ? '<span class="fs-4">Your email was updated, an email has been sent for confirmation</span>'
                    : ($email_response === false
                        ? 'There was a problem adding the token'
                        : 'Mail could not be sent=> ' . $email_response);
            }*/
        } // Fields missing
        else $response = 'Rellena todos los campos';
        return $response;
    }

    /**
     * ---
     * USER PROFILE
     * ---
     * Redirect to user profile tab according to parameters. Send possible user issues messages to HTML in the $data
     * array. Returns the and HTML view.
     *
     * @param string $tab
     *
     * @return string
     */
    function profile_issues(string $tab = 'myprofile'): string
    {
        $error = '';
        if (isset($_POST['fname'])) {
            $error = $this->updateProfile();
        }
        $data = ['error' => $error, 'tab' => $tab];
        if ($issues = $this->issuesmodel->get(['issue_user' => $_SESSION['user']['user_username']])) $data['issues_list'] = $issues;
        return template('user_profile/tabs_content', $data);
    }

    /**
     * ---
     * GENERATE TOKEN FOR EMAILING
     * ---
     * Token is generated by current timestamp using the PHP function {@link time()}. Email receive will be used to
     * expire the date of all previous tokens for that user, then adding the new one to database. Returns the token if
     * sucessfull, or false if not.
     *
     * @param string $email
     *
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
     * ---
     * SEND ACCOUNT CONFIRMATION EMAIL
     * ---
     * Generates token via {@link generateToken()} and includes it in the email body sent to the address given.
     * Returns true if email was sent successfully and an error response if not.
     *
     * @param $email
     * @param $user
     *
     * @return bool|string
     */
    function sendConfirmationEmail($email, $user = null): bool|string
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $mail = new Mailer();
        $subject = 'Welcome ' . ($user ?? '') . '! Please, confirm your Account.';
        $message = view('templates/mail/confirm_account_html', ['token' => $token]);
        $target_mail = $email;
        return $mail->send_mail_($subject, $message, $target_mail);
    }

    /**
     * ---
     * SEND EMAIL FOR PASSWORD RESET
     * ---
     * Generate a token via {@link generateToken()} and then attempt to send it to the email given.
     * Returns true if email was sent successfully and an error response if not.
     *
     * @param $email
     * @param $user
     *
     * @return bool|string
     */
    function sendResetPasswordEmail($email, $user): bool|string
    {
        // Generate token
        $token = $this->generateToken($email);
        if (!$token) return false;
        // Send email
        $mail = new Mailer();
        $subject = 'Hello, ' . $user . '! Here is your password reset';
        $message = view('templates/mail/reset_pwd_html', ['token' => $token]);
        $target_mail = $email;
        return $mail->send_mail_($subject, $message, $target_mail);
    }

    /**
     * ---
     * CONFIRM ACCOUNT
     * ---
     * Checks if the received token exists and has not expired. If token is valid, it attempts to update the
     * user_confirmed field in database and expire the token recently used.
     *
     * Returns a string with an HTML view according to the response of these actions.
     *
     * @param $token
     *
     * @return string
     */
    function confirm($token): string
    {
        $t = $this->tokenmodel->get(['token' => $token, 'token_expires >' => $this->now]);
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

    /**
     * ---
     * PASSWORD RESET VIEW
     * ---
     * Checks if the received token exists and has not expired.
     * Returns the user to the password reset form if token is valid, or to a response page of 'token expired' if not.
     *
     * @param $token
     *
     * @return string
     */
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

    /**
     * ---
     * RESET PASSWORD
     * ---
     * Attempts to update the password for the user with the password and token given, making the token exprire.
     *
     * Parameters via $_POST
     *  - token: the token used to get to this method
     *  - pwd: the new password
     *
     * @return void
     */
    function reset_password(): void
    {
        // Check request fields
        if (isset($_POST['pwd']) && isset($_SESSION['user'])) {
            // Hash new password
            $hash = password_hash($_POST['pwd'], PASSWORD_DEFAULT);
            // Get email from token
            $email = $_SESSION['user']['user_email'];
            // Update fields
            if ($this->usermodel->updt(
                ['user_pwd' => $hash], // data
                ['user_email' => $email] // where
            )) {
                session_unset();
                session_destroy();
                echo json_encode(['response' => true]);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'There was a problem in database']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Fields are missing', 'data' => $_POST]);
    }

    /**
     * ---
     * ACCOUNT WAS CREATED VIEW
     * ---
     * Returns a string with and HTML view.
     *
     * @return string
     */
    function created(): string
    {
        return template('tokens/email_sent', ['unlogged' => 'unlogged']);
    }

    /**
     * ---
     * CHECK LAST ADMINS/MASTERADMINS
     * ---
     * Check if an admin or masteradmin can be deactivated by checking if that user is the last one.
     *
     * This function is called from My Profile section in HTML.
     *
     * @param string $rol
     * @return bool
     */
    function canDeleteUser(string $rol = 'admin'): bool
    {
        return !($_SESSION['user']['user_rol'] === $rol &&
            count($this->usermodel->get(['user_rol' => $rol, 'user_deleted' => null])) === 1);
    }

    /**
     * ---
     * DEACTIVATE ACCOUNT
     * ---
     * Checks if user can be deactivated via {@link canDeleteUser}.
     * If so, update user_deleted field in database to the current datetime and destroy the user session.
     *
     * @return void
     */
    function deactivate(): void
    {
        if (isset($_SESSION['user'])) {
            if (!$this->canDeleteUser() || !$this->canDeleteUser('masteradmin')) {
                echo json_encode([
                    'response' => false,
                    'msg' => 'You are the last admin. Promote another to delete your account.'
                ]);
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

    /**
     * ---
     * UPDATE USERNAME IN ISSUES TABLE
     * ---
     * Update old username according to parameters so that messages show the new one.
     *
     * @param string $old_username
     * @param string $new_username
     *
     * @return bool
     */
    function updateIssuesMessages(string $old_username, string $new_username): bool
    {
        // Get all issues
        $all_issues = $this->issuesmodel->get();

        // Update all matching usernames in messages with the new username
        if (is_array($all_issues) && count($all_issues) > 0) {
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
        }
        return true;
    }

    /**
     * ---
     * NEW ISSUE
     * ---
     * Insert a new issue into issues table and print a response accordingly.
     * This method begins a new chain of issues, it doesnt not insert a message into an existing issue.
     *
     * @return void
     */
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

    /**
     * ---
     * NEW ISSUE MESSAGE
     * ---
     * Insert a new message into an existing issue. This method DOES NOT generate new issues.
     *
     * @return void
     */
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
            echo json_encode(['response' => false, 'session' => $_SESSION['user']]);
            return;
        }
        echo json_encode(['response' => false, 'session' => $_SESSION]);
    }

    /**
     * ---
     * SEND RESET PASSWORD EMAIL
     * ---
     * AJAX call to send a Password Recovery Email. Prints a response accordingly.
     *
     * @param $email
     *
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