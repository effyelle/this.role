function initGame() {
    // * Board intance * //
    const board = new Board('.btn.dice');

    //* begin::Map Layers *//

    function listenToNewMaps() {
        this.lName = q('#layer_name')[0];
        this.lImg = q('#add_map-input')[0];
        this.lImgPreview = q('#add_layer-preview')[0];
        this.btn = q('#add_layer-btn')[0];
        this.adminSelect = q('#change_layer')[0];

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
                        console.log(board.map.selectedLayer());
                        if (!board.map.selectedLayer()) {
                            selectMap(data.layers[0].layer_id);
                        }
                        if (data.response) {
                            // Reload map layers
                            $('.modal_success_response').html('Map added correctly');
                            $('#modal_success-toggle').click();
                            return;
                        }
                        $('.modal_error_response').html(data.img);
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

        const selectMap = (id) => {
            // Update selected map
            ajax('/app/games_ajax/set_selected_layer/' + dbGame.game_id + '?layer_id=' + id);
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
            // Select another or null if erasing selected layer
            console.log(this.adminSelect.value === board.map.selectedLayer())
            console.log(this.adminSelect.value)
            console.log(board.map.selectedLayer())
            let selectedValue = this.adminSelect.value;
            if (selectedValue === board.map.selectedLayer()) {
                let anotherLayerFound = false;
                for (let i in board.map.layers) {
                    let layer = board.map.layers[i];
                    if (layer.layer_id != board.map.selectedLayer()) {
                        selectMap(layer.layer_id);
                        anotherLayerFound = true;
                    }
                }
                if (!anotherLayerFound) selectMap(-1);
            }
            ajax('/app/games_ajax/delete_layer/' + selectedValue);
        }

        this.btn.click(newMap);

        // Select map on click
        q('#select_layer-btn')[0].click(() => {
            selectMap(this.adminSelect.value);
        });

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

    //* begin::Chat *//

    //* end::Chat *//


    thisShouldBeAWebSocket();

    //* Interval to get page responses in "real" time *//
    // setInterval(thisShouldBeAWebSocket, 5000);

    function thisShouldBeAWebSocket() {
        board.chat.getChat();
        board.map.loadLayers().done(() => {
            board.journal.initJournal(board).done(() => {
                board.setItemsOpening();
            });
        });
        /*journal.getJournalAjax().done((data) => {
            if (data.results && data.results.length === journal.items.length) {
                if (!dataChanged(data)) return;
                journal.reload();
            }
        });*/
    }
}