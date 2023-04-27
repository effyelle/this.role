const aqws = function (t) {
    let el = document.querySelectorAll(t);
    this.click = (callback) => {
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener('click', callback);
        }
    };
    for (let i = 0; i < el.length; i++) {
        el[i].click = (callback) => {
            el[i].addEventListener('click', callback);
        }
    }
    return el;
}

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

// ON PRESS ENTER INSIDE INPUT searchClient
$('#searchClient').keypress(function (e) {
    if (e.which == 13) {//Enter key pressed
        // IF VALUE ENTERED IS A NUMBER BETWEEN 1 AND 99999
        if (this.value > 0 && this.value < 99999) {
            // AJAX TO app/search_no_master_contract passing the value entered as id_clientes_intranet via POST
            $.ajax({
                type: "POST",
                url: "/app/search_no_master_contract",
                data: {id_clientes_intranet: this.value},
                dataType: "json ",
                success: function (response) {
                    if (response !== 'NOT_FOUND') {
                        // REDIRECT WEBPAGE TO general/contracts/detail
                        window.location.href = '/general/contracts/detail/' + response + '/comercial';
                    } else {
                        // SHOW TOASTER
                        toastr.error('ID Cliente Intranet - Incorrecto');
                        // CLEAR
                        $('#searchClient').val('');
                    }
                }
            });
        } else {
            // SHOW TOASTER
            toastr.error('ID Cliente Intranet - Incorrecto');
            $('#searchClient').val('');
        }
    }
});

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
