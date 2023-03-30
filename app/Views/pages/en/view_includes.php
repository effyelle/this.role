<?php
switch (esc($page)) {
    case 'Signin':
    case 'Signup':
        include 'header.php';
        break;
    default:
        include 'nav.php';
        include 'aside.php';
        break;
}
