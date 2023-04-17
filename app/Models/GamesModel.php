<?php

namespace App\Models;

use \Config\Database as db;

class GamesModel extends BaseModel
{
    protected $table = 'games';
    protected string $relatedTable = 'invite_url';
    protected $primaryKey = 'game_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['game_id', 'game_user_creator', 'game_title', 'game_icon', 'game_is_public', 'game_deleted'];
}