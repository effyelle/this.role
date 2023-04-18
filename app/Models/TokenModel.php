<?php

namespace App\Models;

class TokenModel extends BaseModel
{
    protected $table = 'tokens';
    protected $primaryKey = 'token';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['token', 'token_user', 'token_expires'];
}