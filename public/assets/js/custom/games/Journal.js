class Journal {
    constructor(id, options = {}) {
        this.container = q('#' + id)[0];
        this.listId = id + '_list';
        this.itemClass = id + '_item';
        this.folder = options.folder;
        this.items = {
            list: {},
            length: 0,
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
            this.getJournalAjax().done((data) => {
                if (data['data'] && typeof data['data'] === 'object' && data['data'].length > 0) {
                    for (let item of data['data']) {
                        this.items.list[item.item_id] = new this.Sheet({
                            modalContainer: '#' + this.draggableContainerId,
                            modalBody: '#' + this.draggableContainerId + ' .modal-body',
                            itemInfo: item
                        });
                        this.items.length++;
                        this.formatJournalItem(item);
                    }
                } else {
                    this.error(this.opt.onError, "No data was received.");
                }
                this.load(this.opt.onLoad, data);
            });
        }
    }

    getJournalAjax() {
        return $.ajax({
            type: this.opt.ajax.method,
            url: this.opt.ajax.url,
            dataType: 'json', // Comment this line for debugging,
            async: true,
            success: (data) => {
                return data;
            },
            error: (e) => {
                return this.error(this.opt.onError, e);
            }
        });
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
        // Check image data, if it does not exist, put a default one
        let icon = urlExists(this.folder + item.item_icon)
            ? this.folder + item.item_icon // original icon
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
        this.items = {
            itemsLength: 0,
            sheetsLength: 0,
            items: {},
            sheets: {},
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
        this.info = params.itemInfo;
        this.modalContainer = q(params.modalContainer)[0];
        this.modalBody = q(params.modalBody)[0];
        this.icon = this.info.item_icon ? this.info.item_icon : '';
        this.type = this.info.item_type;
        // Fill data from
        /*console.log(q('div[data-from]'));
        this.loadInfo = (elem) => {
        }
        this.inputs = q('.journal_item_modal .this-role-form-field');

        for (let elem of this.inputs) {
            if (elem.id) console.log(elem.id)
            this.loadInfo(elem);
            elem.onblur = () => {
                this.loadInfo(elem);
            }
        }*/
    }
}
