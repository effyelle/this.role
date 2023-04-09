<?php

$templatesDir = __DIR__ . '/../templates';

if (isset($page)) {
    switch ($page) {
        case 'login':
        case 'signup':
        case 'account_created':
            include $templatesDir . '/header.php';
            break;
        case 'game':
            include $templatesDir . '/aside_game.php';
            include $templatesDir . '/nav_game.php';
            break;
        default:
            include $templatesDir . '/nav.php';
            include $templatesDir . '/aside.php';
            break;
    }
}