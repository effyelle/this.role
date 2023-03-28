var blockUIGeneral = new KTBlockUI(document.querySelector("body"));
var url_string = window.location.href
var url = new URL(url_string);
var c = url.searchParams.get("msg-suc");
if (c!=null && c!='') {
    toastr.success(c);
    history.replaceState(null, null, location.href.replace(/[\?&]msg-suc=[^&]+/, '').replace(/^&/, '?'));
}
var c = url.searchParams.get("msg-war");
if (c!=null && c!='') {
    toastr.warning(c);
    history.replaceState(null, null, location.href.replace(/[\?&]msg-war=[^&]+/, '').replace(/^&/, '?'));
}
var c = url.searchParams.get("msg-err");
if (c!=null && c!='') {
    toastr.error(c);
    history.replaceState(null, null, location.href.replace(/[\?&]msg-err=[^&]+/, '').replace(/^&/, '?'));
}

function appendURLParam(param){
    var url = window.location.href;    
    if (url.indexOf('?') > -1){
        url += '&'+param;
    }else{
        url += '?'+param;
    }
    return url;
}

function copyClipboard(textToCopy){
     // Copy the text inside the text field
    navigator.clipboard.writeText(textToCopy);
    // SHOW TOASTER
    toastr.success('Copiado al portapapeles');
}

// ON PRESS ENTER INSIDE INPUT searchClient
$('#searchClient').keypress(function(e){
    if(e.which == 13){//Enter key pressed
        // IF VALUE ENTERED IS A NUMBER BETWEEN 1 AND 99999
        if (this.value > 0 && this.value < 99999) {
            // AJAX TO app/search_no_master_contract passing the value entered as id_clientes_intranet via POST
            $.ajax({
                type: "POST",
                url: "/app/search_no_master_contract",
                data: {id_clientes_intranet: this.value},
                dataType: "json ",
                success: function (response) {
                    if(response!='NOT_FOUND'){
                        // REDIRECT WEBPAGE TO general/contracts/detail
                        window.location.href = '/general/contracts/detail/'+response+'/comercial';
                    }else{
                        // SHOW TOASTER
                        toastr.error('ID Cliente Intranet - Incorrecto');
                        // CLEAR
                        $('#searchClient').val('');
                    }
                }
            });
        }else{
            // SHOW TOASTER
            toastr.error('ID Cliente Intranet - Incorrecto');
            $('#searchClient').val('');
        }
    }
});

addEventListener('beforeunload',(event) => {
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
