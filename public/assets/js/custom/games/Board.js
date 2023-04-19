const Dice = function (sides) {
    this.sides = sides;
    this.roll = function () {
        let roll = Math.ceil(Math.random() * this.sides);
        while (roll < 0 || roll > this.sides) {
            roll = Math.ceil(Math.random() * this.sides);
        }
        return roll;
    }
}

class Board {
    constructor(dicesClass = '') {
        this.dicesBtns = document.querySelectorAll(dicesClass);
        this.dices = this.createDices(this.dicesBtns);
    }

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
            dicesObjects[i] = new Dice(dicesSides[i]);
        }
        return dicesObjects;
    }
}