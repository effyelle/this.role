<?php

$templatesDir = __DIR__ . '/../templates';

switch (esc($page)) {
    case 'login':
    case 'signup':
    case 'account_created':
        include $templatesDir . '/header.php';
        break;
    case 'game':
        include $templatesDir . '/rolls.historical.php';
        include $templatesDir . '/game.img.list.php';
        break;
    default:
        include $templatesDir . '/nav.php';
        include $templatesDir . '/aside.php';
        break;
}
