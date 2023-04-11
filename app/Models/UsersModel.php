<?php

namespace App\Models;

use CodeIgniter\Model;
use \Config\Database as db;

class UsersModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['user_id', 'user_fname', 'user_username', 'user_avatar', 'user_email', 'user_pwd',
        'user_confirmed_account', 'user_deleted'];

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Get user
     * -----------------------------------------------------------------------------------------------------------------
     * Returns all users if no parameters are given. If username or username and email are given, searches for that
     * specific user. If no users are found returns false.
     *
     * @param string|null $username
     * @param string|null $email
     *
     * @return array|bool
     */
    function get(string $username = null, string $email = null, bool $confirmed = true): array|bool
    {
        $builder = db::connect()->table($this->table);
        $builder->select('*');
        if (isset($email)) {
            $builder->where('user_email', $email);
        } else if (isset($username)) {
            if ($confirmed) $builder->where('user_confirmed IS NOT NULL', null, false);
            else $builder->where('user_confirmed IS NULL', null, false);
            $builder->where('user_deleted IS NULL', null, false);
            $builder->where('user_username', $username);
        }
        if ($user = $builder->get()->getResultArray()) {
            if (count($user) > 1) return $user;
            if (count($user) === 1) return $user[0];
        }
        return false;
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * New user
     * -----------------------------------------------------------------------------------------------------------------
     *
     *
     * @param string $username
     * @param string $email
     * @param string $pwd
     * @return array|bool
     */
    function new(string $username, string $email, string $pwd): array|bool
    {
        $builder = db::connect()->table($this->table);
        if ($builder->insert(['user_username' => $username, 'user_email' => $email, 'user_pwd' => $pwd])) {
            // return $this->get($username); // ID insert with permission later
            return true;
        }
        return false;
    }

    function confirmAccount($email): bool
    {
        if (!$this->get(null, $email)) {
            return false;
        }
        $builder = db::connect()->table($this->table);
        return $builder->update(['user_confirmed' => date('Y-m-d h:i:s', time())], ['user_email' => $email]);
    }
}