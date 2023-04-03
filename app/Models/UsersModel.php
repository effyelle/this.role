<?php

namespace App\Models;

use CodeIgniter\Database\ConnectionInterface;
use CodeIgniter\Model;
use CodeIgniter\Validation\ValidationInterface;

class UsersModel extends Model
{
    protected $table = 'user';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['fname', 'username', 'prof_pic', 'email', 'pwd'];

    function login(string $username): array|bool
    {
        $builder = (\Config\Database::connect())->table($this->table);
        $builder->select('*');
        $builder->where('username', $username);
        $user = $builder->get()->getResultArray();
        if (count($user) === 1) {
            return $user[0];
        }
        return false;
    }

    function new(string $username, string $email, string $pwd): bool
    {
        $builder = (\Config\Database::connect())->table($this->table);
        if ($builder->insert(['username' => $username, 'email' => $email, 'pwd' => $pwd])) {
            return true;
        }
        return false;
    }
}