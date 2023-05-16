class GameMap {
    constructor(id, options = {}) {
        this.container = q(id)[0];
        this.layersFolder = options.folder;
        this.select = q(options.select)[0];
        this.url = {
            get: '/app/games_ajax/get_layers/' + dbGame.game_id
        }
        this.game = options.game;
        this.layers = {};
    }

    set Layers(layer) {
        this.layers[layer.layer_id] = layer;
    }

    showLayer(urlImg) {
        q('.this-game-transition .empty-layers').addClass('d-none');
        q('.this-game-transition .spinner-border').addClass('d-none');
        if (urlExists(urlImg)) {
            this.container.style.backgroundImage = "url('" + urlImg + "')";
            this.container.style.backgroundSize = 'cover';
            this.container.style.backgroundPosition = 'center center';
            this.container.style.transition = 'all 1s ease';
            return;
        }
        this.container.style.backgroundImage = 'none';
        this.container.style.transition = 'all 1s ease';
        q('.this-game-transition .empty-layers')[0].innerHTML =
            'You have added no layers yet or old image was not found';
        q('.this-game-transition .empty-layers').removeClass('d-none');
    }

    selectedLayer() {
        if (this.game.game_layer_selected === null ||
            this.game.game_layer_selected === 'null' ||
            this.game.game_layer_selected == 0) return false;
        return this.game.game_layer_selected;
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
                // Select no background
                this.showLayer(this.layersFolder + layerBg);
                // Reset layers
                this.layers = {};
                // Hide buttons
                q('#edit_layer-btn')[0].addClass('d-none');
                q('#delete_layer-btn')[0].addClass('d-none');
                q('#select_layer-btn')[0].addClass('d-none');
                return;
            }

            // Show buttons
            q('#edit_layer-btn')[0].removeClass('d-none');
            q('#delete_layer-btn')[0].removeClass('d-none');
            q('#select_layer-btn')[0].removeClass('d-none');

            let layersHaveChanged = function (dbLayers, thisLayers, dbGame, thisGame) {
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
                // Lastly, check if selected layer has changed
                return dbGame.game_layer_selected !== thisGame.game_layer_selected;
            };

            if (!layersHaveChanged(data.layers, this.layers, data.game, this.game)) return;

            console.log('new data');
            this.game = data.game;
            // Set layer selected false until proven true
            let layerSelected = false;
            console.log('New or deleted layers');
            // Reset container
            this.container.style.backgroundImage = 'none';
            this.container.style.transition = 'all 1s ease';
            // Reset select if exists
            if (this.select) this.select.innerHTML = '';
            // Iterate layers (means user is the creator)
            for (let i in data.layers) {
                // Save layer to client
                this.Layers = data.layers[i];
                // Check the selected layer still exists
                if (this.game.game_layer_selected &&
                    this.game.game_layer_selected === data.layers[i].layer_id) {
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
                $('#' + this.select.id + ' [value=' + this.game.game_layer_selected + ']')
                    .prop('selected', true);
            }
            // Set background
            this.showLayer(this.layersFolder + this.layers[this.game.game_layer_selected].layer_bg);
            return data;
        });
    }
}