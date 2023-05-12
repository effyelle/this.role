class Journal {
    constructor(id, options = {}) {
        this.opt = options;
        this.container = id;
        this.itemClass = id + '_item';
        this.sheetsContainer = options.sheetsContainer;
        this.defaultIcon = '/assets/media/games/blank.png';
        this.items = {
            list: {},
            length: 0
        }
        // Init journal
        this.init();
    }

    init() {
        // If ajax, init journal item creation from url
        if (!(this.opt.ajax && this.opt.ajax.url)) {
            this.error(this.opt.onError);
            return;
        }
        if (!this.opt.ajax.method) this.opt.ajax.method = "get";
        // Get data through ajax
        this.getJournalAjax().done((data) => {
            // Checck data is not null
            if (data.results && typeof data.results === 'object' && data.results.length > 0) {
                // Iterate results
                for (let item of data.results) {
                    // Save id to for modal container
                    let viewer = false;
                    let editor = false;
                    if (item.item_viewers) {
                        item.item_viewers = JSON.parse(item.item_viewers);
                        for (let i of item.item_viewers) {
                            if (i == session.user_id) viewer = true;
                        }
                    }
                    if (item.item_editors) {
                        item.item_editors = JSON.parse(item.item_editors);
                        for (let i of item.item_editors) {
                            if (i == session.user_id) editor = true;
                        }
                    }

                    if (session.user_id === dbGame.game_creator || viewer || editor) {
                        // Save a DND sheet for each item
                        this.items.list[this.items.length] = new this.SheetDnD(this.sheetsContainer, {
                            itemInfo: item,
                            folder: this.opt.folder,
                        });
                        this.items.length++;
                    }
                }
                // Show list
                this.formatJournalItems(this.items.list);
            } else {
                console.log("No journal items in this game yet");
            }
            this.load(this.opt.onLoad, data);
        }).fail((e) => {
            console.log("Error: ", e);
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
                return e;
            }
        });
    }

    formatJournalItems(items) {
        for (let i in items) {
            let item = items[i].info;
            // Check image data, if it does not exist, put a default one
            let icon = !urlExists(this.opt.folder + item.item_icon)
                ? this.defaultIcon
                : this.opt.folder + item.item_icon;

            // * HTML format * //
            q('#' + this.container)[0].innerHTML += '' +
                '<!--begin::Menu Item-->' +
                ' <div class="menu-item ' + this.itemClass + '">' +
                // Assign item ID to button for later accessing
                '     <button type="button" class="btn menu-link col-12" value="' + item.item_id + '">' +
                '         <!--begin::Symbol-->' +
                '         <div class="me-2 symbol symbol-20px symbol-md-30px">' +
                '             <span class="symbol-label circle item_icon-holder"' +
                '                  style="background-image: url(' + icon + ');' +
                '                      background-size: cover; background-position: center center;">' +
                '             </span>' +
                '         </div>' +
                '         <!--end::Symbol-->' +
                '         <span class="menu-title fw-bolder fs-7 text-gray-600 text-hover-dark">' + item.item_name + '</span>' +
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
        this.folder = params.folder;
        this.openItem = async (htmlText) => {
            q('#' + this.modalsContainer)[0].innerHTML += htmlText;
            let icon = '/assets/media/games/blank.png';
            if (urlExists(this.folder + this.info.item_icon)) {
                icon = this.folder + this.info.item_icon;
            }
            const iconHolder = q('#' + this.draggableContainerId + ' .item_icon-holder');
            if (iconHolder.length > 0) {
                iconHolder[0].style.backgroundImage = 'url("' + icon + '")';
            }
        }
        this.getLevel = () => {
            let lvl = 0;
            if (this.info.classes) {
                const classes = JSON.parse(this.info.classes);
                for (let i in classes) {
                    let c = classes[i];
                    if (c.lvl && c.lvl !== "" && c.lvl !== "0" && !isNaN(c.lvl)) {
                        lvl += parseInt(c.lvl);
                    }
                }
            }
            return lvl !== 0 ? lvl : 1;
        }
        this.getClassArmor = () => {
            // Base armor starts in 10
            let this_ac = 10;
            // Check character sheet is correctly filled
            let dex = this.getRawScoreModifier('dex');
            let con = this.getRawScoreModifier('con');
            let main_class = this.getMainClass();
            if (dex && main_class) {
                let armor = this.info.bag.armor && this.info.bag.armor.equiped ? this.info.bag.armor.val : 0;
                // This is yet to write
                let heavyArmor = false;
                let shield = 0;
                let custom_mods = 0;
                // Then you add: DEX modifier, armor modifier, shield
                // Always add custom modifiers
                this_ac += parseInt(custom_mods);
                // Add constitution modifier if it is a barbarian or a monk while not wearing any armor
                if (con && main_class.class.match(/barbarian|monk/) && !armor && !shield) {
                    this_ac += con;
                }
                // Add dexterity modifier if not wearing heavy armor
                if (!armor && !heavyArmor) {
                    this_ac += dex;
                }
                // Otherwise add armor and shield
                this_ac += parseInt(armor) + parseInt(shield);
            }
            return this_ac;
        }
        this.getProficiency = () => {
            // Starts in +2 and adds +1 for every 4 levels until level 20
            return Math.ceil(this.getLevel() / 4) + 1;
        }
        this.getMainClass = () => {
            if (this.info.classes) {
                let classes = JSON.parse(this.info.classes)
                if (classes) {
                    for (let c of classes) {
                        if (c.is_main) return c;
                    }
                }
            }
            return false;
        }
        this.getScore = (score) => {
            if (this.info.ability_scores) {
                const scores = JSON.parse(this.info.ability_scores);
                for (let i in scores) {
                    if (i.match(score)) {
                        return scores[i];
                    }
                }
            }
            return false;
        }
        this.getRawScoreModifier = (score) => {
            if (this.info.ability_scores) {
                const scores = JSON.parse(this.info.ability_scores);
                let modifier = 0;
                for (let i in scores) {
                    if (i.match(score)) {
                        return Math.floor((parseInt(scores[i].score) - 10) / 2);
                    }
                }
                return modifier;
            }
            return false;
        }
        this.getProfScoreModifier = (score) => {
            if (this.info.ability_scores) {
                const scores = JSON.parse(this.info.ability_scores);
                let modifier = 0;
                for (let i in scores) {
                    if (i.match(score)) {
                        return Math.floor((parseInt(scores[i].score) - 10) / 2) +
                            (scores[i].is_prof === "1" ? this.getProficiency() : 0) + '';
                    }
                }
                return modifier;
            }
            return false;
        }
        this.getInitTierBreaker = () => {
            // Add init modifiers (?)
            const tierBreaker = 1.045;
            let dex = this.getRawScoreModifier('dex');
            if (!dex) dex = 0;
            return dex * tierBreaker;
        }
    }
}