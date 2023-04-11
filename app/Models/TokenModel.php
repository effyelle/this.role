<?php

namespace App\Models;

use CodeIgniter\Model;
use \Config\Database as db;

class TokenModel extends Model
{
    protected $table = 'tokens';
    protected $primaryKey = 'token_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['token_id', 'token', 'token_user', 'token_expires', 'token_deleted'];

    /**
     * @param string $token
     * @param bool $exp
     * @return array|bool
     */
    function get(string $token, bool $exp = true): array|bool
    {
        $builder = db::connect()->table($this->table);
        $builder->select('token, token_user');
        $builder->where('token', $token);
        if ($exp) {
            $builder->where('token_expires >', date('Y-m-d h:i:s', time()));
        }
        if ($token = $builder->get()->getResultArray()) {
            if (count($token) === 1) return $token[0];
        }
        return false;
    }

    /**
     * @param string $token
     * @param int $user
     * @return array|bool
     */
    function new(string $token, int $user): array|bool
    {
        $builder = db::connect()->table($this->table);
        if ($builder->insert(['token' => $token, 'token_user' => $user])) {
            return $this->get($token);
        }
        return false;
    }
}