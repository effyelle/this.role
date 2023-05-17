class Board {
    /**
     * Board constructor
     * -----------------------------------------------------------------------------------------------------------------
     * @param dicesClass
     * @param options
     */
    constructor(dicesClass, options = {}) {
        this.dicesBtns = document.querySelectorAll(dicesClass);
        this.dices = this.createDices(this.dicesBtns);
        this.dices.isDiceFormat = function (roll) {
            let split = roll.split('d');
            return split.length === 2 && split[0] !== "" && split[1] !== "" && !isNaN(split[0]) && !isNaN(split[1]);
        };
        this.imgFolder = '/assets/media/games/' + dbGame.game_folder + '/gallery/';
        this.mapLayers = [];
        //* begin::Chat *//
        this.chat = new Chat('#chat_messages');
        if (!this.chat.error) this.setChat();
        else this.response("Could not init chat: " + this.chat.error);
        //* end::Chat *//
        //* begin::Map *//
        this.map = new GameMap();
        //* end::Map *//
        //* begin::Journal *//
        this.journal = new Journal('journal');
        //* end::Journal *//
    }

    response(txt, error = true) {
        if (!error) {
            $('.modal_success_response').html(txt);
            $('#modal_success-toggle').click();
            return;
        }
        $('.modal_error_response').html(txt);
        $('#modal_error-toggle').click();
    }

    setChat() {
        this.chat.from = () => {
            let select = q('#charsheet_selected')[0];
            if (select) {
                if (!isNaN(select.value)) {
                    let it = this.journal.searchItem(parseInt(select.value));
                    if (it) {
                        let icon = '/assets/media/games/blank.png';
                        if (urlExists(it.folder + it.info.item_icon)) {
                            icon = it.folder + it.info.item_icon;
                        }
                        return {icon: icon, name: it.info.item_name};
                    }
                }
            }
            return {icon: session.user_avatar, name: session.user_username}
        }
        this.chat.ChatBubble = '#chat';
        //* Save basic rolls *// -> This is the navigation menu on top of the page (all the dices in black & white)
        q('.btn.dice').click(function () {
            this.text = () => {
                let nDices = 1;
                let input = q('#roll-' + this.value)[0];
                if (input && input.value !== "" && !isNaN(input.value)) nDices = input.value;
                return this.chat.formatBasicRoll(this.value, nDices, board.dices[this.value].roll(nDices));
            }
            let thisFrom = this.chat.from();
            this.chat.saveChat({
                icon: thisFrom.icon,
                msg: this.text(),
                sender: thisFrom.name,
                msgType: "nav_dice"
            });
        });
        //* Next rolls to listen are the ones from the journal items *//
        // -> Incomplete
    }

    /**
     * Object Dice
     * -----------------------------------------------------------------------------------------------------------------
     * @param sides
     * @constructor
     */
    Dice = function (sides) {
        this.sides = sides;
        this.roll = function (n) {
            if (!n) n = 1;
            let rolls = [];
            for (let i = 0; i < n; i++) {
                let roll = Math.round(Math.random() * this.sides);
                while (roll <= 0 || roll > this.sides) {
                    roll = Math.round(Math.random() * this.sides);
                }
                rolls[i] = roll;
            }
            return rolls;
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

    setItemsOpening() {
        // Save button items from DOM
        const itemOpenersButtons = q('.' + this.journal.itemClass + ' button.menu-link');
        // Check data and items have the same length -> means they have been created accordingly
        if (itemOpenersButtons.length === Object.keys(this.journal.items).length) {
            // Iterate items
            for (let itemOpenerBtn of itemOpenersButtons) {
                // Add a click listener to each item to create a new modal
                itemOpenerBtn.click(() => {
                    this.journal.setDraggableContainers(itemOpenerBtn);
                });
                itemOpenerBtn.addEventListener('drag', (e) => {
                    this.map.setDraggableTokens(e, itemOpenerBtn);
                });
            }
        }
    }
}