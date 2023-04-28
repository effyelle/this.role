class UploadAdapter {

    constructor(loader) {
        this.loader = loader;
    }

    //Metodo que se encarga de subir el archivo
    upload() {
        console.log(this.loader.file)
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    //Metodo que se encarga de abortar la peticion
    abort() {
        // Aborta la peticion
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Inicializa la peticion
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        //configuramos la url del servidor
        xhr.open('POST', '/news/upload', true);
        xhr.responseType = 'json';
    }

    // Inicializa los listeners
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `❌ No se ha podido subir la imagen al servidor: ${file.name}.`;
        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            console.log(response);
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }
            resolve({
                default: response.url
            });
        });
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    //Envia la peticion
    _sendRequest(file) {
        const data = new FormData();
        data.append('upload', file);
        this.xhr.send(data);
    }

}