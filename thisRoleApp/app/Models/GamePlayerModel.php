<?php

namespace App\Models;

class GamePlayerModel extends BaseModel
{
    protected $table = 'game_player';
    protected string $relatedTable = '';
    protected $primaryKey = '(game_player_id_user, game_player_id_game)';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;
}