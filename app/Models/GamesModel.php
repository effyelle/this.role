<?php

namespace App\Models;

use CodeIgniter\Model;

class GamesModel extends Model
{
    protected $table = 'games';
    protected $relatedTable = '';
    protected $primaryKey = 'id_game';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = [];

    function get($id = null): array|bool
    {
        if (isset($id)) {
            return ['game' => $id];
        }
        return false;
    }
}