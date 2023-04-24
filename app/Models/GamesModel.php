<?php

namespace App\Models;

class GamesModel extends BaseModel
{
    protected $table = 'games';
    protected string $relatedTable = 'invite_url';
    protected $primaryKey = 'game_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;
}