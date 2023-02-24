<?php

function template($lang, string $page = 'home')
{
    if (is_file(APPPATH . 'Views/pages/' . $lang . '/' . $page . '.php')) {
        return view('includes/head', ['page' => ucfirst($page)])
            . view('pages/' . $lang . '/header')
            . view('pages/' . $lang . '/' . $page)
            . view('pages/' . $lang . '/footer')
            . view('includes/foot');
    } else{
        return $lang;
    }
}