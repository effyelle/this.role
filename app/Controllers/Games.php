<?php

namespace App\Controllers;

class Games extends BaseController
{
    protected $model;

    function __construct()
    {
        $this->model = model('App\Models\GamesModel');
    }

    function list(): string
    {
        $data['gamesSample'] = [
            [
                'id_game' => 1,
                'id_user' => 3,
                'username' => 'username1',
                'title' => 'Titulo',
                'img_src' => '9fa22b8469d26d2a93181739bc4a3fed.jpg'
            ],
            [
                'id_game' => 2,
                'id_user' => 1,
                'username' => 'username2',
                'title' => 'Titulo 2',
                'img_src' => '18915186841312867612.jpg'
            ],
            [
                'id_game' => 3,
                'id_user' => 2,
                'username' => 'username3',
                'title' => 'Titulo 3 - Titulo mas largo',
                'img_src' => '543545785321847323124886.jpg'
            ]
        ];
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