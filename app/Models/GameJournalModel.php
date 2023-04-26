<?php

namespace App\Models;

class GameJournalModel extends BaseModel
{
    protected $table = 'game_journal';
    protected string $relatedTable = '';
    protected $primaryKey = 'item_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;
}