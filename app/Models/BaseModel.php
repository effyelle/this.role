<?php

namespace App\Models;

use \Config\Database as db;

use CodeIgniter\Model;

class BaseModel extends Model
{
    protected $table;
    protected string $relatedTable;
    protected $primaryKey;

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields;

    function get($id = null): array|bool
    {
        $builder = db::connect()
            ->table($this->table)
            ->select('*');
        if (isset($id)) $builder->where('game_id', $id);
        if ($result = $builder->get()->getResultArray()) return $result;
        return false;
    }

    function updt($data, $where): bool
    {
        return db::connect()->table($this->table)->update($data, $where);
    }

    function new($data): bool
    {
        return db::connect()->table($this->table)->insert($data);
    }
}