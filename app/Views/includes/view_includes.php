<?php

$templatesDir = __DIR__ . '/../templates';

if (isset($page)) {
    switch ($page) {
        case 'home':
        case 'games':
        case 'profile':
        case 'issues':
        case 'about':
        case 'admin/users':
        case 'admin/games':
        case 'admin/patch':
            include $templatesDir . '/nav.php';
            include $templatesDir . '/aside.php';
            break;
        case 'game':
            include $templatesDir . '/aside_game.php';
            include $templatesDir . '/nav_game.php';
            break;
        default:
            include $templatesDir . '/header.php';
            break;
    }
}