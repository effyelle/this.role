<?php

function template(string $page = 'home', $data = null): string
{
    $lang = client_lang();
    if (is_file(APPPATH . 'Views/pages/' . $lang . '/' . $page . '.php')) {
        $data = $data ?? [];
        $data['page'] = ucfirst($page);
        return view('includes/head', $data)
            . view('pages/' . $lang . '/view_includes')
            . view('pages/' . $lang . '/' . $page)
            . view('pages/' . $lang . '/footer')
            . view('includes/foot');
    } else {
        return 'View not found: "' . $page . '"';
    }
}

function client_lang(): string
{
    return 'en';
}