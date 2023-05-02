class Map {
    constructor(id = '', options = {}) {
        this.container = q(id)[0];
        this.layersID = id + '_layer';
    }
}