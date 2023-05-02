class GameMap {
    constructor(id, options = {}) {
        console.log(id)
        this.container = q(id)[0];
        this.layersClass = id + '_layer';
    }

    addLayer(img) {
        this.container.innerHTML += '<!--begin::Layer-->' +
            '<div class="position-absolute h-100 w-100 top-0 start-0' + this.layersClass + '"' +
            '   style="background: url(' + img + ') no-repeat;background-size: cover;">' +
            '</div>';
    }
}