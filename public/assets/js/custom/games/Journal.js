class Journal {

    constructor(id) {
        this.container = document.querySelector('#' + id);
        this.listId = id + '_list';
        this.itemClass = id + '_item';
        this.itemModalClass = id + '_item_modal';
        this.imgFolder = '/assets/media/games/' + dbGame.game_folder + '/gallery/';
        this.items = {};
    }

    openItem(item) {
        $('#journal-modal_container')[0].innerHTML += '' +
            '<div id="draggable_' + item.item_id + '" class="' + this.itemModalClass + ' show">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header flex-row-wrap">' +
            '               <div class="flex-row-wrap justify-content-between align-items-stretch col-10 cursor-move">' +
            '                   <p>' + item.item_title + '</p>' +
            '               </div>' +
            '               <div class="flex-row-wrap gap-5 align-items-center justify-content-end">' +
            '                   <button type="button" class="btn p-0 edit-btn">' +
            '                       <i class="fa-solid fa-edit fs-3 text-hover-dark"></i>' +
            '                   </button>' +
            '                   <button type="button" class="btn p-0 close_item-btn">' +
            '                       <i class="fa-solid fa-close fs-1 text-hover-dark"></i>' +
            '                   </button>' +
            '               </div>' +
            '           </div>' +
            '           <div class="modal-body">' +
            '           </div>' +
            '       </div>' +
            '</div>';
    }

    formatJournalItem(item = {}) {
        // Check image data
        let iconBg = this.imgFolder + item.item_icon;
        // Fill list
        document.querySelector('#' + this.listId).innerHTML += '' +
            '<!--begin::Menu Item-->' +
            ' <div class="menu-item ' + this.itemClass + '">' +
            // Assign item ID to button for later accessing
            '     <button type="button" class="btn menu-link" value="' + item.item_id + '">' +
            '         <!--begin::Symbol-->' +
            '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '             <span class="symbol-label circle sheet_icon" ' +
            '                  style="background:url(' + (urlExists(iconBg) ? iconBg : '/assets/media/avatars/blank.png') + ');' +
            '                      background-size: cover">' +
            '             </span>' +
            '         </div>' +
            '         <!--end::Symbol-->' +
            '         <span class="menu-title">' + item.item_title + '</span>' +
            '     </button>' +
            ' </div>' +
            ' <!--end::Menu Item-->';
        let items = $('.' + this.itemClass + ' .menu-link');
        items.unbind('click');
        items.click(() => {
            let id = 'draggable_' + item.item_id;
            //this.makeDraggable($('#' + item.item_id));
            console.log(document.querySelectorAll('#' + id).length)
            if (document.querySelectorAll('#' + id).length === 0) {
                this.openItem(item);
                // Add drag on cursor move when clicking header
                new Draggable({
                    container: '#' + id,
                    pointer: '#' + id + ' .cursor-move'
                });
                for (let i = 0; i < document.querySelectorAll('.' + this.itemModalClass).length; i++) {
                    console.log('here')
                    document.querySelectorAll('.' + this.itemModalClass + ' .close_item-btn')[i]
                        .addEventListener('click', () => {
                            $('.' + this.itemModalClass)[i].remove();
                        });
                }
            }
        });
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
}