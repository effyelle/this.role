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