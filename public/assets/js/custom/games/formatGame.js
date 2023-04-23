function formatMenuItem(data = {}) {
    return '<!--begin::Menu Item-->' +
        '<div class="menu-item">' +
        '   <a class="menu-link" href="#">' +
        '       <!--begin::Symbol-->' +
        '       <div class="me-2 symbol symbol-20px symbol-md-30px">' +
        '           <span class="symbol-label circle icon"' +
        '               style="background: ' + data.src + '; background-size:cover;">' +
        '           </span>' +
        '       </div>' +
        '       <!--end::Symbol-->' +
        '       <span class="menu-title">' + data.name + '</span>' +
        '   </a>' +
        '</div>' +
        '<!--end::Menu Item-->';
}

const Chat = function (querySelector) {
    this.record = document.querySelector(querySelector);
    this.formatMessage = function (data = {}) {
        let rollDice = data.msgType === 'rollDice' ? '<span class="menu-title"><i>Rolling ' + data.rolling + data.dice + '</i></span>' : '';
        let itemsAlign = data.msgType === 'rollDice' ? 'align-items-center' : 'align-items-start px-2 pt-5';
        this.record.innerHTML += '' +
            '<!--begin::Menu Item-->' +
            '<div class="menu-item py-3">' +
            '   <div class="d-flex flex-row justify-content-between align-items-center gap-3">' +
            '       <div class="d-flex flex-row justify-content-start align-items-center gap-3">' +
            '           <!--begin::Symbol-->' +
            '           <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '               <span class="symbol-label circle icon">' +
            '               ' +// style="background: ' + data.src + '; background-size:cover;"
            '               </span>' +
            '           </div>' +
            '           <!--end::Symbol-->' +
            '           <div>' + data.sender + '</div>' +
            '       </div>' +
            '       <i>' + (new Date()).toLocaleDateString() + '</i>' +
            '   </div>' +
            '   <div class="d-flex flex-column justify-content-center gap-3 ' + itemsAlign + '">' + rollDice +
            '       <span class="menu-title">' + data.msg + '</span>' +
            '   </div>' +
            '</div>' +
            '<!--end::Menu Item-->';
    }
}
