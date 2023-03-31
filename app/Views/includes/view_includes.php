<?php

$templatesDir = __DIR__ . '/../pages/templates';

switch (esc($page)) {
    case 'signin':
    case 'signup':
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
