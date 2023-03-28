$(document).ready(function () {
    generateDatatable();
});

function generateDatatable() {
    var element = $('.generate-datatable');
    // CHECK IF ELEMENT HAS .show-search-dt
    if (element != undefined) {
        if (element.hasClass('show-search-dt')) {
            // IF TRUE, ADD SEARCH INPUT
            element.DataTable({
                "language": {
                    "url": "assets/js/datatables.spanish.json"
                },
                "dom": '<"row float-start"<"col-12"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
            });
        }else{
            // IF FALSE, DON'T ADD SEARCH INPUT
            element.DataTable({
                "language": {
                    "url": "assets/js/datatables.spanish.json"
                }
            });
        }
    }
}