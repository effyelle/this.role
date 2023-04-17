<?php

namespace App\Controllers;

class Games extends BaseController
{
    protected mixed $model;

    function __construct()
    {
        $this->model = model('GamesModel');
    }

    function list(): string
    {
        $data['games']=$this->model->get();
        // Database connect, get games, then load
        return template('games', $data);
    }

    function game(int $id = null): string
    {
        if (isset($id)) {
            $data = $this->model->get($id);
            return template('game', ['game' => $data]);
        }
        return template('game_not_found');
    }
}