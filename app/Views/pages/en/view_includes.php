<?php
switch (esc($page)) {
    case 'signin':
    case 'signup':
        include 'header.php';
        break;
    case 'game':
        break;
    default:
        include 'nav.php';
        include 'aside.php';
        break;
}
