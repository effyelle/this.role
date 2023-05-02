class Journal {
    constructor(id, options = {}) {
        this.container = q('#' + id)[0];
        this.listId = id + '_list';
        this.itemClass = id + '_item';
        this.imgFolder = '/assets/media/games/' + dbGame.game_folder + '/gallery/';
        this.journal = {
            itemsLength: 0,
            sheetsLength: 0,
            draggablesLength: 0,
            iconsLength: 0,
            items: {},
            sheets: {},
            draggables: {},
            icons: {},
        }
        this.opt = options;
        // Init journal
        this.init();
    }

    init() {
        // Fill journal container
        this.container.innerHTML = this.formatJournalList();
        // If ajax, init journal item creation from url
        if (this.opt.ajax) {
            if (!this.opt.ajax.method) this.opt.ajax.method = "get";
            $.ajax({
                type: this.opt.ajax.method,
                url: this.opt.ajax.url,
                dataType: 'json', // Comment this line for debugging,
                async: true,
                success: (data) => {
                    if (data['data'] && typeof data['data'] === 'object' && data['data'].length > 0) {
                        for (let item of data['data']) {
                            this.journal.items[item.item_id] = item;
                            this.journal.itemsLength++;
                            this.formatJournalItem(item);
                        }
                    } else {
                        this.error(this.opt.onError, "No data was received.");
                    }
                    this.load(this.opt.onLoad, data);
                },
                error: (e) => {
                    return this.error(this.opt.onError, e);
                }
            });
        }
    }

    formatJournalList() {
        return ' <div class="aside-footer d-flex flex-column py-3 px-5" id="' + this.listId + '">' +
            '     <div class="menu menu-column menu-rounded fw-bold fs-7 gap-2 mt-3" data-kt-menu="true">' +
            '         <div class="menu-item">' +
            '             <span class="fs-5 text-dark">Welcome to your journal!</span>' +
            '         </div>' +
            '         <!--begin:Menu item-->' +
            '         <div class="menu-item">' +
            '             <!--begin:Menu link-->' +
            '             <a class="menu-link gap-3" id="modal_journal-toggle" data-bs-toggle="modal" data-bs-target="#modal_journal">' +
            '                 <i class="fa fa-solid fa-journal-whills fa-xl"></i>' +
            '                 <span class="menu-title">Add journal item</span>' +
            '             </a>' +
            '             <!--end:Menu link-->' +
            '         </div>' +
            '         <!--end:Menu item-->' +
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
        console.log(item)
        // Check image data, if it does not exist, put a default one
        let icon = urlExists(this.imgFolder + item.item_icon)
            ? this.imgFolder + item.item_icon // original icon
            : '/assets/media/avatars/blank.png'; // default icon
        // * HTML format * //
        q('#' + this.listId)[0].innerHTML += '' +
            '<!--begin::Menu Item-->' +
            ' <div class="menu-item ' + this.itemClass + '">' +
            // Assign item ID to button for later accessing
            '     <button type="button" class="btn menu-link col-12" value="' + item.item_id + '">' +
            '         <!--begin::Symbol-->' +
            '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '             <span class="symbol-label circle sheet_icon" ' +
            '                  style="background:url(' + icon + ');' +
            '                      background-size: cover">' +
            '             </span>' +
            '         </div>' +
            '         <!--end::Symbol-->' +
            '         <span class="menu-title fw-bolder fs-7 text-gray-600 text-hover-dark">' + item.item_title + '</span>' +
            '     </button>' +
            ' </div>' +
            ' <!--end::Menu Item-->';
    }


    reload() {
        this.journal = {
            itemsLength: 0,
            sheetsLength: 0,
            draggablesLength: 0,
            items: {},
            sheets: {},
            draggables: {},
        }
        // Fill journal container
        this.init();
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

    Sheet = function (params = {}) {
        this.modalContainer = q(params.modalContainer)[0];
        this.modalBody = q(params.modalBody)[0];
        this.tabs = {
            char: {
                containerId: this.modalContainer.id + '-character',
                titleInputId: this.modalContainer.id + '-character-title_input',
                classInputId: this.modalContainer.id + '-character-class_input',
                levelInputId: this.modalContainer.id + '-character-level_input',
            },
            spells: {
                containerId: this.modalContainer.id + '-spells',
            },
        };
        this.icon = params.icon ? params.icon : '';
        this.char = params.item;
        const tabs = () => {
            return '<!--begin::Tabs-->' +
                '<ul class="nav nav-tabs pt-2 justify-content-start fs-7">' +
                '    <li class="nav-item">' +
                '        <a class="nav-link py-2 px-3 active" data-bs-toggle="tab" href="#' + this.tabs.char.containerId + '">' +
                '            <i class="fa fa-dragon f-lg text-this-role-light"></i>' +
                '            <span>Character</span>' +
                '        </a>' +
                '    </li>' +
                '    <li class="nav-item">' +
                '        <a class="nav-link py-2 px-3" data-bs-toggle="tab" href="#' + this.tabs.spells.containerId + '">' +
                '            <i class="fa fa-book f-lg text-this-role-light"></i>' +
                '            <span>Spells</span>' +
                '        </a>' +
                '    </li>' +
                '</ul>' +
                '<!--end::Tabs-->';
        }
        const character = () => {
            charDetails().done((data) => {

            });
        };
        const charDetails = () => {
            return $.ajax({
                type: "get",
                url: "/app/games_ajax/sheet/",
                success: (data) => {
                    return data;
                }
            });
        }

        const spells = () => {
            return '<!--begin::Character content-->' +
                '<div id="' + this.tabs.spells.containerId + '" class="py-8 px-2 tab-pane fade">' +
                '' +
                '</div>' +
                '<!--end::Character content-->';
        }
        // Fill data from
        q('div[data-from=' + this.tabs.char.titleInputId + ']')[0].innerHTML = this.char.item_title;
        this.modalBody.innerHTML = '<!--begin::Tabs Container-->' +
            '<div class="aside-menu flex-column-fluid tab-content">' +
            '   ' + tabs() + character() + spells() +
            '</div>' +
            '<!--end::Tabs Container-->';
        this.loadInfo = (elem) => {
            //  console.log(info)
            /*
            for (let i of info) {
                i.innerHTML = elem.value;
            }*/
        }
        this.inputs = q('.journal_item_modal .this-role-form-field');

        let info = q('div[data-from=' + elem.id + ']');

        for (let elem of this.inputs) {
            if (elem.id) console.log(elem.id)
            this.loadInfo(elem);
            elem.onblur = () => {
                this.loadInfo(elem);
            }
        }
    }
}
