let blockUIGeneral = new KTBlockUI(document.querySelector("body"));
let url_string = window.location.href
let url = new URL(url_string);
let searchSuccess = url.searchParams.get("msg-suc");
if (searchSuccess !== null && searchSuccess !== '') {
    toastr.success(searchSuccess);
    history.replaceState(null, null, location.href.replace(/[\?&]msg-suc=[^&]+/, '').replace(/^&/, '?'));
}
let searchWarnings = url.searchParams.get("msg-war");
if (searchWarnings !== null && searchWarnings !== '') {
    toastr.warning(searchWarnings);
    history.replaceState(null, null, location.href.replace(/[\?&]msg-war=[^&]+/, '').replace(/^&/, '?'));
}
let searchErrors = url.searchParams.get("msg-err");
if (searchErrors !== null && searchErrors !== '') {
    toastr.error(searchErrors);
    history.replaceState(null, null, location.href.replace(/[\?&]msg-err=[^&]+/, '').replace(/^&/, '?'));
}

function appendURLParam(param) {
    let url = window.location.href;
    if (url.indexOf('?') > -1) {
        url += '&' + param;
    } else {
        url += '?' + param;
    }
    return url;
}

function copyClipboard(textToCopy) {
    // Copy the text inside the text field
    let copied = navigator.clipboard.writeText(textToCopy);
    if (copied.status === 200) {
        console.log('Copy!');
    }
    // SHOW TOASTER
    toastr.success('Copiado al portapapeles');
}

addEventListener('beforeunload', (event) => {
    blockUIGeneral.block();
});


// FIX TOOLTIP DATATABLE PAGINATION
$(document).ready(function () {
    $('tbody').on('mouseover', 'tr', function () {
        $('[data-bs-toggle="tooltip"]').tooltip({
            trigger: 'hover',
            html: true
        });
    });
});
