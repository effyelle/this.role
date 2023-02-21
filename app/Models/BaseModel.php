<?php

use CodeIgniter\Model;

class BaseModel extends Model
{
    protected $db = 'this_role';

    protected $conn;

    public function __construct(?\CodeIgniter\Database\ConnectionInterface $db = null, ?\CodeIgniter\Validation\ValidationInterface $validation = null)
    {
        parent::__construct($db, $validation);
    }
}