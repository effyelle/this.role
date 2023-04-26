class Board {
    /**
     * Board constructor
     * -----------------------------------------------------------------------------------------------------------------
     * @param dicesClass
     */
    constructor(dicesClass = '') {
        this.dicesBtns = document.querySelectorAll(dicesClass);
        this.dices = this.createDices(this.dicesBtns);
    }

    /**
     * Object Dice
     * -----------------------------------------------------------------------------------------------------------------
     * @param sides
     * @constructor
     */
    Dice = function (sides) {
        this.sides = sides;
        this.roll = function () {
            let roll = Math.ceil(Math.random() * this.sides);
            while (roll < 0 || roll > this.sides) {
                roll = Math.ceil(Math.random() * this.sides);
            }
            return roll;
        }
    }

    /**
     *
     * @param id
     * @constructor
     */
    Journal = function (id) {
        this.container = document.querySelector('#' + id);
        this.listId = id + '_list';
        this.itemClass = id + '_item';
        this.itemModalClass = id + '_item_modal';
        this.openJournalItem = function () {
            console.log(this.value);
            /*
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
             */
        }
        this.formatJournalItem = function (data = {}) {
            document.querySelector('#' + this.listId).innerHTML += '' +
                '<!--begin::Menu Item-->' +
                ' <div class="menu-item ' + this.itemClass + '">' +
                '     <button class="btn menu-link" value="' + data.type + '">' +
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
            items[items.length - 1].addEventListener('click', () => {
                this.openJournalItem();
            });
        }
        this.loadItems = function () {
            this.initJournal();
            $.ajax({
                type: 'get',
                url: '/app/games_ajax/get_journal_items/' + dbGame.game_id,
                dataType: 'json',
                success: (data) => {
                    console.log(data);
                    if (data['response'] && data['items']) {
                        for (let i in data['items']) {
                            let item = data.items[i];
                            console.log(item);
                            this.formatJournalItem({
                                type: item.item_type,
                                src: item.item_icon,
                                title: item.item_title
                            });
                        }
                        return;
                    }
                    $('.modal_error_response').html(data['msg']);
                    $('#modal_error-toggle').click();
                },
                error: function (e) {
                    console.log("Error: ", e);
                }
            });
        }
        this.initJournal = function () {
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
        this.loadItems();
    }

    /**
     *
     * @param querySelector
     * @constructor
     */
    Chat = function (querySelector) {
        this.record = document.querySelector(querySelector);
        let now = new Date();
        this.formatMessage = function (data = {}) {
            let rollDice = data.msgType === 'rollDice'
                ? '<span class="menu-title"><i>Rolling ' + data.rolling + data.dice + '</i></span>'
                : '';
            let itemsAlign = data.msgType === 'rollDice'
                ? 'align-items-center'
                : 'align-items-start px-2 pt-5';
            let msgColor = data.msgType === 'error' ? 'text-danger' : '';
            let avatar = data.src
                ? '<!--begin::Symbol-->' +
                '<div class="me-2 symbol symbol-20px symbol-md-30px">' +
                '    <span class="symbol-label circle icon">' +
                '    ' +// style="background: ' + data.src + '; background-size:cover;"
                '    </span>' +
                '</div>' +
                '<!--end::Symbol-->'
                : '';
            this.record.innerHTML += '' +
                '<!--begin::Menu Item-->' +
                '<div class="menu-item py-3">' +
                '   <div class="d-flex flex-row justify-content-between align-items-center gap-3">' +
                '       <div class="d-flex flex-row justify-content-start align-items-center gap-3">' + avatar +
                '           <div>' + data.sender + '</div>' +
                '       </div>' +
                '       <i>' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + '</i>' +
                '   </div>' +
                '   <div class="d-flex flex-column justify-content-center gap-3 ' + itemsAlign + ' ' + msgColor + '">' + rollDice +
                '       <span class="menu-title">' + data.msg + '</span>' +
                '   </div>' +
                '</div>' +
                '<!--end::Menu Item-->';
        }
    }

    /**
     * Create dices objects
     * -----------------------------------------------------------------------------------------------------------------
     * @param buttons
     * @returns {{}}
     */
    createDices(buttons) {
        let dicesSides = {};
        for (let i = 0; i < buttons.length; i++) {
            let btn = buttons[i];
            let diceTotalSides = btn.value.substring(btn.value.indexOf('d') + 1);
            if (diceTotalSides.match(/^[0-9]+$/)) {
                dicesSides[btn.value] = parseInt(diceTotalSides);
            }
        }
        let dicesObjects = {};
        for (let i in dicesSides) {
            dicesObjects[i] = new this.Dice(dicesSides[i]);
        }
        return dicesObjects;
    }
}