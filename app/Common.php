<?php

function template(string $page = 'home', bool $header = true)
{
    if (is_file(APPPATH . 'Views/pages/' . $page . '.php')) {
        return view('includes/head', ['page' => ucfirst($page)])
            . ($header === true ? view('pages/header') : '')
            . view('pages/' . $page)
            . view('pages/footer')
            . view('includes/foot');
    }
}