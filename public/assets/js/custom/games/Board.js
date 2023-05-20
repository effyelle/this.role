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

    setItems() {
        // Save button items from DOM
        const itemOpenersButtons = q('.' + this.journal.itemClass + ' button.menu-link');
        // Check data and items have the same length -> means they have been created accordingly
        // Iterate items
        for (let itemOpenerBtn of itemOpenersButtons) {
            // Add a click listener to each item to create a new modal
            if (this.journal.changed) {
                this.loadItemsFields();
                itemOpenerBtn.addEventListener('click', () => {
                    this.setDraggableItemSheets(itemOpenerBtn);
                });
            }
            if (this.map.changed) {
                this.loadTokens();
                itemOpenerBtn.addEventListener('drag', (e) => {
                    this.setDraggableTokens(e);
                });
            }
        }
    }

    loadItemsFields() {
        // Load what
        if (this.journal.journalDraggable && this.journal.journalDraggable.containers) {
            const draggables = this.journal.journalDraggable.containers;
            for (let draggable of draggables) {
                if (!draggable) return;
                let itemID = draggable.id.substring(draggable.id.length - 1);
                let it = this.journal.searchItem(itemID);
                if (!it) {
                    draggable.remove();
                    continue;
                }
                this.journal.fillDraggable(it);
            }
        }
    }

    setDraggableItemSheets(btn) {
        // Get item info from Journal
        let item = this.journal.searchItem(btn.value);
        if (!item || item === {}) return;
        // Return if item has already been opened
        if (q('#' + item.draggableContainerId).length !== 0) return;
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
            // * IMPORTANT * //
            // /  /  Make it so journal.draggables reset after one closed  /  / //
            let closers = this.journal.journalDraggable.closers;
            for (let i = 0; i < closers.length; i++) {
                closers[i].addEventListener('click', () => {
                    this.journal.JournalDraggable = new Draggable('.' + item.draggableContainerClass, '.' + item.draggableContainerClass + ' .cursor-move', {
                        max: '.max-btn',
                        min: '.min-btn',
                        close: '.close_item-btn',
                        closeTargets: ['.draggable_close']
                    });
                });
            }
            // Load data
            this.loadItemsFields();
            // Set listeners
            this.journal.listenToOpenedItems(item);
            this.hearDicesThrows();
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
        this.map.TokensDraggable = new Draggable('.symbol.cursor-move', null, {zIndex: 1100});
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

    hearDicesThrows() {
        if (this.journal.items && Object.keys(this.journal.items).length > 0) {
            for (let i in this.journal.items) {
                let item = this.journal.items[i];
                this.initiativeThrow(item);
                this.savingThrows(item);
                this.skillThrows(item);
            }
        }
    }

    initiativeThrow(it) {
        const initLabel = q('#' + it.draggableContainerId + ' label[for=this_init]')[0];
        if (!initLabel) return;
        const text = (it) => {
            let raw = this.dices['d20'].roll(1)[0];
            let initTierBreaker = it.getInitTierBreaker();
            // Round to 3 decimals, otherwise sometimes it goes cray cray
            let roll = Math.round((raw + initTierBreaker) * 1000) / 1000;
            let display = 'Rolling 1d20' + (initTierBreaker >= 0 ? '+' : '') + initTierBreaker + '(dex)=' + raw + (initTierBreaker >= 0 ? '+' : '') + initTierBreaker;
            return this.chat.formatRoll({
                name: 'Initiative',
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + roll + '</span>',
                modifier: initTierBreaker,
                display: '<span class="text-muted">' + display + '</span>'
            });

        };
        initLabel.click(() => {
            let item = this.journal.searchItem(it.info.item_id);
            let thisFrom = this.chat.from();
            this.chat.saveChat({
                icon: thisFrom.icon,
                msg: text(item),
                sender: thisFrom.name,
                msgType: "nav_dice"
            });
        });
    }

    savingThrows(it) {
        const scoreProfChecks = q('#' + it.draggableContainerId + ' .score_prof');
        const text = (it, scoreName, isProf, save) => {
            let raw = this.dices['d20'].roll(1)[0];
            let scoreFName = it.getScore(scoreName).fname;
            let scoreModifier = isProf ? it.getProfScoreModifier(scoreName) : it.getRawScoreModifier(scoreName);
            let roll = raw + scoreModifier;
            let display = 'Rolling 1d20' + (scoreModifier >= 0 ? '+' : '') + scoreModifier + '(' + scoreName + ')=' + raw + (scoreModifier >= 0 ? '+' : '') + scoreModifier;
            return this.chat.formatRoll({
                name: getTitle(scoreFName) + (save ? ' Saving Throw ' : ' (Plain) '),
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + roll + '</span>',
                modifier: scoreModifier,
                display: '<span class="text-muted">' + display + '</span>'
            });
        }
        for (let score of scoreProfChecks) {
            let split = score.getAttribute('name').split('_');
            let scoreName = split[split.length - 1];
            // Raw ability throws
            let rawBtn = q('#' + it.draggableContainerId + ' label[for="this_score_' + scoreName + '"]')[0].previousElementSibling;
            rawBtn.addEventListener('click', () => {
                let item = this.journal.searchItem(it.info.item_id);
                let thisFrom = this.chat.from();
                this.chat.saveChat({
                    icon: thisFrom.icon,
                    msg: text(item, scoreName, false, false),
                    sender: thisFrom.name,
                    msgType: "nav_dice"
                });
            });
            // Saving throws (+prof)
            let saveBtn = q('#' + it.draggableContainerId + ' button[name="this_save_' + scoreName + '"]')[0];
            saveBtn.click(() => {
                let item = this.journal.searchItem(it.info.item_id);
                let thisFrom = this.chat.from();
                this.chat.saveChat({
                    icon: thisFrom.icon,
                    msg: text(item, scoreName, score.checked, true),
                    sender: thisFrom.name,
                    msgType: "nav_dice"
                });
            });
        }
    }

    skillThrows(it) {
        const skillChecks = q('#' + it.draggableContainerId + ' .skill_prof');
        const text = (it, skill) => {
            let skillName = skill.getAttribute('name').substring(11);
            let skillScore = it.getSkill(skillName).score;
            let raw = this.dices['d20'].roll(1)[0];
            let modifier = it.getSkillProficiency(skillName)
            let roll = raw + modifier;
            let display = 'Rolling 1d20' + (modifier >= 0 ? '+' : '') + modifier + '(' + skillScore + ')=' +
                raw + (modifier >= 0 ? '+' : '') + modifier;
            return this.chat.formatRoll({
                name: getTitle(skillName),
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + roll + '</span>',
                modifier: modifier,
                display: '<span class="text-muted">' + display + '</span>'
            });
        }
        for (let skill of skillChecks) {
            let btn = skill.nextElementSibling;
            btn.click(() => {
                let item = this.journal.searchItem(it.info.item_id);
                let thisFrom = this.chat.from();
                this.chat.saveChat({
                    icon: thisFrom.icon,
                    msg: text(item, skill),
                    sender: thisFrom.name,
                    msgType: "nav_dice"
                });
            });
        }
    }
}