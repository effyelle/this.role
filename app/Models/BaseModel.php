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

    /**
     * Select from table
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param array|null $where -must receive as keys the table column names and as values the values to set the conditions
     * @param array|null $join -must receive as keys the tables to join and as values the condition that joins tables
     *
     * @return array
     */
    function get(array $where = null, array $join = null): array
    {
        $builder = db::connect()
            ->table($this->table)
            ->select('*');

        if (isset($join)) {
            foreach ($join as $k => $v) {
                $builder->join($k, $v);
            }
        }

        if (isset($where)) {
            foreach ($where as $k => $v) {
                $builder->where($k, $v);
            }
        }
        return $builder->get()->getResultArray();
    }


    /**
     * @param array $data -must receive as keys the table column names and as values the values to update
     * @param array $where -must receive as keys the table column names and as values the values to set the conditions
     *
     * @return bool
     */
    function updt(array $data, array $where): bool
    {
        return db::connect()->table($this->table)->update($data, $where);
    }

    /**
     * @param $data -must receive as keys the table column names and as values the values to insert
     *
     * @return bool
     */
    function new($data): bool
    {
        return db::connect()->table($this->table)->insert($data);
    }

    function maxID()
    {
        return db::connect()
            ->table($this->table)
            ->select('MAX(' . $this->primaryKey . ')')
            ->get()->getRow();
    }
}