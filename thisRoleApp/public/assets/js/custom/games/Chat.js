class Chat {

    constructor(query) {
        this.error = "HTML object for chat record not found";
        this.record = q(query)[0];
        if (this.record) this.error = false;
        this.messages = [];
        this.chatText = '';
        this.url = {
            save: '/app/games_ajax/set_chat/' + dbGame.game_id,
            get: '/app/games_ajax/get_chat/' + dbGame.game_id
        }
        this.FirstLoad = true;
    }

    set FirstLoad(bool) {
        this.firstLoad = bool;
    }

    set From(f) {
        this.from = f;
    }

    set Select(query) {
        this.select = q(query)[0];
    }

    set SaveBtn(query) {
        this.saveBtn = q(query)[0];
    }

    set ChatBubble(query) {
        this.save = () => {
            if (this.from && this.chatText !== '') {
                this.saveChat({
                    icon: this.from().icon,
                    msg: '<div class="text-start">' + this.chatText + '</div>',
                    sender: this.from().name,
                    msgType: "bubble_chat"
                }).done(() => {
                    this.chatText = '';
                    this.chatBubble.value = '';
                });
            }
        }
        this.chatBubble = q(query)[0];
        this.chatBubble.addEventListener('keyup', (e) => {
            if (e.key === 'Backspace') {
                this.chatText = JSON.stringify(this.chatBubble.value);
            }
        });
        this.chatBubble.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { // If Enter key
                // If Enter without Shift, prevent textarea line break and save message
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.save();
                    return;
                }
            }
            // Save key if not the previous ones
            this.chatText = JSON.stringify(this.chatBubble.value + e.key);
        });
        this.SaveBtn = '#chat_send';
        if (this.saveBtn) this.saveBtn.click(() => {
            this.save();
        });
    }

    formatBasicRoll = (dice, n, rolls) => {
        let rollSum = 0;
        let tooltip = '';
        for (let r of rolls) {
            rollSum += r;
            tooltip += '<span class="' +
                (r == 1 ? 'text-danger' : (r == dice.substring(1) ? 'text-primary' : 'text-muted'))
                + '">' + r + '</span> + ';
        }
        // title="(' + tooltip + ')" data-bs-toggle="tooltip" data-bs-trigger="hover"
        // data-bs-dismiss="mouseout" data-bs-placement="right" data-bs-original-title="(' + tooltip + ')"
        tooltip = tooltip.substring(0, tooltip.length - 3);
        return '<div class="flex-column justify-content-center align-items-center gap-1 text-center">' +
            '<em>Rolling ' + n + dice + '</em>' +
            '<a class="menu-link fw-bolder fs-4">' + rollSum + '</a>' +
            '<em class="flex-row-wrap justify-content-center align-items-center gap-1 px-5">[ ' + tooltip + ' ]</em>' +
            '</div>';
    }

    formatRoll = (opt = {name: "", modifier: "", roll: "", display: ""}) => {
        opt.modifier = opt.modifier && opt.modifier !== '' ? '(' + opt.modifier + ')' : '';
        return '<div class="flex-column justify-content-center align-items-center gap-1 text-center">' +
            '<em>' + opt.name + opt.modifier + '</em>' +
            '<a class="menu-link fw-bolder fs-4">' + opt.roll + '</a>' +
            '<em class="flex-row-wrap justify-content-center align-items-center gap-1 px-5">[ ' + opt.display + ' ]</em>' +
            '</div>';
    }

    formatMessages() {
        if (this.messages.length > 0) {
            this.record.innerHTML = '';
            for (let m of this.messages) {
                let text = m.chat_msg.replaceAll('>"', '>').replaceAll('"<', '<').replaceAll('\\n', '<br>');
                this.formatMessage({
                    icon: m.chat_icon,
                    date: m.chat_datetime,
                    sender: m.chat_sender,
                    text: text,
                    type: m.chat_msg_type
                });
            }
            this.record.scrollTop = this.record.scrollHeight;
            return;
        }
        this.formatMessage();
    }

    /**
     *
     * @param data -array|null
     */
    formatMessage(data) {
        if (!data) {
            this.record.innerHTML = '<!--begin::Menu Item-->\n' +
                '<div class="menu-item py-6 text-danger text-center">\n' +
                '<p>There are no messages yet, be the first to chat!</p>\n' +
                '</div>\n' +
                '<!--end::Menu Item-->';
            return;
        }
        this.record.innerHTML += '<!--begin::Menu Item-->\n' +
            '<div class="menu-item py-3">\n' +
            '    <div class="d-flex flex-row justify-content-between align-items-center gap-3">\n' +
            '        <div class="d-flex flex-row justify-content-start align-items-center gap-3">\n' +
            '            <div class="symbol symbol-25px circle">\n' +
            '                <span class="symbol-label circle" style="background-image: url(' + data.icon + ')"></span>\n' +
            '            </div>\n' +
            '            <div>' + data.sender + '</div>\n' +
            '        </div>\n' +
            '        <i>' + data.date + '</i>\n' +
            '    </div>\n' +
            '    <div class="d-flex flex-column justify-content-center gap-3">\n' +
            '        <div class="menu-title py-2">' + data.text + '</div>\n' +
            '    </div>\n' +
            '</div>\n' +
            '<!--end::Menu Item-->';
    }

    /**
     * Get chat messages into chat.messages if there are new messages
     * (On page load chat.messages will always be empty)
     *
     * @returns {*}
     */
    getChat() {
        return ajax(this.url.get).done((data) => {
            let dataChanged = false;
            if (data.response && data.msgs) {
                dataChanged = true;
                if (Object.keys(this.messages).length === data.msgs.length) {
                    dataChanged = false;
                    for (let i in data.msgs) {
                        if (data.msgs[i].chat_id !== this.messages[i].chat_id) {
                            dataChanged = true;
                            break;
                        }
                    }
                }
                if (dataChanged) {
                    this.messages = data.msgs;
                    this.formatMessages();
                }
                return;
            }
            // Reload if chat was emptied for whatever reason
            if (Object.keys(this.messages).length > 0) {
                this.messages = {};
                this.formatMessages();
                return;
            }
            // This executes on page first load and only if chat was empty
            if (this.firstLoad) {
                this.formatMessages();
                this.FirstLoad = false;
            }
        });
    }

    /**
     * Save chat into Database
     *
     * @param data
     */
    saveChat(data = {icon: "", msg: "", sender: "", msgType: ""}) {
        return ajax(this.url.save, data);
    }
}
