<?php

namespace App\Models;

use CodeIgniter\Model;
use \Config\Database as db;

class TokenModel extends Model
{
    protected $table = 'tokens';
    protected $primaryKey = 'token';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['token', 'token_user', 'token_expires'];

    /**
     * @param string|null $token
     * @param bool $exp
     * @return array|bool
     */
    function get(string $token = null, bool $exp = true): array|bool
    {
        $builder = db::connect()->table($this->table);
        $builder->select('token, token_user');
        if (isset($token)) {
            $builder->where('token', $token);
        }
        if ($exp) $builder->where('token_expires >', date('Y-m-d H:i:s', time()));
        if ($tokens = $builder->get()->getResultArray()) {
            if (count($tokens) === 1) return $tokens[0];
            if (count($tokens) > 0) return $tokens;
        }
        return false;
    }

    /**
     * @param string $token
     * @param string $usermail
     * @return array|bool
     */
    function new(string $token, string $usermail): array|bool
    {
        $builder = db::connect()->table($this->table);
        if ($builder->insert(['token' => $token, 'token_user' => $usermail])) {
            return $this->get($token);
        }
        return false;
    }

    /**
     * @param array $data
     * @param array $where
     * @return bool
     */
    function updt(array $data, array $where): bool
    {
        return (db::connect()->table($this->table))->update($data, $where);
    }
}