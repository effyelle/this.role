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
        'user_confirmed', 'user_deleted'];

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Get user
     * -----------------------------------------------------------------------------------------------------------------
     * Returns all users if no parameters are given.
     * If email or id are given, searches for that specific user.
     * Returns false if no users are found.
     *
     * @param string|null $email
     * @param int|null $id
     * @return array|bool
     */
    function get(string $email = null, int $id = null): array|bool
    {
        $builder = db::connect()
            ->table($this->table)
            ->select('*');
        if (isset($email)) $builder->where('user_email', $email);
        if (isset($id)) $builder->where('user_id', $id);
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
     * Inserts new user into DB.
     *
     * @param array $data
     * @return array|bool
     */
    function new(array $data): array|bool
    {
        return db::connect()
            ->table($this->table)
            ->insert($data);
    }

    /**
     * @param array $data
     * @param array $where
     * @return bool
     */
    function updt(array $data, array $where): bool
    {
        return (db::connect()
            ->table($this->table))
            ->update($data, $where);
    }
}