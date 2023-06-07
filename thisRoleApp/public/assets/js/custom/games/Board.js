class Board {
    /**
     * Board constructor
     * ---
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
        // * begin::Chat * //
        this.chat = new Chat('#chat_messages');
        if (!this.chat.error) this.setChat();
        else this.response("Could not init chat: " + this.chat.error);
        // * end::Chat * //
        // * begin::Map * //
        this.map = new GameMap();
        // * end::Map * //
        // * begin::Journal * //
        this.journal = new Journal('journal');
        // * end::Journal * //
        // * begin::User settings * //
        if (this.journal.playername) {
            // Find playername
            const playername = this.findPlayer(session.user_id).game_display_username;
            // Fill player name
            this.journal.playername.value = playername ? playername : session.user_username;
            // Listen to it changing
            this.setPlayername();
        }
        // * end::User settings * //
    }

    /**
     * Object Dice
     * ---
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
                        let icon = '/assets/media/avatars/blank.png';
                        if (urlExists(it.folder + it.info.item_icon)) {
                            icon = it.folder + it.info.item_icon;
                        }
                        return {icon: icon, name: it.info.item_name};
                    }
                }
            }
            return {icon: session.user_avatar, name: this.journal.playername.value}
        }
        this.chat.Select = '#charsheet_selected';
        this.chat.ChatBubble = '#chat';
        //* Save basic rolls *// -> This is the navigation menu on top of the page (all the dices in black & white)
        for (let btn of this.diceButtons) {
            btn.click(() => {
                this.text = () => {
                    let nDices = 1;
                    let input = q('#roll-' + btn.value)[0];
                    if (input && input.value !== "" && !isNaN(input.value)) {
                        nDices = parseInt(input.value);
                    }
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

    findPlayer(id) {
        for (let player of players) {
            if (player.user_id === id) {
                return player;
            }
        }
        return {game_display_username: null};
    }

    setPlayername() {
        this.journal.playername.onchange = (e) => {
            ajax('app/games_ajax/save_playername/' + dbGame.game_id, {
                user_id: session.user_id,
                playername: this.journal.playername.value
            }).done((data) => {
                if (data.response) {
                    q('#charsheet_selected option[value=username]')[0].innerHTML = this.journal.playername.value;
                }
            });
        }
    }

    /**
     * Create dices objects
     * ---
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
        if (this.journal.changed) {
            console.log(this.journal)
            this.journal.formatJournalItems();
            if (this.journal.adminParent) this.journal.loadAdminSelect();
        }
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
            if (this.map.changed || this.journal.changed) {
                this.loadTokens();
                itemOpenerBtn.addEventListener('touchstart', (e) => {
                    this.setDragTokensTouch(itemOpenerBtn);
                });
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
                if (!draggable) continue;
                let split = draggable.id.split('_');
                let itemID = split[split.length - 1];
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
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
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
        });
    }

    loadTokens() {
        // Reset tokens
        if (this.map.tokensDraggable) {
            this.map.TokensDraggable = null;
            this.map.tokenC.innerHTML = '';
        }
        // Erase all
        for (let child of this.map.gameBoard.children) {
            if (child.classList.contains('symbol')) child.remove();
        }
        if (!(this.map.selectedLayer() && this.journal.items)) return;
        const selectedLayer = this.map.layers[this.map.selectedLayer()];
        let tokens = JSON.parse(selectedLayer.layer_tokens);
        for (let i in tokens) {
            let item = this.journal.searchItem(i);
            if (!item) continue;
            if (!(this.map.tokensDraggable && this.map.tokensDraggable.findContainer('token_' + item.info.item_id))) {
                this.map.tokenC.innerHTML += this.map.tokenFormatting(item);
            }
        }
        this.map.TokensDraggable = new Draggable('.symbol.cursor-move', null, {zIndex: 1100});
        for (let i in tokens) {
            let item = this.journal.searchItem(i);
            if (!item) continue;
            let newToken = this.map.tokensDraggable.findContainer('token_' + item.info.item_id);
            newToken.setAxis(tokens[i].left, tokens[i].top);
            newToken.setProportions('6%');
        }
        this.map.hearTokenThings();
        this.map.img = q('#' + this.map.img.id)[0];
        this.map.zoom = q('#this_zoom')[0];
    }

    addDraggableToken(dragendEvt, item) {
        // Check the mouse went inside the map
        if (dragendEvt.pageX > this.map.offsetStart && dragendEvt.pageY > this.map.offsetTop) {
            // Double check token has not already been added
            if (q('#token_' + item.info.item_id).length !== 0) return;
            // * Add token to game board * //
            this.map.tokenC.innerHTML += this.map.tokenFormatting(item);
            $('#token_' + item.info.item_id + ' .indicator-progress').show();
            this.map.TokensDraggable = new Draggable('.symbol.cursor-move', null, {zIndex: 1100});
            let newToken = this.map.tokensDraggable.findContainer('token_' + item.info.item_id);
            // Percentage of mouse position
            const coords = {
                x: (dragendEvt.clientX - this.map.offsetStart) / this.map.zoom.offsetWidth * 100,
                y: (dragendEvt.clientY - this.map.offsetTop) / this.map.zoom.offsetHeight * 100
            };
            newToken.setAxis(coords.x + '%', coords.y + '%');
            newToken.setProportions('6%');
            this.map.saveToken(newToken).done(() => {
                this.map.hearTokenThings();
            });
            this.map.img = q('#' + this.map.img.id)[0];
            this.map.zoom = q('#this_zoom')[0];
        }
    }

    setDragTokensTouch(btn) {
        if (!(this.map && this.map.selectedLayer() && this.map.layers)) return;
        document.ontouchend = null;
        document.ontouchmove = (touchMove) => {
            document.ontouchend = null;
            document.ontouchend = (touchEnv) => {
                // Search item
                let item = this.journal.searchItem(btn.value);
                if (!item) return;
                let layertokens = JSON.parse(this.map.layers[this.map.selectedLayer()].layer_tokens);
                // Check layer, if it has the token already
                for (let i in layertokens) {
                    // If token already exists, do not ad another one
                    if (i === item.info.item_id) return;
                }
                const dragendEvt = touchMove.touches[0];
                this.addDraggableToken(dragendEvt, item);
            };
        };
    }

    setDraggableTokens(ondragEvt) {
        let btn = ondragEvt.target;
        btn.ondragend = (dragendEvt) => {
            // Return if there is no layer selected
            if (!(this.map && this.map.selectedLayer() && this.map.layers)) return;
            // Search item
            let item = this.journal.searchItem(btn.value);
            if (!item) return;
            let layertokens = JSON.parse(this.map.layers[this.map.selectedLayer()].layer_tokens);
            // Check layer, if it has the token already
            for (let i in layertokens) {
                // If token already exists, do not ad another one
                if (i === item.info.item_id) return;
            }
            // Check the mouse went inside the map
            this.addDraggableToken(dragendEvt, item);
        }
    }

    hearDicesThrows() {
        if (this.journal.items && Object.keys(this.journal.items).length > 0) {
            for (let i in this.journal.items) {
                let item = this.journal.items[i];
                this.initiativeThrow(item);
                this.savingThrows(item);
                this.skillThrows(item);
                this.hitDiceThrow(item);
                this.deathSaveThrow(item);
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
            let symbol = initTierBreaker >= 0 ? '+' : '';
            let display = 'Rolling 1d20' + symbol + initTierBreaker + '(dex) = ' + raw + symbol + initTierBreaker;
            return this.chat.formatRoll({
                name: 'Initiative',
                modifier: initTierBreaker,
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + roll + '</span>',
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
            let symbol = (scoreModifier >= 0 ? '+' : '');
            let display = 'Rolling 1d20' + symbol + scoreModifier + '(' + scoreName + ') = ' + raw + symbol + scoreModifier;
            return this.chat.formatRoll({
                name: getTitle(scoreFName) + (save ? ' Saving Throw ' : ' (Plain) '),
                modifier: scoreModifier,
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + roll + '</span>',
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
            let symbol = modifier >= 0 ? '+' : '';
            let display = 'Rolling 1d20' + symbol + modifier + '(' + skillScore + ') = ' + raw + symbol + modifier;
            return this.chat.formatRoll({
                name: getTitle(skillName),
                modifier: modifier,
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + roll + '</span>',
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

    hitDiceThrow(it) {
        const hitDiceBtns = q('#' + it.draggableContainerId + ' button[name=this_hit_dice_btn]');
        const text = (dice, it) => {
            let raw = this.dices[dice].roll(1)[0];
            let modifier = it.getRawScoreModifier('con');
            let symbol = modifier >= 0 ? '+' : '';
            return this.chat.formatRoll({
                name: 'Hit dice',
                modifier: '1' + dice + '+' + modifier,
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + (raw + modifier) + '</span>',
                display: '<span class="text-muted">Rolling 1' + dice + symbol + modifier + '(con) = ' + raw + symbol + modifier + '</span>'
            });
        }
        for (let btn of hitDiceBtns) {
            btn.click(() => {
                it = this.journal.searchItem(it.info.item_id);
                let thisFrom = this.chat.from();
                this.chat.saveChat({
                    icon: thisFrom.icon,
                    msg: text(btn.value, it),
                    sender: thisFrom.name,
                    msgType: "nav_dice"
                });
            });
        }
    }

    deathSaveThrow(it) {
        const deathSaveBtns = q('#' + it.draggableContainerId + ' button[name=death_saving_throw]');
        const text = (it) => {
            let raw = this.dices['d20'].roll(1)[0];
            let checkings = raw === 20 || raw === 1 ? 2 : 1;
            const gif = q('#death_save_modal #gif')[0];
            if (raw > 10) {
                const deathSavesSuccess = q('#' + it.draggableContainerId + ' .death_saves.success');
                for (let success of deathSavesSuccess) {
                    if (!success.checked) {
                        success.checked = true;
                        this.journal.saveField(success, it.info.item_id);
                        checkings--;
                        if (!success.nextElementSibling) {
                            $('#death_save_modal #death_save_response').html('Gz! You survived!');
                            if (gif) {
                                gif.style.height = '0';
                                gif.style.width = '0';
                            }
                            $('#death_save_modal .btn.btn-primary').html('Continue');
                            $('#death_save_modal_toggle').click();
                        }
                        if (checkings === 0) break;
                    }
                }
            } else {
                const deathSavesFailure = q('#' + it.draggableContainerId + ' .death_saves.danger');
                for (let fail of deathSavesFailure) {
                    if (!fail.checked) {
                        fail.checked = true;
                        this.journal.saveField(fail, it.info.item_id);
                        checkings--;
                        if (!fail.nextElementSibling) {
                            $('#death_save_modal #death_save_response').html("I hope you have a cleric or a druid on your party...");
                            if (gif) {
                                gif.style.height = '280px';
                                gif.style.width = '280px';
                                gif.style.backgroundImage = "url(https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjMyNWRjZTQwZjRjMGYzMjY1ZGViZDhjOWRjZmNkMWIxYzhiYmQyNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/TJawtKM6OCKkvwCIqX/giphy.gif)";
                                gif.style.backgroundSize = 'contain';
                            }
                            $('#death_save_modal .btn.btn-primary').html('Exit');
                            $('#death_save_modal_toggle').click();
                        }
                        if (checkings === 0) break;
                    }
                }
            }
            return this.chat.formatRoll({
                name: 'Death save',
                roll: '<span class="' + (raw === 1 ? 'text-danger' : (raw === 20 ? 'text-primary' : '')) + '"> ' + raw + '</span>',
                display: '<span class="text-muted">Rolling 1d20 = ' + raw + (raw >= 10 ? ' (success)' : ' (failure)') + '</span>',
            });
        }
        for (let dsBtn of deathSaveBtns) {
            dsBtn.click(() => {
                it = this.journal.searchItem(it.info.item_id);
                let thisFrom = this.chat.from();
                this.chat.saveChat({
                    icon: thisFrom.icon,
                    msg: text(it),
                    sender: thisFrom.name,
                    msgType: "nav_dice"
                });
            });
        }
    }
}