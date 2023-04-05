<?php

namespace App\Models;

use CodeIgniter\Model;

class GamesModel extends Model
{
    protected $table = 'games';
    protected string $relatedTable = 'invite_url';
    protected $primaryKey = 'game_id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['game_id', 'game_user_creator', 'game_title', 'game_icon', 'game_is_public', 'game_deleted'];

    function get($id = null): array|bool
    {
        if (isset($id)) {
            return ['game' => $id];
        }
        return false;
    }
}