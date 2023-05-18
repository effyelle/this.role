class Board {
    /**
     * Board constructor
     * -----------------------------------------------------------------------------------------------------------------
     * @param dicesClass
     * @param options
     */
    constructor(dicesClass, options = {}) {
        this.diceButtons = q(dicesClass);
        this.CreateDices = this.diceButtons;
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
        this.chat.From = () => {
            if (this.chat.select) {
                if (!isNaN(this.chat.select.value)) {
                    let it = this.journal.searchItem(parseInt(this.chat.select.value));
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
        this.chat.Select = '#charsheet_selected';
        this.chat.ChatBubble = '#chat';
        //* Save basic rolls *// -> This is the navigation menu on top of the page (all the dices in black & white)
        for (let btn of this.diceButtons) {
            btn.click(() => {
                this.text = () => {
                    let nDices = 1;
                    let input = q('#roll-' + btn.value)[0];
                    if (input && input.value !== "" && !isNaN(input.value)) nDices = input.value;
                    return this.chat.formatBasicRoll(btn.value, nDices, this.dices[btn.value].roll(nDices));
                }
                console.log(this.dices)
                let thisFrom = this.chat.from();
                this.chat.saveChat({
                    icon: thisFrom.icon,
                    msg: this.text(),
                    sender: thisFrom.name,
                    msgType: "nav_dice"
                });
            });
        }
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
     */
    set CreateDices(buttons) {
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
        this.dices = dicesObjects;
    }

    setItemsOpening() {
        // Save button items from DOM
        const itemOpenersButtons = q('.' + this.journal.itemClass + ' button.menu-link');
        // Check data and items have the same length -> means they have been created accordingly
        if (itemOpenersButtons.length === Object.keys(this.journal.items).length) {
            // Iterate items
            for (let itemOpenerBtn of itemOpenersButtons) {
                // Add a click listener to each item to create a new modal
                if (this.journal.changed) {
                    itemOpenerBtn.addEventListener('click', () => {
                        this.setDraggableItemSheets(itemOpenerBtn);
                    });
                }
                if (this.map.changed) {
                    itemOpenerBtn.addEventListener('drag', (e) => {
                        this.setDraggableTokens(e);
                    });
                }
            }
        }
    }

    loadItemsFields() {
        // Load what
        if (this.journal.journalDraggable) console.log(this.journal.journalDraggable);
        this.journal.getFieldsData();
    }

    setDraggableItemSheets(btn) {
        // Get item info from Journal
        let item = this.journal.searchItem(btn.value);
        if (!item || item === {}) return;
        // Return if item has already been opened
        console.log(q('#' + item.draggableContainerId))
        if (q('#' + item.draggableContainerId).length !== 0) return;
        console.log(q('#' + item.draggableContainerId))
        return ajax('/app/games_ajax/sheet/' + item.info.item_id, {item_type: item.info.item_type}, 'post', 'text').done((txt) => {
            item.openItem(txt);
            // Check it was created correctly
            if (q('#' + item.draggableContainerId).length !== 1) {
                // Return message error if length is not 1
                $('.modal_error_response').html('Item could not be opened');
                $('#modal_error-toggle').click();
                return;
            }
            this.journal.JournalDraggable = new Draggable('.' + item.draggableContainerClass, '.' + item.draggableContainerClass + ' .cursor-move', {
                max: '.max-btn',
                min: '.min-btn',
                close: '.close_item-btn',
                closeTargets: ['.draggable_close']
            });
            this.journal.listenToOpenedItems(item);
        }).fail((e) => {
            console.log(e.responseText);
        });
    }

    loadTokens() {
        if (!(this.map.gameBoard)) return;
        // Erase all
        for (let child of this.map.gameBoard.children) {
            if (child.classList.contains('symbol')) child.remove();
        }
        if (!(this.map.selectedLayer() && this.journal.items)) return;
        const selectedLayer = this.map.layers[this.map.selectedLayer()];
        let tokens = JSON.parse(selectedLayer.layer_tokens);
        for (let i in tokens) {
            let item = this.journal.searchItem(i);
            this.map.gameBoard.innerHTML += this.map.tokenFormatting(item);
        }
        this.map.tokensDraggable = new Draggable('.symbol.cursor-move', null, {zIndex: 1100});
        for (let i in tokens) {
            let item = this.journal.searchItem(i);
            let newToken = this.map.tokensDraggable.findContainer('token_' + item.info.item_id);
            newToken.setAxis(tokens[i].left, tokens[i].top);
        }
        this.map.hearTokenThings();
        this.map.container = q('#' + this.map.container.id)[0];
        // this.map.setMapListeners();
    }

    setDraggableTokens(ondragEvt) {
        let btn = ondragEvt.target;
        btn.ondragend = (dragendEvt) => {
            // Return if there is no layer selected
            if (!(this.map && this.map.selectedLayer() && this.map.layers)) return;
            // Serach item
            let item = this.journal.searchItem(btn.value);
            let layertokens = JSON.parse(this.map.layers[this.map.selectedLayer()].layer_tokens);
            // Check layer, if it has the token already
            for (let i in layertokens) {
                // If token already exists, do not ad another one
                if (i === item.info.item_id) return;
            }

            if (dragendEvt.pageX > this.map.offsetStart && dragendEvt.pageY > this.map.offsetTop) {
                // Double check token has not already been added
                if (q('#token_' + item.info.item_id).length !== 0) return;
                // If game board div is not found return
                if (!this.map.gameBoard) return;
                // Add token to game board
                this.map.gameBoard.innerHTML += this.map.tokenFormatting(item);
                this.map.tokensDraggable = new Draggable('.symbol.cursor-move', null, {zIndex: 1100});
                let newToken = this.map.tokensDraggable.findContainer('token_' + item.info.item_id);
                const coords = this.map.getPixels(dragendEvt, newToken);
                newToken.setAxis(coords.x + 'px', coords.y + 'px');
                this.map.saveToken(newToken);
                this.map.hearTokenThings();
            }
        }
    }

    reload() {
        if (this.map.changed) this.loadTokens();
        if (this.journal.changed) this.loadItemsFields();
        this.setItemsOpening();
    }
}