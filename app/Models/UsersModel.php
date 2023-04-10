<?php

namespace App\Models;

use CodeIgniter\Database\ConnectionInterface;
use CodeIgniter\Model;
use CodeIgniter\Validation\ValidationInterface;

class UsersModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['user_id', 'user_fname', 'user_username', 'user_avatar', 'user_email', 'user_pwd', 'user_confirmed_account', 'user_deleted'];

    function get(string $username = null): array|bool
    {
        $builder = (\Config\Database::connect())->table($this->table);
        $builder->select('*');
        if (isset($username)) {
            $builder->where('user_confirmed IS NOT NULL', null, false);
            $builder->where('user_deleted IS NULL', null, false);
            $builder->where('user_username', $username);
        }
        if ($user = $builder->get()->getResultArray()) {
            if (count($user) > 1) return $user;
            if (count($user) === 1) return $user[0];
        }
        return false;
    }

    function new(string $username, string $email, string $pwd): bool|array
    {
        $builder = (\Config\Database::connect())->table($this->table);
        if ($builder->insert(['user_username' => $username, 'user_email' => $email, 'user_pwd' => $pwd])) {
            $builder->select('user_id');
            $builder->where('user_username', $username);
            return $builder->get()->getResultArray()[0]; // ID insert with permission later
        }
        return false;
    }

    function user_has_permission($id_user, $id_permission)
    {

    }
}