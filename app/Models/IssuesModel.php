<?php

namespace App\Models;

use CodeIgniter\Model;
use \Config\Database as db;

class IssuesModel extends Model
{
    protected $table = 'issues';
    protected $primaryKey = 'issue_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['issue_id', 'issue_user', 'issue_title', 'issue_msg'];

    function get($issueID = null): array|bool
    {
        $builder = db::connect()
            ->table($this->table)
            ->select('*')
            ->join('users', 'users.user_id=issues.issue_user');
        if (isset($issueID)) $builder->where('issue_id', $issueID);
        if ($issues = $builder->get()->getResultArray()) {
            if (count($issues) === 1) return $issues[0];
            if (count($issues) > 0) return $issues;
        }
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