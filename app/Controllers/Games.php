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
                'img_src' => '18915186841312867612.jpg'
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
                'img_src' => '18915186841312867612.jpg'
            ]
        ];
        // Database connect, get games, then load
        return template('games', $data);
    }
}