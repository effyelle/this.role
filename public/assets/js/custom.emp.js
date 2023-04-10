$(document).ready(function () {
    generateDatatable();
});

function generateDatatable() {
    let element = $('.generate-datatable');
    // CHECK IF ELEMENT HAS .show-search-dt
    if (element !== undefined) {
        if (element.hasClass('show-search-dt')) {
            // IF TRUE, ADD SEARCH INPUT
            element.DataTable({
                responsive: true,
                "dom": '<"row float-start"<"col-12"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
            });
            return;
        }
        // IF FALSE, DON'T ADD SEARCH INPUT
        element.DataTable({
            responsive: true
        });
    }
}