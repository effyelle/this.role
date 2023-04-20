function formatMenuItem(data = {}) {
    return '<!--begin::Menu Item-->' +
        '<div class="menu-item">' +
        '   <a class="menu-link" href="#">' +
        '       <!--begin::Symbol-->' +
        '       <div class="me-2 symbol symbol-20px symbol-md-30px">' +
        '           <span class="symbol-label circle icon"' +
        '               style="background: ' + data.src + '; background-size:cover;">' +
        '           </span>' +
        '       </div>' +
        '       <!--end::Symbol-->' +
        '       <span class="menu-title">' + data.name + '</span>' +
        '   </a>' +
        '</div>' +
        '<!--end::Menu Item-->';
}

class Chat {
    constructor(querySelector) {
        this.record = document.querySelector(querySelector);
        this.msgType = {
            chatMessage: this.chatMessage,
            rollDice: this.rollDice,
        }
    }

    chatMessage(data) {
        return '<!--begin::Menu Item-->' +
            '<div class="menu-item py-3">' +
            '   <div class="d-flex flex-row justify-content-between align-items-center gap-3">' +
            '       <div class="d-flex flex-row justify-content-start align-items-center gap-3">' +
            '           <!--begin::Symbol-->' +
            '           <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '               <span class="symbol-label circle icon">' +
            '               ' +// style="background: ' + data.src + '; background-size:cover;"
            '               </span>' +
            '           </div>' +
            '           <!--end::Symbol-->' +
            '           <div>' + data.sender + '</div>' +
            '       </div>' +
            '       <i>' + (new Date()).toLocaleDateString() + '</i>' +
            '   </div>' +
            '   <div class="d-flex flex-column justify-content-center align-items-center">' +
            '       <span class="menu-title">' + data.msg + '</span>' +
            '   </div>' +
            '</div>' +
            '<!--end::Menu Item-->';
    }

    rollDice(data) {
        return '<!--begin::Menu Item-->' +
            '<div class="menu-item py-3">' +
            '   <div class="d-flex flex-row justify-content-between align-items-center gap-3">' +
            '       <div class="d-flex flex-row justify-content-start align-items-center gap-3">' +
            '           <!--begin::Symbol-->' +
            '           <div class="me-2 symbol symbol-20px symbol-md-30px">' +
            '               <span class="symbol-label circle icon">' +
            '               ' +// style="background: ' + data.src + '; background-size:cover;"
            '               </span>' +
            '           </div>' +
            '           <!--end::Symbol-->' +
            '           <div>' + data.sender + '</div>' +
            '       </div>' +
            '       <i>' + (new Date()).toLocaleDateString() + '</i>' +
            '   </div>' +
            '   <div class="d-flex flex-column justify-content-start align-items-center gap-3">' +
            '       <span class="menu-title"><i>Rolling ' + data.rolling + data.dice + '</i></span>' +
            '       <h6 class="menu-title">' + data.msg + '</h6>' +
            '   </div>' +
            '</div>' +
            '<!--end::Menu Item-->';
    }

    formatMessage(data = {}) {
        return this.msgType[data.type](data);
    }
}

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