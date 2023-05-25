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
     * @param array|null $join -must receive as key(s) the table(s) to join and as value(s) the comparing condition
     * @param array|null $orderBy -must receive as key the column to order by and as value to direction (ASC, DESC)
     *
     * @return array
     */
    function get(array $where = null, array $join = null, array $orderBy = null): array
    {
        $builder = db::connect()
            ->table($this->table)
            ->select();
        // Join
        if (isset($join)) {
            foreach ($join as $k => $v) {
                $builder->join($k, $v);
            }
        }
        // Where
        if (isset($where)) {
            foreach ($where as $k => $v) {
                $builder->where($k, $v);
            }
        }
        // Oder by
        if (isset($orderBy)) {
            foreach ($orderBy as $k => $v) {
                $builder->orderBy($k, $v);
            }
        }
        if ($this->table === 'game_chat') $builder->limit(100);
        return $builder->get()->getResultArray();
    }


    /**
     * @param array $data -must receive as keys the table column names and as values the values to update
     * @param array $where -must receive as keys the table column names and as values the values to set the conditions
     *
     * @return bool
     */
    function updt(array $data, array $where, $table = null): bool
    {
        if (!isset($table)) $table = $this->table;
        return db::connect()->table($table)->update($data, $where);
    }

    /**
     * @param $data -must receive as keys the table column names and as values the values to insert
     *
     * @return bool
     */
    function new($data, $table = null): bool
    {
        if (!isset($table)) $table = $this->table;
        return db::connect()->table($table)->insert($data);
    }

    function del($where): bool
    {
        return db::connect()->table($this->table)->delete($where);
    }

    function maxID()
    {
        return db::connect()
            ->table($this->table)
            ->selectMax($this->primaryKey)
            ->get()->getRow();
    }
}