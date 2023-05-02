class GameMap {
    constructor(id, options = {}) {
        this.container = q(id)[0];
        this.layersClass = id + '_layer';
        this.layers = {};
        this.layersFolder = '';
        if (options.folder) this.layersFolder = options.folder;
        if (options.ajax) this.loadAjax(options.ajax);
    }

    set Layers(layer) {
        this.layers[layer.layer_id] = layer;
    }

    addLayer(img) {
        this.container.innerHTML += '<!--begin::Layer-->' +
            '<div class="position-absolute h-100 w-100 top-0 start-0' + this.layersClass + '"' +
            '   style="background: url(' + img + ') no-repeat;background-size: cover;">' +
            '</div>' +
            '<!--end::Layer-->';
    }

    loadLayers() {
        for (let l in this.layers) {
            this.addLayer(this.layersFolder + this.layers[l].layer_bg);
        }
    }

    loadAjax(url) {
        $.ajax({
            type: "get",
            url: url,
            dataType: "json",
            success: (data) => {
                for (let layer of data['layers']) {
                    this.Layers = layer;
                    this.addLayer(this.layersFolder + layer.layer_bg);
                }
            }, error: (e) => {
                console.log(e);
            }
        })
    }

    reload() {
        this.container.innerHTML = '';
        this.loadLayers();
    }
}