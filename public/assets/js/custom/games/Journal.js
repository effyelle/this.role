class Journal {
    constructor(id, options = {}) {
        this.opt = options;
        this.container = id;
        this.itemClass = id + '_item';
        this.sheetsContainer = options.sheetsContainer;
        // Folder to draw the images from
        this.folder = this.opt.folder;
        this.items = {
            list: {},
            length: 0,
        }
        // Init journal
        this.init();
    }

    init() {
        // If ajax, init journal item creation from url
        if (!this.opt.ajax.method) this.opt.ajax.method = "get";
        if (!this.opt.ajax.url) this.error(this.opt.onError);
        // Get data through ajax
        this.getJournalAjax().done((data) => {
            // Checck data is not null
            if (data.results && typeof data.results === 'object' && data.results.length > 0) {
                console.log(data.results);
                // Iterate results
                for (let item of data.results) {
                    // Save id to for modal container
                    // Save a DND sheet for each item
                    this.items.list[this.items.length] = new this.SheetDnD(this.sheetsContainer, {
                        itemInfo: item
                    });
                    this.items.length++;
                }
                // Show list
                this.formatJournalItems(this.items.list);
                this.load(this.opt.onLoad, data);

            } else {
                this.error(this.opt.onError, "No data was received.");
            }
        });
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

    formatJournalItems(items) {
        for (let i in items) {
            let item = items[i].info;
            // Check image data, if it does not exist, put a default one
            let icon = urlExists(this.folder + item.item_icon)
                ? this.folder + item.item_icon // original icon
                : '/assets/media/avatars/blank.png'; // default icon
            // * HTML format * //
            q('#' + this.container)[0].innerHTML += '' +
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
    }


    reload() {
        $('.' + this.itemClass).remove();
        q('#' + this.container)[0].innerHTML = '';
        this.items = {
            list: {},
            length: 0,
        }
        // Begin again
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

    SheetDnD = function (id, params = {}) {
        this.info = params.itemInfo;
        // Add container for saving future modals
        this.modalsContainer = id;
        this.draggableContainerId = 'draggable_' + this.info.item_id;
        this.draggableContainerClass = 'journal_item_modal';
        this.icon = this.info.item_icon ? this.info.item_icon : '';
        this.type = this.info.item_type;
        this.openItem = async (htmlText) => {
            q('#' + this.modalsContainer)[0].innerHTML += '' +
                '<div id="' + this.draggableContainerId + '" class="' + this.draggableContainerClass + ' show">' +
                '    <div class="modal-content bg-white">' +
                '       ' + htmlText +
                '    </div>' +
                '</div>';
        }
        this.getLevel = (xp) => {
            // This is like super dirty code
            // but bro I didn't find any formulas
            if (xp >= 0 && xp < 300) return 1;
            if (xp >= 300 && xp < 900) return 2;
            if (xp >= 900 && xp < 2700) return 3;
            if (xp >= 2700 && xp < 6500) return 4;
            if (xp >= 6500 && xp < 14000) return 5;
            if (xp >= 14000 && xp < 23000) return 6;
            if (xp >= 23000 && xp < 34000) return 7;
            if (xp >= 34000 && xp < 48000) return 8;
            if (xp >= 48000 && xp < 64000) return 9;
            if (xp >= 64000 && xp < 85000) return 10;
            if (xp >= 85000 && xp < 100000) return 11;
            if (xp >= 10000 && xp < 120000) return 12;
            if (xp >= 120000 && xp < 140000) return 13;
            if (xp >= 140000 && xp < 165000) return 14;
            if (xp >= 165000 && xp < 195000) return 15;
            if (xp >= 195000 && xp < 225000) return 16;
            if (xp >= 225000 && xp < 265000) return 17;
            if (xp >= 265000 && xp < 305000) return 18;
            if (xp >= 305000 && xp < 355000) return 19;
            if (xp >= 355000) return 20;
        }
        this.getClassArmor = () => {
            // Base armor starts in 10
            let this_ac = 10;
            // Check character sheet is correctly filled
            if (this.info.ability_scores && typeof this.info.ability_scores === 'object' &&
                this.info.class && this.info.bag && this.info.bag === 'object') {
                let dex = this.info.ability_scores.dex;
                let cons = this.info.ability_scores.cons;
                let armor = this.info.bag.armor && this.info.bag.armor.on ? this.info.bag.armor.val : 0;
                let shield = this.info.bag.shield && this.info.bag.shield.on ? this.info.bag.shield.val : 0;
                let custom_mods = this.info.global_modifiers && this.info.global.modifiers.ca ? this.info.global.modifiers.ca : 0;
                // Then you add: DEX modifier, armor modifier, shield
                // Always add DEX and custom modifiers
                this_ac += dex + custom_mods;
                switch (this.info.class) {
                    case 'barbarian':
                    case 'monk':
                        // Ultimately add CONS if barbarian or monk
                        // while wearing no armor or shield
                        if (!armor && !shield) {
                            this_ac += cons;
                            break;
                        }
                        this_ac += armor + shield;
                        break;
                    default:
                        this_ac += armor + shield;
                }

            }
            return this_ac;
        }
        this.getInitTierBreaker = () => {
            // Add init modifiers (?)
            const tb = 1.045;
            let dex = 4;
            if (this.info.ability_scores && typeof this.info.ability_scores === 'object' && this.info.ability_scores.dex) {
                dex = this.info.ability_scores.dex;
            }
            return dex * tb;
        }
        this.getProficiency = (xp) => {
            // Starts in +2 and adds +1 for every 4 levels until level 20
            let level = this.getLevel(xp);
            //if (level !== 1) level--;
            return Math.ceil(this.getLevel(xp) / 4) + 1;
        }
    }
}
