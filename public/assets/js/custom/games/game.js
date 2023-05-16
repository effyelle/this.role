function initGame(dbGame, session) {
    // * Board intance * //
    const board = new Board('.btn.dice');
    board.map = new GameMap('#this-game', {
        folder: '/assets/media/games/' + dbGame.game_folder + '/layers/',
        select: '#change_layer',
        game: dbGame
    });

    //* begin::Map Layers *//

    function listenToNewMaps() {
        this.lName = q('#layer_name')[0];
        this.lImg = q('#add_map-input')[0];
        this.lImgPreview = q('#add_layer-preview')[0];
        this.btn = q('#add_layer-btn')[0];

        this.lImg.onchange = () => {
            // Change bg from holder
            readImageChange(this.lImg, this.lImgPreview);
        }

        const newMap = () => {
            if (this.lName.value !== '' && this.lImg.files.length > 0) {
                let form = new FormData();
                form.append('layer_img[]', this.lImg.files[0]);
                form.append('layer_name', this.lName.value);
                $.ajax({
                    type: "post",
                    url: "/app/games_ajax/add_map/" + dbGame.game_id,
                    data: form,
                    processData: false,
                    contentType: false,
                    success: (data) => {
                        data = (JSON.parse(data)).data;
                        let img = data.img;
                        if (data.response) {
                            // Reload map layers
                            $('.modal_success_response').html('Map added correctly');
                            $('#modal_success-toggle').click();
                            return;
                        }
                        $('.modal_error_response').html(img);
                        $('#modal_error-toggle').click();
                    },
                    error: (e) => {
                        console.log("Error: ", e);
                    }
                });
                return;
            }
            q('#add_layer-error')[0].removeClass('d-none');
        }

        const selectMap = () => {
            // Save selected map
            let selectedMap = q('#change_layer')[0].value;
            // Update selected map
            ajax('/app/games_ajax/set_selected_layer/' + dbGame.game_id + '?layer_id=' + selectedMap);
            // Change image in HTML
            // board.map.showLayer(board.map.layersFolder + board.map.layers[selectedMap].layer_bg);
        }

        const editMap = () => {
            if (this.lName.value !== '') {
                let form = new FormData();
                if (this.lImg.files.length > 0) form.append('layer_img[]', this.lImg.files[0]);
                form.append('layer_name', this.lName.value);
                form.append('layer_id', q('#change_layer')[0].value);

                $.ajax({
                    type: "post",
                    url: '/app/games_ajax/edit_layer/' + dbGame.game_id,
                    data: form,
                    processData: false,
                    contentType: false,
                    success: (data) => {
                        data = (JSON.parse(data)).data;
                        let img = data.img;
                        if (data.response) {
                            // Reload map layers
                            $('.modal_success_response').html('Map updated');
                            $('#modal_success-toggle').click();
                            return;
                        }
                        $('.modal_error_response').html(img);
                        $('#modal_error-toggle').click();
                    },
                    error: (e) => {
                        console.log("Error: ", e);
                    }
                });
                return;
            }
            q('#add_layer-error').removeClass('d-none');
        }

        const deleteMap = () => {
            ajax('/app/games_ajax/delete_layer/' + q('#change_layer')[0].value);
        }

        this.btn.click(newMap);

        // Select map on click
        q('#select_layer-btn')[0].click(selectMap);

        // Delete layer on click
        q('#delete_layer-btn')[0].click(function () {
            openConfirmation(deleteMap);
        });

        // Fill add modal on click
        q('#edit_layer-btn').click((e) => {
            q('#add_layer-modal .modal-header h4')[0].innerHTML = 'Edit Layer';
            q('#layer_name')[0].value = $('#change_layer').find(':selected').text();
            this.btn.removeEventListener('click', newMap);
            this.btn.click(editMap);
        });

        // On modal closure
        $('#add_layer-modal').on('hidden.bs.modal', () => {
            q('#add_layer-modal .modal-header h4')[0].innerHTML = 'Add Layer';
            // Reset fields and divs
            this.lName.value = '';
            this.lImg.value = '';
            this.lImgPreview.style.backgroundImage = 'none';
            q('#add_layer-error').addClass('d-none');
            // Reset listeners
            this.btn.removeEventListener('click', editMap);
            this.btn.click(newMap);
        });
    }

    if (dbGame.game_creator === session.user_id) listenToNewMaps();

    //* end::Map Layers *//

    //* begin::Journal *//

    const journal = new Journal('journal', {
        onLoad: function (data) {
            console.log(data);
        },
        onError: function (e) {
            console.log(e);
            $('.modal_error_response').html(e);
            $('#modal_error-toggle').click();
        }
    });

    //* end::Journal *//

    //* begin::Chat *//

    const chat = new Chat('#chat_messages');
    if (!chat.error) {
        chat.from = () => {
            let select = q('#charsheet_selected')[0];
            if (select) {
                if (!isNaN(select.value)) {
                    let it = journal.searchItem(parseInt(select.value));
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
        chat.ChatBubble = '#chat';
        //* Save basic rolls *// -> This is the navigation menu on top of the page (all the dices in black & white)
        q('.btn.dice').click(function () {
            this.text = () => {
                let nDices = 1;
                let input = q('#roll-' + this.value)[0];
                if (input && input.value !== "" && !isNaN(input.value)) nDices = input.value;
                return chat.formatBasicRoll(this.value, nDices, board.dices[this.value].roll(nDices));
            }
            let thisFrom = chat.from();
            chat.saveChat({
                icon: thisFrom.icon,
                msg: this.text(),
                sender: thisFrom.name,
                msgType: "nav_dice"
            });
        });
        //* Next rolls to listen are the ones from the journal items *//
        // -> Incomplete
    } else {
        console.log("Could not init chat: ", chat.error);
    }

    //* end::Chat *//


    thisShouldBeAWebSocket();

    //* Interval to get page responses in "real" time *//
    setInterval(thisShouldBeAWebSocket, 5000);

    function thisShouldBeAWebSocket() {
        chat.getChat();
        journal.initJournal();
        board.map.loadLayers();
        /*journal.getJournalAjax().done((data) => {
            if (data.results && data.results.length === journal.items.length) {
                if (!dataChanged(data)) return;
                journal.reload();
            }
        });*/
    }
}