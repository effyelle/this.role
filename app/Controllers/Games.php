<?php

namespace App\Controllers;

class Games extends BaseController
{
    function list(): string
    {
        $data['gamesSample'] = [
            [
                'idGame' => 1,
                'idUser' => 3,
                'username' => 'effyelle',
                'title' => 'Timeless',
                'img_src' => '9fa22b8469d26d2a93181739bc4a3fed.jpg'
            ],
            [
                'idGame' => 2,
                'idUser' => 1,
                'username' => 'keinarman',
                'title' => 'Indamar Chronicles',
                'img_src' => '18915186841312867612.jpg'
            ],
            [
                'idGame' => 3,
                'idUser' => 2,
                'username' => 'fedora',
                'title' => 'Velkia Tales - Omen Seekers',
                'img_src' => '543545785321847323124886.jpg'
            ]
        ];
        // Database connect, get games, then load
        return template('games', $data);
    }

    function game(int $id, string $title): string
    {
        return template('game', ['title' => $title, 'idGame' => $id]);
    }
}