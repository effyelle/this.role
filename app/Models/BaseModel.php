<?php

namespace App\Models;

use CodeIgniter\Model;
use \Config\Database as db;

abstract class BaseModel extends Model
{
    abstract function updt(array $data): bool;
}