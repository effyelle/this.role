class News {

    constructor() {

        // =================
        // Declare constants
        // =================

        /**
         * Editor box will be your textarea div to be replaced, this can't be a jQuery Object
         * @type {HTMLElement}
         */
        this.CKEditorBox = document.querySelector('#news-body');
        /**
         * Label for news body textarea
         * @type {*|jQuery|HTMLElement}
         */
        this.newsLabel = $('label[for=news-body]');
        /**
         * Box for news loaded from Database
         * @type {*|jQuery|HTMLElement}
         */
        this.newsContainer = $('#news-list');
        /**
         * Input type text to hold news title
         * @type {*|jQuery|HTMLElement}
         */
        this.titleInput = $('#news-title');
        /**
         * Label for news title input
         * @type {*|jQuery|HTMLElement}
         */
        this.titleLabel = $('label[for=news-title]');
        /**
         * News icon input container
         * @type {*|jQuery|HTMLElement}
         */
        this.newsIconBox = $('.news-icon');
        /**
         * News icon input
         * @type {*|jQuery|HTMLElement}
         */
        this.newsIcon = $('#news-icon');
        /**
         * Button to toggle editting in existing news
         * @type {*|jQuery|HTMLElement}
         */
        this.editBtn = $('#edit_news-btn');
        /**
         * Saves changes on existing news and turns off editing, or creates news.
         * Makes 2 different calls to Database through AJAX: update or insert.
         * @type {*|jQuery|HTMLElement}
         */
        this.saveBtn = $('#save_news-btn');
        /**
         * Opens an empty instance of CKEditor for creating news.
         * @type {*|jQuery|HTMLElement}
         */
        this.addBtn = $('#add_news-btn');
        /**
         * Triggers an attempt to delete an opened news. News ID is saved into this same button value after calling
         * this class method {@link readNews}
         *
         * @type {*|jQuery|HTMLElement}
         */
        this.delBtn = $('#delete_news-btn');

        // ===============
        // Init basic functions
        // ===============

        // Add listener to input to toggle valid or not valid
        this.titleInput.on('keyup', toggleValid);
        // Get news from Database and make them readable
        this.getNews();
        this.editBtn.click(async () => {
            this.toggleEditable(true);
            await this.createCKEditor(this.CKEditorBox);
        });
        this.addBtn.on('click', async () => {
            await this.createNews();
        });
        this.delBtn.click(function () {
            const formData = new FormData();
            formData.append('newsID', this.value);
            fetch('/news/delete_news', {method: "post", body: formData}).then(r => r.text())
                .then((data) => {
                    if (!data['error']) {
                        toastr.success('Noticia borrada con éxito.', 'Formulario enviado');
                        window.location.reload();
                    } else {
                        toastr.error(data['msg'], 'Error');
                    }
                }).catch((e) => {
                console.log("❌ Error: ", e);
            })
        });
        this.newsIcon.change(function () {
            console.log(this)
        });
    }

    /**
     * Get news data
     * -----------------------------------------------------------------------------------------------------------------
     * Makes an asynchronous call to Database and it creates a link for each news including the title and who created
     * it. Sets a listener to each news link to make then readable by calling {@link readNews}.
     */
    getNews() {
        if (this.newsContainer !== null && typeof this.newsContainer !== 'undefined') {
            fetch('/news/get_news').then(r => r.json()).then((data) => {
                if (!data['error']) {
                    const results = data['results'];
                    if (results.length > 0) {
                        this.newsContainer.html('');
                        // show results
                        for (let i in results) {
                            let news = results[i];
                            this.newsContainer.html(this.newsContainer.html() + this.formatNewsLinks({
                                title: news['newsTitle'],
                                createdBy: news['createdBy'],
                                canEdit: news['creatorID'] === data['user']
                            }));
                        }
                        // Fill container so that news links exist.
                        // Add listener to open news links one by one.
                        // This will open CKEditor for each clicked news.
                        const newsLinks = document.getElementsByClassName('show-news');
                        for (let i = 0; i < newsLinks.length; i++) {
                            newsLinks[i].addEventListener('click', async () => {
                                // Remove CKEditor completely before creating a new one
                                $('.ck-editor').remove();
                                // Fill news body in Modal.
                                // This is the non jquery object to init CKEditor.
                                this.CKEditorBox.innerHTML = results[i]['newsBody'];
                                // Read news
                                this.readNews(results[i], results[i]['creatorID'] === data['user']);
                            });
                        }
                    } else {
                        this.newsContainer.html('<div class="d-flex align-items-sm-center justify-content-center">' + '   <h2>¡Todavía no se ha publicado ninguna noticia!</h2>' + '</div>');
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    /**
     * Open news separately
     * -----------------------------------------------------------------------------------------------------------------
     * Fills modal with news title and body, then sets listeners to edit and save buttons.
     *
     * @param data -News data such as title and body.
     * @param editable -True if the user was the one to created the news.
     */
    readNews(data, editable) {
        $('button[data-bs-dismiss="modal"]').removeClass('align-self-start');
        this.CKEditorBox.style.display = 'block';
        // Fill title
        this.titleInput.val(data['newsTitle']);
        this.titleLabel.html(this.titleInput.val());
        // Give news ID value to Delete Button
        this.delBtn.val(data['newsID']);
        //
        // Erase all CK tags that could be CSS trouble
        //
        $('p').has('br[data-cke-filler=true]').html('');
        $('.ck.ck-reset_all.ck-widget__type-around').remove();
        $('.ck.ck-widget__selection-handle').remove();
        // Config what has to be seen
        this.toggleEditable(false);
        this.editBtn.addClass('d-none');
        this.delBtn.addClass('d-none');
        if (editable) {
            // Show delete and edit buttons if user can edit
            this.editBtn.removeClass('d-none');
            this.delBtn.removeClass('d-none');
            // Unbind Save Button for create and add listener for update
            this.saveBtn.unbind('click');
            this.saveBtn.click(() => {
                this.toggleEditable(false);
                if (checkFields('news')) {
                    // Update to Database
                    this.updateNews(this.delBtn.val());
                    window.location.reload();
                }
            });
        }
    }

    /**
     * Create news settings
     * -----------------------------------------------------------------------------------------------------------------
     * Empties the news modal to fill it with an empty CKEditor instance. Sets a listener to the save button to make
     * an AJAX insert call and reloads the page on success.
     */
    async createNews() {
        // Reset values for news editor
        $('button[data-bs-dismiss="modal"]').addClass('align-self-start');
        this.titleLabel.html('Título de la noticia');
        this.titleLabel.removeClass('d-none');
        this.titleInput.removeClass('d-none');
        this.newsLabel.removeClass('d-none');
        //this.newsIconBox.removeClass('d-none');
        // Show all for editing
        this.titleInput.removeClass('d-none');
        this.titleInput.attr('placeholder', 'Título de la noticia');
        this.titleLabel.addClass('form-label required mb-3');
        // Hide Edit and Delete Buttons if they were shown
        this.editBtn.addClass('d-none');
        this.delBtn.addClass('d-none');
        // Remove CKEditor completely before creating a new one
        $('.ck-editor').remove();
        // Empty CKEditorBox body
        this.CKEditorBox.innerHTML = '';
        if (await this.createCKEditor(this.CKEditorBox)) {
            // Unbind Save Button for update and add listener for create
            this.saveBtn.unbind('click');
            this.saveBtn.removeClass('d-none');
            this.saveBtn.click(async () => {
                if (checkFields('news')) {
                    const formData = new FormData();
                    formData.append('news_title', this.titleInput.val().trim());
                    formData.append('news_body', this.CKInstance.getData().trim());
                    await fetch('/news/add_news', {method: 'post', body: formData})
                        .then(r => r.json())
                        .then((data) => {
                            if (!data['error']) {
                                toastr.success('Noticia creada con éxito.', 'Formulario enviado');
                                window.location.reload();
                            } else {
                                console.log(data['msg']);
                                toastr.error('Fallo del servidor o de la base de datos.', 'No se pudo crear la noticia');
                            }
                        }).catch((error) => {
                            console.log(error);
                        });
                }
            });
        }
    }

    /**
     * Update news data
     * -----------------------------------------------------------------------------------------------------------------
     * @param id
     */
    updateNews(id) {
        let formData = new FormData();
        formData.append('news_title', this.titleInput.val().trim());
        formData.append('news_body', this.CKEditorBody.html().trim());
        formData.append('id_news', id);
        // must receive news ID?
        fetch('/news/update_news', {method: 'post', body: formData})
            .then(r => r.json())
            .then((data) => {
                if (!data['error']) {
                    this.getNews();
                    toastr.success('Noticia actualizada con éxito.', 'Formulario enviado');
                } else {
                    console.log(data['msg']);
                    toastr.error('Algo falló en la base de datos.', 'Formulario devuelto');
                }
            }).catch((error) => {
            console.log(error);
            toastr.error('Fallo en el navegador o en el servidor.', 'Formulario devuelto');
        });
    }

    /**
     * Create a CKEditor instance
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param editor -HTML Object given
     * @returns {Promise|boolean}
     */
    async createCKEditor(editor) {
        // if i close modal after clicking edit, info starts mixing between news
        const config = {
            image: {
                resizeUnit: 'px',
                resizeOptions: [
                    {
                        name: 'resizeImage:original',
                        label: 'Original',
                        value: null
                    },
                    {
                        name: 'resizeImage:100',
                        label: '100px',
                        value: '100'
                    },
                    {
                        name: 'resizeImage:200',
                        label: '200px',
                        value: '200'
                    }
                ]
            }
        };
        return ClassicEditor
            .create(editor, config)
            .then(editor => {
                console.log("✔ Editor was initialized: ", editor);
                this.CKInstance = editor;
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                    return new UploadAdapter(loader);
                };
                editor.plugins.get('Image');
                //editor.plugins.get('ImageResize');
                editor.plugins.has('ImageResize');
                //
                // Save CKEditor boxes.
                //
                // Editor head which allows to format text and add media.
                this.CKEditorHeader = $('.ck-editor__top');
                // Editor body which allows to write in it.
                this.CKEditorBody = $('.ck.ck-content.ck-editor__editable.ck-editor__editable_inline');
                this.CKEditorBody.addClass('news-field');
                // Al divs that are editable in CKEditor pluggin.
                this.CKEditableTags = $('.ck-editor__editable');
                return true;
            })
            .catch(error => {
                console.error("❌ Error: ", error);
                return false;
            });
    }

    /**
     * Toggle CKEditor editable
     * -----------------------------------------------------------------------------------------------------------------
     * Hides or shows elements and sets the editable tags in CKEditor HTML.
     * @param editing -type: boolean
     */
    toggleEditable(editing) {
        this.editBtn.toggleClass('d-none', editing);
        this.saveBtn.toggleClass('d-none', !editing);
        this.delBtn.toggleClass('d-none', editing);
        this.titleInput.toggleClass('d-none', !editing);
        this.titleLabel.toggleClass('d-none', editing);
        this.newsLabel.toggleClass('d-none', !editing);
        //this.newsIconBox.toggleClass('d-none', !editing);
    }

    /**
     * Format news links HTML
     * -----------------------------------------------------------------------------------------------------------------
     * @param data
     * @returns {string}
     */
    formatNewsLinks(data = {}) {
        let img = typeof data.img !== 'undefined' ? data.img : 'default-news.png';
        let title = typeof data.title !== 'undefined' ? data.title : 'ejemplo';
        let createdBy = data.canEdit ? 'ti' : data.createdBy;
        return '<div class="d-flex align-items-sm-center mb-7">' +
            '   <!--begin::Icon-->' +
            '   <div class="symbol symbol-50px me-5">' +
            '       <span class="symbol-label">' +
            '           <img src="assets/media/icons/news/' + img + '"' +
            '               class="h-75 align-self-center" alt=""/>' +
            '       </span>' +
            '   </div>' +
            '   <!--end::Icon-->' +
            '   <!--begin::Section-->' +
            '   <div class="d-flex align-items-center flex-row-fluid flex-wrap">' +
            '       <div class="flex-grow-1 me-2">' + // ESTE LINK TIENE QUE ABRIR UNA MODAL CON EL CONTENIDO DE LA NOTICIA
            '           <a href="#" class="text-gray-800 text-hover-primary fs-6 fw-bolder show-news"' +
            '               data-bs-target="#news-modal" data-bs-toggle="modal">' +
            '               ' + title + '' +
            '           </a>' +
            '       </div>' +
            '       <span class="badge badge-light fw-bolder my-2">Creado por ' + createdBy + '</span>' +
            '   </div>' +
            '   <!--end::Section-->' +
            '</div>'
    }

}