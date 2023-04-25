<?php

namespace App\Models;

class GamePlayerModel extends BaseModel
{
    protected $table = 'game_player';
    protected string $relatedTable = '';
    protected $primaryKey = 'game_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;
}