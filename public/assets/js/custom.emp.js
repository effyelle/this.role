$(document).ready(function () {
    generateDatatable();

    updateSession(printLog);

    $.ajax({
        type: "get",
        url: "/app/hola",
        success: function (data) {
            console.log(data);
        }
    });
});

function printLog(data) {
    console.log(data);
}

function updateSession(callback) {
    $.ajax({
        type: "get",
        url: "/account/myprofile",
        dataType: "json",
        success: callback
    });
}

function generateDatatable() {
    let element = $('.generate-datatable');
    // CHECK IF ELEMENT HAS .show-search-dt
    if (element !== undefined) {
        if (element.hasClass('show-search-dt')) {
            // IF TRUE, ADD SEARCH INPUT
            element.DataTable({
                responsive: false,
                ordering: false,
                "dom": '<"row float-start"<"col-12"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
            });
            return;
        }
        // IF FALSE, DON'T ADD SEARCH INPUT
        element.DataTable({
            responsive: false
        });
    }
}

function toggleProgressSpinner(onprogress = true) {
    const label = $('.indicator-label');
    const progress = $('.indicator-progress');
    if (onprogress) {
        label.hide();
        progress.show();
        return;
    }
    label.show();
    progress.hide();
}

function validateEmail(emailId) {
    let email = document.querySelector(emailId);
    if (email.value.match(/^[A-Za-z0-9_.]+@[A-Za-z0-9-]+\.[A-Za-z]+$/)) {
        email.classList.add('is-valid');
        email.classList.remove('is-invalid');
        return true;
    }
    email.classList.remove('is-valid');
    email.classList.add('is-invalid');
    return false;
}

function validatePwd(password) {
    let pwd = document.querySelector(password);
    if (pwd.value.length > 0) {
        if (pwd.value.match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/)) {
            pwd.classList.add('is-valid');
            pwd.classList.remove('is-invalid');
            return true;
        }
        pwd.classList.remove('is-valid');
        pwd.classList.add('is-invalid');
        return false;
    }
}

function getForm(parent) {
    let formFields = document.querySelectorAll(parent + ' .this-role-form-field');
    let form = {};
    for (let i = 0; i < formFields.length; i++) {
        let key = formFields[i].getAttribute('name');
        if (formFields[i].value === '') form[key] = null;
        if (key !== null) form[key] = formFields[i].value;
    }
    return form;
}

/**
 * Open confirmation modal
 * -----------------------
 * Open confirmation modal, unbinds confirmation answer and binds it again according to a callback
 *
 * @param callback
 */
function openConfirmation(callback) {
    const confirmAnswer = $('.confirm_answer');
    confirmAnswer.unbind('click');
    confirmAnswer.click(function () {
        if (this.value === "true") {
            callback();
        }
    });
}

function readImageChange(img_input, img_holder) {
    let file = URL.createObjectURL(img_input.files[0]);
    img_holder.css('background-image', 'url(' + file + ')');
    img_holder.css('background-size', 'cover');
}

function toSentenceCase(str) {
    let strAr = str.split(' ');
    str = '';
    for (let i in strAr) {
        str += strAr[i].charAt(0).toUpperCase() + strAr[i].substring(1).toLowerCase();
        if (typeof strAr[i] !== 'undefined') str += ' ';
    }
    return str;
}

function spanPopup(popup) {
    popup.classList.add('show');
    setTimeout(function () {
        popup.classList.remove('show');
    }, 2000);
}