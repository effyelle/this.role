class GameMap {
    constructor(id, options = {}) {
        this.container = q(id)[0];
        this.layers = {};
        this.layersFolder = options.folder;
        this.ajax = options.ajax;
        this.select = q(options.select).length > 0 ? q(options.select)[0] : false;
        this.game = options.game;
        this.loadLayers();
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
            return;
        }
        this.container.style.backgroundImage = 'none';
        q('.this-game-transition .empty-layers')[0].innerHTML =
            'You have added no layers yet or old image was not found';
        q('.this-game-transition .empty-layers').removeClass('d-none');
    }

    loadLayers() {
        this.loadAjax(this.ajax).done((data) => {
            let layerBg = 'Empty!';
            if (data.response && data.layers.length !== Object.keys(this.layers).length) {
                this.container.innerHTML = '';
                if (this.select) this.select.innerHTML = '';
                for (let i in data.layers) {
                    this.Layers = data.layers[i];
                    if (this.select) {
                        this.select.innerHTML +=
                            '<!--begin::Option-->' +
                            '<option value="' + data.layers[i].layer_id + '">' +
                            '' + data.layers[i].layer_name + '' +
                            '</option>' +
                            '<!--end::Option-->';
                    }
                }
                if (this.game.game_layer_selected && this.layers[this.game.game_layer_selected]) { // Here it's proven that layers should have been filled
                    layerBg = this.layers[this.game.game_layer_selected].layer_bg;
                    if (this.select) {
                        $('#' + this.select.id + ' [value=' + this.game.game_layer_selected + ']')
                            .prop('selected', true);
                    }
                } else if (Object.keys(this.layers).length > 0) { // If no layer has ever been selected
                    layerBg = this.layers[Object.keys(this.layers)[0]].layer_bg;
                }
                this.showLayer(this.layersFolder + layerBg);
            } else if (!data.response) {
                this.showLayer(this.layersFolder + layerBg);
            }
        });
    }

    loadAjax(url) {
        return $.ajax({
            type: "get",
            url: url,
            dataType: "json",
            success: (data) => {
                return data;
            }, error: (e) => {
                console.log("Error: ", e);
            }
        });
    }
}