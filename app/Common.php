<?php

function template(string $page = 'home', $data = null): string
{
    $lang = client_lang();
    if (is_file(APPPATH . 'Views/pages/' . $lang . '/' . $page . '.php')) {
        $data = $data ?? [];
        if (!isset($data['title'])) $data['title'] = ucfirst($page);
        $data['page'] = $page;
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