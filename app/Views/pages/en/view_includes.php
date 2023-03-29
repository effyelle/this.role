<?php
switch (esc($page)) {
    case 'Home':
        include 'nav.php';
        include 'aside.php';
        break;
    case 'Signin':
    case 'Signup':
        include 'header.php';
        break;
}
