<?php

namespace App\Models;

class GameSheetModel extends BaseModel
{
    protected $table = 'game_sheet';
    protected string $relatedTable = 'game_journal';
    protected $primaryKey = 'sheet_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;
}