class Journal {
    constructor(id) {
        this.container = document.querySelector('#' + id);
        this.listId = id + '_list';
        this.itemClass = id + '_item';
        this.itemModalClass = id + '_item_modal';
        this.initJournal();
    }

    initJournal() {
        this.container.innerHTML = '' +
            ' <div class="aside-footer d-flex flex-column py-3 px-5" id="' + this.listId + '">' +
            '     <div class="menu menu-column menu-rounded fw-bold fs-7 gap-2 mt-3" data-kt-menu="true">' +
            '         <div class="menu-item">' +
            '             <span class="fs-5 text-dark">Welcome to your journal!</span>' +
            '         </div>' +
            '         <!--begin::Menu Item-->' +
            '         <div class="menu-item">' +
            '             <a class="menu-link" id="modal_journal-toggle" data-bs-toggle="modal" data-bs-target="#modal_journal">' +
            '                 <span class="menu-title">Add journal item</span>' +
            '                 <i class="fa-solid fa-plus text-white fs-5 d-block bg-garnet circle p-1"></i>' +
            '             </a>' +
            '         </div>' +
            '         <!--end::Menu Item-->' +
            '         <!--begin::Separator-->' +
            '         <div class="menu-item">' +
            '             <div class="menu-content p-0">' +
            '                 <div class="separator mx-1"></div>' +
            '             </div>' +
            '         </div>' +
            '         <!--end::Separator-->' +
            '     </div>' +
            ' </div>';
    }

    formatJournalItem(itemType, data = {}) {
        document.querySelector('#' + this.listId).innerHTML += '' +
            '<!--begin::Menu Item-->' +
            ' <div class="menu-item ' + this.itemClass + '">' +
            '     <button class="btn menu-link" value="' + itemType + '">' +
            '         <!--begin::Symbol-->' +
            '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '             <span class="symbol-label circle sheet_icon"' +
            '                 style="background:url(' + data.src + ')">' +
            '             </span>' +
            '         </div>' +
            '         <!--end::Symbol-->' +
            '         <span class="menu-title">' + data.title + '</span>' +
            '     </button>' +
            ' </div>' +
            ' <!--end::Menu Item-->';
        let items = document.querySelectorAll('.' + this.itemClass + ' .menu-link');
        //items[items.length - 1].addEventListener('click', this.openJournalItem);
        items[items.length - 1].addEventListener('click', function(){
            console.log('Here')
        })
    }

    openJournalItem() {
        console.log(this.value);
        document.body.innerHTML += '' +
            '<div class="modal fade show d-block ' + this.itemModalClass + '">' +
            '   <div class="modal-dialog">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '           </div>' +
            '           <div class="modal-body">' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';
    }
}