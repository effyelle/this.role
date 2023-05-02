<?php

namespace App\Models;

use CodeIgniter\Database\ConnectionInterface;
use CodeIgniter\Validation\ValidationInterface;

class GameLayersModel extends BaseModel
{
    protected $table = 'game_layers';
    protected string $relatedTable = '';
    protected $primaryKey = 'layer_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    function setTable($table): void
    {
        $this->table = $table;
    }
}