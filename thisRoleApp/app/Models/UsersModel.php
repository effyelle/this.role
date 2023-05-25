<?php

namespace App\Models;

class UsersModel extends BaseModel
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['user_id', 'user_fname', 'user_username', 'user_avatar', 'user_email', 'user_pwd',
        'user_confirmed', 'user_deleted'];
}