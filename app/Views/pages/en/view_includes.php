<?php
switch (esc($page)) {
    case 'signin':
    case 'signup':
        include 'header.php';
        break;
    default:
        include 'nav.php';
        include 'aside.php';
        break;
}
