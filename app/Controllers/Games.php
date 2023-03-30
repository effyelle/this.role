<?php

namespace App\Controllers;

class Games extends BaseController
{
    function list(): string
    {
        $data['gamesSample'] = [
            [
                'userId' => 3,
                'username' => 'effyelle',
                'title' => 'Timeless',
                'img_src' => '9fa22b8469d26d2a93181739bc4a3fed.jpg'
            ],
            [
                'userId' => 1,
                'username' => 'keinarman',
                'title' => 'Indamar Chronicles',
                'img_src' => '18915186841312867612.jpg'
            ],
            [
                'userId' => 2,
                'username' => 'fedora',
                'title' => 'Velkia Tales - Omen Seekers',
                'img_src' => '543545785321847323124886.jpg'
            ]
        ];
        // Database connect, get games, then load
        return template('games', $data);
    }
}