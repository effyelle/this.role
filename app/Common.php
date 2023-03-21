<?php

function template(string $page = 'home'): string
{
    $lang = client_lang();
    if (is_file(APPPATH . 'Views/pages/' . $lang . '/' . $page . '.php')) {
        return view('includes/head', ['page' => ucfirst($page)])
            . view('pages/' . $lang . '/header')
            . view('pages/' . $lang . '/' . $page)
            . view('pages/' . $lang . '/footer')
            . view('includes/foot');
    } else {
        return $lang;
    }
}

function client_lang(): string
{
    return 'en';
}