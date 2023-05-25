<?php

namespace App\Models;

class IssuesModel extends BaseModel
{
    protected $table = 'issues';
    protected $primaryKey = 'issue_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['issue_id', 'issue_user', 'issue_title', 'issue_msg'];
}