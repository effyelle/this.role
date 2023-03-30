<?php

namespace App\Controllers;

class Compendium extends BaseController
{
    function index() {
        $data['mainPages']=[];
        return template('', $data);
    }
}