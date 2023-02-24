<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index($lang = 'en'): string
    {
        return template($lang);
    }

}
