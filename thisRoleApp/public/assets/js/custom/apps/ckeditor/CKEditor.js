async function createCKEditor(editor) {
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
            this.CKEditorBody = $('.ck.ck-content.ck-editor__editable.ck-editor__editable_inline');            this.CKEditorBody.addClass('news-field');
            // Al divs that are editable in CKEditor pluggin.
            this.CKEditableTags = $('.ck-editor__editable');
            return true;
        }).catch(error => {
            console.error("❌ Error: ", error);
            return false;
        });
}