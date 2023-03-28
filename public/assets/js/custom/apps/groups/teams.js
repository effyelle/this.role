$(document).ready(function () {

    // Create teams table
    let table = $('#team-table');
    table = table.DataTable({
        ajax: '/teams/get_coworkers',
        columns: [
            {title: "", data: "avatar", class: "col-1 text-center h-40px w-40px pointer-events-none"},
            {title: "Nombre", data: "name", class: "px-3 pointer-events-none"},
            {title: "Email", data: "email", class: "px-3 pointer-events-none"},
            {title: "Grupo", data: "default_group", class: "px-3", orderable: true}
        ],
        columnDefs: [
            {orderable: false, targets: 0}
        ],
        order: [[3, 'asc']],
        lengthChange: true,
        pageLength: 10,
        searching: true,
        language: {
            "url": "/assets/js/datatables.spanish.json"
        },
        responsive: true,
        drawCallback: function (t) {
            console.log(t.aoData);
        }
    });
    // Configure table search bar
    $('#search').on('keyup', function () {
        let label = $('label[for=search]');
        table.search(this.value).draw();
        if (this.value.length > 0) label.hide();
        else label.show();
    });

    let chart;

    // Create Org-Chart
    function createOrgChart() {
        d3.json('/teams/get_orgchart_info'
            //'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
        ).then(data => {
            chart = new d3.OrgChart()
                .container('#organigrama')
                .data(data)
                .nodeWidth((d) => 175)
                .initialZoom(1)
                .nodeHeight((d) => 120)
                .childrenMargin((d) => 40)
                .compactMarginBetween((d) => 30)
                .compactMarginPair((d) => 60)
                .nodeContent(function (d, i, arr, state) {
                    var initials = "";
                    if(d.data.initials !== undefined && d.data.initials != null && d.data.initials !== "null" ){
                        initials = d.data.initials;
                    }
                    return '' +
                        '<div style="padding-top:30px;background-color:none;margin-left:1px;height:' + d.height + 'px;border-radius:2px;overflow:visible">' +
                        '   <div style="height:' + (d.height - 32) + 'px;padding-top:0;background-color:white;border:1px solid lightgray;">' +
                        '       <img src="' + d.data.avatar + '" style="margin-top:-30px;margin-left:' + (d.width / 2 - 15) + 'px;border-radius:100px;width:30px;height:30px;" alt=""/>' +
                        '       <div style="margin-right:10px;float:right;">' + initials + '</div>' +
                        '       <div style="margin-top:-30px;background-color:#3AB6E3;height:10px;width:' + (d.width - 2) + 'px;border-radius:1px"></div>' +
                        '       <div style="padding:25px 20px 0 20px;text-align:center;margin:5px 0;font-size:11px;">' +
                        '           <div style="color:#111672;font-weight:bold"> ' + d.data.name + ' </div>' +
                        '           <div style="color:#404040;"> ' + d.data.positionName + ' </div>' +
                        '       </div>' +
                        '       <div style="display:flex;justify-content:space-between;padding-left:15px;padding-right:15px;font-size:8px;">' +
                        '           <div style="display:flex;flex-flow:row nowrap;"> Directos: ' + d.data._directSubordinates + ' 👤</div>' +
                        '           <div style="display:flex;flex-flow:row nowrap;"> Indirectos: ' + d.data._totalSubordinates + ' 👤</div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>';
                }).render();
        });
    }
    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        if(target == '#chart_org'){
            createOrgChart();
        }
      });
});