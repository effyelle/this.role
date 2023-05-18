$(document).ready(function () {
    generateDatatables();

    updateSession();
});

function ajax(url, form = {}, type = 'post', processing = 'json') {
    return $.ajax({
        type: type,
        url: url,
        dataType: processing,
        data: form,
        success: (data) => {
            return data;
        },
        error: (e) => {
            console.log("Error:");
            console.log(e.responseText);
        }
    });
}

function updateSession(callback = null) {
    $.ajax({
        type: "get", url: "/account/myprofile", dataType: "json", success: function (data) {
            console.log("User logged: ", data);
            if (callback) callback(data);
        }
    });
}

function generateDatatables() {
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

/**
 * Create HTML elements instances through querySelectorAll
 *
 * @param t
 *
 * @returns {NodeListOf<*>}
 */
const q = function (t) {
    let el = document.querySelectorAll(t);
    el.click = function (callback) {
        for (let i = 0; i < el.length; i++) {
            el[i].removeEventListener('click', callback);
            el[i].addEventListener('click', callback);
        }
    };
    el.blur = function (callback) {
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener('blur', callback);
        }
    };
    el.change = function (callback) {
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener('change', callback);
        }
    }
    el.toggleClass = function (classname = " ", bool) {
        for (let i = 0; i < el.length; i++) {
            if (bool) {
                el[i].classList.toggle(classname, bool);
                return;
            }
            el[i].classList.toggle(classname);
        }
    }
    el.addClass = function (classname) {
        for (let i = 0; i < el.length; i++) {
            el[i].classList.add(classname);
        }
    }
    el.removeClass = function (classname) {
        for (let i = 0; i < el.length; i++) {
            el[i].classList.remove(classname);
        }
    }
    for (let i = 0; i < el.length; i++) {
        el[i].click = (callback) => {
            el[i].removeEventListener('click', callback);
            el[i].addEventListener('click', callback);
        }
        el[i].blur = (callback) => {
            el[i].addEventListener('blur', callback);
        }
        el[i].change = (callback) => {
            el[i].addEventListener('change', callback);
        }
        el[i].toggleClass = function (classname, bool) {
            if (bool) {
                this.classList.toggle(classname, bool);
                return;
            }
            this.classList.toggle(classname);

        }
        el[i].addClass = function (classname) {
            this.classList.add(classname);
        }
        el[i].removeClass = function (classname) {
            this.classList.remove(classname);
        }
    }
    return el;
}

function toggleProgressSpinner(onprogress = true) {
    let label = $('.indicator-label');
    let progress = $('.indicator-progress');

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
    const confirmAnswer = $('#modal_confirmation .confirm_answer');
    // Unbind previous callbacks
    confirmAnswer.unbind('click');
    // Add click listener
    confirmAnswer.click(function () {
        // On confirm (YES button) call the callback function
        callback();
    });
    // Open de confirmation modal
    $('#modal_confirmation-toggle').click();
}

function readImageChange(img_input, img_holder) {
    let file = URL.createObjectURL(img_input.files[0]);
    img_holder.style.backgroundImage = 'url(' + file + ')';
    img_holder.style.backgroundSize = 'cover';
    img_holder.style.backgroundPosition = 'center center';
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

function urlExists(url) {
    let http = $.ajax({
        type: 'head', url: url, async: false
    });
    return http.status === 200;
}

