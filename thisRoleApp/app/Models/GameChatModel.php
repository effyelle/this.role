<?php

namespace App\Models;

class GameChatModel extends BaseModel
{
    protected $table = 'game_chat';
    protected string $relatedTable = '';
    protected $primaryKey = 'chat_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;
}