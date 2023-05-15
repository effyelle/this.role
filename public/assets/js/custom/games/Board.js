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
                '       <div class="menu-title text-center">' + data.msg + '</div>' +
                '   </div>' +
                '</div>' +
                '<!--end::Menu Item-->';
        }
        this.formatBasicRoll = (rolls) => {
            let rollSum = 0;
            let tooltip = '';
            for (let r of rolls) {
                rollSum += r;
                tooltip += '<span>' + r + '</span>+';
            }
            tooltip = tooltip.substring(0, tooltip.length - 1);
            return '<h5>' + rollSum + '</h5><em class="m-0 flex-row-wrap">(' + tooltip + ')</em>';
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