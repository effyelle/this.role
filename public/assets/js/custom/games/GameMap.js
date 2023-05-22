class GameMap {
    constructor() {
        this.gameBoard = q('.this-game')[0]; // this is the superior one
        this.zoom = q('#this_zoom')[0];
        this.img = q('#this_img')[0];
        this.tokenC = q('#tokens_container')[0];
        this.layersFolder = '/assets/media/games/' + dbGame.game_folder + '/layers/';
        this.select = q('#change_layer')[0];
        this.url = {
            get: '/app/games_ajax/get_layers/' + dbGame.game_id
        }
        this.layers = {};
        this.offsetTop = 110; // Pixels
        this.offsetStart = 374; // Pixels
        this.setMapListeners();
    }

    set Layers(layer) {
        this.layers[layer.layer_id] = layer;
    }

    set TokensDraggable(draggable) {
        this.tokensDraggable = draggable;
    }

    setMapListeners() {
        const zoom = (e) => {
            let measure = function (msrStr) {
                for (let i = 0; i < msrStr.length; i++) {
                    // continue searching if character is not empty and is a number
                    if (msrStr.charAt(i) !== '' && !isNaN(msrStr.charAt(i))) continue;
                    // Return measurements
                    return {
                        size: parseFloat(msrStr.substring(0, i)),
                        name: msrStr.substring(i),
                    }
                }
            }
            let msrW = measure(this.zoom.style.width);
            let msrH = measure(this.zoom.style.height);
            msrW.size = msrW.size - (parseFloat(e.deltaY) / 10 * 5);
            msrH.size = msrW.size * 2;
            this.zoom.style.width = msrW.size + msrW.name;
            this.zoom.style.height = msrH.size + msrH.name;
            if (this.tokensDraggable) {
                for (let token of this.tokensDraggable.containers) {
                    token.setProportions('6%');
                }
            }
        }
        const smScreenZomm = (e) => {
            if (e.touches && e.touches.length > 1) {
                console.log(e.touches);
            }
        }
        // Add listeners
        this.zoom.addEventListener('wheel', zoom); // PC
        this.zoom.addEventListener('touchstart', smScreenZomm); // Phone & Tablet
        const rightClick = (e) => {
            e.preventDefault();
        }
        const readMap = (e) => {
            // Check if right click
            if (e.button === 2) {
                const leftOld = e.layerX;
                const topOld = e.layerY;
                this.zoom.onmousemove = (e) => {
                    // Check if right click
                    const leftNew = e.layerX - leftOld;
                    const topNew = e.layerY - topOld;
                    this.zoom.style.left = this.zoom.offsetLeft + leftNew + 'px';
                    this.zoom.style.top = this.zoom.offsetTop + topNew + 'px';
                }
            }
        }
        this.zoom.addEventListener('contextmenu', rightClick);
        this.zoom.addEventListener('mousedown', readMap);
        this.zoom.addEventListener('mouseup', () => {
            this.zoom.onmousemove = null;
        });
    }

    mapHasChanged(dbLayers, thisLayers) {
        // Check layers length changed (most obvious and easy change
        if (dbLayers.length !== Object.keys(thisLayers).length) return true;
        // Check if inner info has changed (name or image)
        for (let layer of dbLayers) {
            let this_layer = thisLayers[layer.layer_id];
            if (!this_layer) return true;
            for (let i in layer) {
                if (layer[i] !== this_layer[i]) return true;
            }
        }
        return false;
    };

    set MapChanged(bool) {
        this.changed = bool;
    }

    showLayer(urlImg) {
        q('.this-game-transition .spinner-border').addClass('d-none');
        q('.this-game-transition .empty-layers').addClass('d-none');
        if (urlExists(urlImg)) {
            this.img.src = urlImg;
            this.img.removeClass('d-none');
            return;
        }
        this.img.addClass('d-none');
        this.img.style.transition = 'all 1s ease';
        q('.this-game-transition .empty-layers')[0]
            .innerHTML = 'You have added no layers yet or old image was not found';
        q('.this-game-transition .spinner-border').addClass('d-none');
        q('.this-game-transition .empty-layers').removeClass('d-none');
    }

    selectedLayer() {
        if (dbGame.game_layer_selected == null ||
            dbGame.game_layer_selected == 'null' ||
            dbGame.game_layer_selected == -1) return false;
        return dbGame.game_layer_selected;
    }

    loadLayers() {
        return ajax(this.url.get).done((data) => {
            let layerBg = 'Empty!';
            // console.log("Data layers length = ", data.layers.length)
            // console.log("Client layers length = ", Object.keys(this.layers).length)
            // If data response false, there are no layers added at all
            if (!data.response) {
                // Reset select
                if (this.select) this.select.innerHTML = '<option disabled selected>No layers available</option>';
                q('.this-game-transition .empty-layers')[0]
                    .innerHTML = 'You have added no layers yet or old image was not found';
                q('.this-game-transition .spinner-border').addClass('d-none');
                q('.this-game-transition .empty-layers').removeClass('d-none');
                // Reset layers
                this.layers = {};
                // Hide buttons
                q('#edit_layer-btn')[0].addClass('d-none');
                q('#delete_layer-btn')[0].addClass('d-none');
                q('#select_layer-btn')[0].addClass('d-none');
                return;
            }

            // Show buttons
            if (q('#edit_layer-btn')[0]) {
                q('#edit_layer-btn')[0].removeClass('d-none');
                q('#delete_layer-btn')[0].removeClass('d-none');
                q('#select_layer-btn')[0].removeClass('d-none');
            }

            // Return if no data has changed
            if (!this.mapHasChanged(data.layers, this.layers)
                && data.game.game_layer_selected === dbGame.game_layer_selected) {
                this.MapChanged = false;
                return;
            }
            this.MapChanged = true;
            // Return if container is not found
            if (!this.img) return;

            // Refill game data
            dbGame = data.game;
            // Set layer selected false until proven true
            let layerSelected = false;

            // Reset container
            this.img.src = 'none';
            this.img.style.transition = 'all 1s ease';
            // Reset select if exists
            if (this.select) this.select.innerHTML = '';
            // Iterate layers (means user is the creator)
            for (let i in data.layers) {
                // Save layer to client
                this.Layers = data.layers[i];
                // Check the selected layer still exists
                if (dbGame.game_layer_selected &&
                    dbGame.game_layer_selected === data.layers[i].layer_id) {
                    // Prove layer selected true
                    layerSelected = true;
                }
                // If select exists (means user is the creator)
                if (this.select) {
                    // Add layer to HTML as select option
                    this.select.innerHTML +=
                        '<!--begin::Option-->' +
                        '<option value="' + data.layers[i].layer_id + '">' +
                        '' + data.layers[i].layer_name + '' +
                        '</option>' +
                        '<!--end::Option-->';
                }
            }
            // Select a layer for the client
            if (!layerSelected) {
                // Save the first layer if no layers are selected
                let firstLayer = this.layers[Object.keys(this.layers)[0]];
                // Set background to that layer
                this.showLayer(this.layersFolder + firstLayer.layer_bg);
                // If select exists (means user is the creator)
                if (this.select) {
                    // Select the same first option
                    $('#' + this.select.id + ' [value=' + firstLayer.layer_id + ']')
                        .prop('selected', true);
                }
                return;
            }
            // Save layer background
            if (this.select) {
                // Select the option from player selection
                $('#' + this.select.id + ' [value=' + dbGame.game_layer_selected + ']')
                    .prop('selected', true);
            }
            // Set background
            this.showLayer(this.layersFolder + this.layers[dbGame.game_layer_selected].layer_bg);
            return data;
        });
    }

    tokenFormatting = (item) => {
        return '<div id="token_' + item.info.item_id + '" style="top: 100vh; left: 100vw;width: 75px;height: 75px;"' +
            ' class="symbol circle position-absolute cursor-move">' +
            '<span class="symbol-label circle" style="background-image: url(' + item.icon() + ')"></span>' +
            '</div>';
    }

    saveToken(token) {
        let itemID = token.id.charAt(token.id.length - 1);
        let post = {
            top: token.style.top,
            left: token.style.left
        }
        ajax('/app/games_ajax/save_token/' + this.selectedLayer(), {coords: post, item_id: itemID}).done((data) => {
            console.log(data);
        });
    }

    deleteToken(token) {
        let itemID = token.id.charAt(token.id.length - 1);
        return ajax('/app/games_ajax/delete_token/' + this.selectedLayer(), {item_id: itemID});
    }

    hearTokenThings() {
        for (let token of this.tokensDraggable.containers) {
            token.addEventListener('mouseup', (event) => {
                // Define if token has been selected
                let tokenSelected = !this.tokensDraggable.hasMoved;
                // Save token if it moved
                const coords = {
                    x: token.offsetLeft / this.zoom.offsetWidth * 100,
                    y: token.offsetTop / this.zoom.offsetHeight * 100
                };
                token.style.left = coords.x + '%';
                token.style.top = coords.y + '%';
                if (!tokenSelected) this.saveToken(token);
                //* begin::Open item AC & health *//
                // ????
                //* end::Open item AC & health *//
                //* begin::Listen to remove token *//
                if (!tokenSelected) {
                    document.onkeyup = null;
                    return;
                }
                document.onkeyup = (e) => {
                    if (e.key === 'Delete') {
                        token.remove();
                        this.deleteToken(token).done((data) => {
                            console.log(data);
                        });
                    }
                }
                //* end::Listen to remove token *//
            });
        }
    }
}