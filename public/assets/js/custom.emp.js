$(document).ready(function () {
    generateDatatable();

    updateSession();
});

function updateSession(callback = null) {
    $.ajax({
        type: "get",
        url: "/account/myprofile",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (callback) callback(data);
        }
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
    if (onprogress) {
        $('.indicator-label').hide();
        $('.indicator-progress').show();
        return;
    }
    $('.indicator-label').show();
    $('.indicator-progress').hide();
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
    confirmAnswer.unbind('click');
    confirmAnswer.click(function () {
        callback();
    });
    $('#modal_confirmation-toggle').click();
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

function urlExists(url) {
    let http = $.ajax({
        type: 'head',
        url: url,
        async: false
    });
    return http.status === 200;
}

const Draggable = function (options = {}) {
    this.draggableContainer = document.querySelector(options.container);
    this.draggableArea = document.querySelector(options.pointer);
    this.pos = {};
    this.offLimits = (top, bottom, left, right) => {
        return top < 0 || bottom > window.innerHeight
            || left < 0 || right > window.innerWidth;
    }
    this.closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    this.elementDrag = (e) => {
        this.pos.x = this.pos.cursorX - e.clientX;
        this.pos.y = this.pos.cursorY - e.clientY;
        this.pos.cursorX = e.clientX;
        this.pos.cursorY = e.clientY;
        let posY = this.draggableContainer.offsetTop - this.pos.y;
        let posX = this.draggableContainer.offsetLeft - this.pos.x;
        // Check if new positions is off limits
        if (!this.offLimits(posY, posY + this.draggableContainer.offsetHeight,
            posX, posX + this.draggableContainer.offsetWidth)) {
            // Move container
            this.draggableContainer.style.top = posY + "px";
            this.draggableContainer.style.left = posX + "px";
        }
    }
    this.dragMouseDown = (e) => {
        // Save cursor position X
        this.pos.cursorX = e.clientX;
        // Save cursor position Y
        this.pos.cursorY = e.clientY;
        // On mouse up, remove all listeners on drag
        document.onmouseup = this.closeDragElement;
        // On mouse move, move the container along with the cursor
        document.onmousemove = this.elementDrag;
    }
    this.draggableArea.onmousedown = this.dragMouseDown;
}