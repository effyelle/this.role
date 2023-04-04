<?php

namespace App\Models;

use CodeIgniter\Database\ConnectionInterface;
use CodeIgniter\Model;
use CodeIgniter\Validation\ValidationInterface;

class UsersModel extends Model
{
    protected $table = 'user';
    protected $secondaryTable = 'user_permission';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['fname', 'username', 'prof_pic', 'email', 'pwd'];

    function get(string $username = null): array|bool
    {
        $builder = (\Config\Database::connect())->table($this->table);
        $builder->select('*');
        if (isset($username)) {
            $builder->where('username', $username);
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
        if ($builder->insert(['username' => $username, 'email' => $email, 'pwd' => $pwd])) {
            $builder->select('id');
            $builder->where('username', $username);
            return $builder->get()->getResultArray(); // ID insert with permission later
        }
        return false;
    }

    function user_has_permission($id_user, $id_permission)
    {

    }
}