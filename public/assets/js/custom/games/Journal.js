class Journal {
    constructor(id, options = {}) {
        this.container = document.querySelector('#' + id);
        this.listId = id + '_list';
        this.itemClass = id + '_item';
        this.itemModalClass = id + '_item_modal';
        this.imgFolder = '/assets/media/games/' + dbGame.game_folder + '/gallery/';
        this.journal = {
            itemsLength: 0,
            sheetsLength: 0,
            draggablesLength: 0,
            items: {},
            sheets: {},
            draggables: {},
        }
        this.opt = options;
        // Init journal
        this.initJournal();
    }

    initJournal() {
        // Fill journal container
        this.container.innerHTML = this.formatJournalList();
        // If ajax, init journal item creation from url
        if (this.opt.ajax) {
            this.getAjax().done((data) => {
                if (data['data'] && typeof data['data'] === 'object' && data['data'].length > 0) {
                    for (let item of data['data']) {
                        this.journal.items[item.item_id] = item;
                        this.journal.itemsLength++;
                        this.formatJournalItem(item);
                    }
                    this.makeItemsInteractable();
                } else {
                    this.error(this.opt.onError, "No data was received.");
                }
                this.load(this.opt.onLoad, data);
            });
        }
    }

    formatJournalList() {
        return ' <div class="aside-footer d-flex flex-column py-3 px-5" id="' + this.listId + '">' +
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

    formatJournalItem(item = {}) {
        // Check image data, if it does not exist, put a default one
        let iconBg = urlExists(this.imgFolder + item.item_icon)
            ? this.imgFolder + item.item_icon // original icon
            : '/assets/media/avatars/blank.png'; // default icon
        // * HTML format * //
        document.querySelector('#' + this.listId).innerHTML += '' +
            '<!--begin::Menu Item-->' +
            ' <div class="menu-item ' + this.itemClass + '">' +
            // Assign item ID to button for later accessing
            '     <button type="button" class="btn menu-link col-12" value="' + item.item_id + '">' +
            '         <!--begin::Symbol-->' +
            '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '             <span class="symbol-label circle sheet_icon" ' +
            '                  style="background:url(' + iconBg + ');' +
            '                      background-size: cover">' +
            '             </span>' +
            '         </div>' +
            '         <!--end::Symbol-->' +
            '         <span class="menu-title fw-bolder fs-7 text-gray-600 text-hover-dark">' + item.item_title + '</span>' +
            '     </button>' +
            ' </div>' +
            ' <!--end::Menu Item-->';
    }

    openItem(item, containerId) {
        /* Things I still need
         *  - Image holder with hidden input
         *  - Nav tabs (?)
         *    ^ Raw ability scores container with raw 1d20 throws and ability score names
         *    ^ Saving throws container (ability scores with prof and modifications)
         *    ^ Skills container width proficiencies and modificators (form raw ability scores)
         *    ^ Level
         *    ^ Proficiency bonus calculated by level
         *    ^ Armor Class
         *    ^ Initiative (calculated by dex(?) dex?)
         *    ^ Walk speed, swimming/flight speed?
         *    ^ Hit points: maximum and current
         *    ^ Temporary hit points
         *    ^ Hit dice + CONS
         *    ^ Death saves
         *    ^ Exhaustion level
         *    ^ Spells and attacks -> interactable items/abilities
         *    ^ Global modifiers -> dmg, attack&spellcasting, AC
         *    ^ Bag -> non interactable items
         *    ^ Character traits? (Characteristics-> personality, ideals, bonds, flaws)
         *    ^ Other resources
         *    ^ Other abilities descriptions -> not spells and not castable or interactable just description
         *    ^ Character description -> appearance, backstory, allies&organizations, treasure
         *    ^ Spells
         *  - Make all editable/non_editable
         *  - Add public/to GM option?
         *  -
         */
        $('#journal-modal_container')[0].innerHTML += '' +
            '<div id="' + containerId + '" class="' + this.itemModalClass + ' show ' + item.item_type + ' draggable">' +
            '       <div class="modal-content bg-white">' +
            '           <div class="modal-header border-0 flex-row-wrap justify-content-between align-items-center cursor-move">' +
            '               <label for="item_title" class="ff-poiret fs-4 fw-boldest">' + item.item_title + '</label>' +
            '               <div class="flex-row-wrap gap-5 align-items-center justify-content-end align-self-start">' +
            '                   <button type="button" class="btn p-0 edit-btn text-hover-dark">' +
            '                       <i class="fa-solid fa-edit fs-3"></i>' +
            '                   </button>' +
            '                   <button type="button" class="btn p-0 close_item-btn text-hover-dark">' +
            '                       <i class="fa-solid fa-close fs-1"></i>' +
            '                   </button>' +
            '               </div>' +
            '           </div>' +
            '           <div class="modal-body">' +
            '               <div class="flex-column align-content-center align-items-center justify-content-center">' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '</div>';
    }

    makeItemsInteractable() {
        let items = aqws('.' + this.itemClass + ' .menu-link');
        // Check data and items have the same length -> means they have been created accordingly
        if (items.length === this.journal.itemsLength) {
            for (let item of items) {
                item.click(() => {
                    let itemInfo = this.journal.items[item.value];
                    let id = 'draggable_' + itemInfo.item_id;
                    if (aqws('#' + id).length === 0) {
                        this.openItem(itemInfo, id);
                        // * Add destroy option for this very same item * //
                        let modals = aqws('.' + this.itemModalClass);
                        let closeBtns = aqws('.' + this.itemModalClass + ' .close_item-btn');
                        // Check there are the same amount of close buttons as there are of opened modals
                        if (closeBtns.length === modals.length) {
                            // Add a close event
                            for (let i = 0; i < closeBtns.length; i++) {
                                closeBtns[i].click(() => {
                                    modals[i].remove();
                                });
                            }
                        }
                        let cursorMove = aqws('.cursor-move');
                        // Check there are the same amount of cursor-move as tehere are of opened modals
                        if (cursorMove.length === modals.length) {
                            // Add draggable
                            for (let i = 0; i < cursorMove.length; i++) {
                                new Draggable('.draggable', '.cursor-move');
                            }
                        }
                        // Add drag on cursor move when clicking header
                        // Create new character sheet
                        this.journal.sheets[itemInfo.item_id] = new Sheet('#' + id + ' .modal-body');
                        this.journal.sheetsLength++;
                    }
                });
            }
        }
    }

    getAjax() {
        if (!this.opt.ajax.url) this.error(this.opt.onError);
        if (!this.opt.ajax.method) this.opt.ajax.method = "get";
        return $.ajax({
            type: this.opt.ajax.method,
            url: this.opt.ajax.url,
            dataType: "json", // Comment this line for debugging,
            async: true,
            success: (data) => {
                return data;
            },
            error: (e) => {
                return this.error(opt.onError, e);
            }
        });
    }

    error(callback, e) {
        if (callback) {
            if (e) return callback(e);
            return callback("You need to set an URL to do any AJAX call");
        }
        return false;
    }

    load(callback, data) {
        if (callback && data) {
            callback(data);
        }
        return false;
    }
}

const Sheet = function (q) {
    console.log(aqws(q));
}