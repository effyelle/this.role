<?php

function template(string $page = 'home', $data = null): string
{
    if (is_file(APPPATH . 'Views/pages/' . $page . '.php')) {
        $data = $data ?? [];
        if (!isset($data['title'])) $data['title'] = ucfirst($page);
        $data['page'] = $page;
        return view('includes/head', $data)
            . view('includes/view_includes')
            . view('pages/' . $page)
            . view('includes/foot');
    } else {
        return 'View not found: "' . $page . '"';
    }
}