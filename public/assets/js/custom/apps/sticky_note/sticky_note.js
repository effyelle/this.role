/**
 * Function to give sticky note HTML form and CSS classes.
 *
 * @returns {string}
 */
let formatStickyNote = (title) => {
    return '' +
        '<div class="card sticky-note__container" id="sticky-note__container">' +
        '   <!--begin::StickyNote Header-->' +
        '   <div class="cursor-grab bg-white card-header d-flex flex-row justify-content-between">' +
        '       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"' +
        '           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
        '           class="feather feather-book icon-16">' +
        '           <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>' +
        '           <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>' +
        '       </svg>' +
        '       <label for="sticky-note">&nbsp; ' + title + '</label>' +
        '       <div class="bg-move"></div>' +
        '   </div>' +
        '   <!--end::StickyNote Header-->' +
        '   <!--begin::StickyNote Body-->' +
        '   <div class="sticky-note__textarea-container">' +
        '       <textarea name="note" cols="40" rows="10" id="sticky-note__textarea" class="sticky-note__textarea"' +
        '           style="height:326px" placeholder="Escribe notas... y muéveme por la pantalla!"></textarea>' +
        '   </div>' +
        '   <!--end::StickyNote Body-->' +
        '</div>'
}

function setStickyNote(id, title) {
    // Load note HTML
    const stickyContainer = document.getElementById(id);
    stickyContainer.classList.add('sticky-note');
    stickyContainer.innerHTML = formatStickyNote(title);
    // Save variables
    const stickyNote = document.getElementById('sticky-note__container');
    const stickyTextarea = document.getElementById('sticky-note__textarea');
    const moveArea = document.querySelector('.cursor-grab');
    const defaultPadding = 50;
    const headerTop = 70;

    const stickyContainerPos = { // this is the reference for top and left for our stickyContainer.style.top and style.left
        top: stickyContainer.getBoundingClientRect().top,
        left: stickyContainer.getBoundingClientRect().left
    };
    const noteAbsolutePos = function (top, left) {
        return {
            top: top + stickyContainerPos.top,
            left: left + stickyContainerPos.left,
            bottom: top + stickyContainerPos.top + stickyNote.offsetHeight * 2 + stickyTextarea.offsetHeight,
            right: left + stickyContainerPos.left + stickyNote.offsetWidth + defaultPadding
        }
    }

    const offLimits = function (top, left) {
        const stickyNoteAbsolutePos = noteAbsolutePos(top, left);
        return !(stickyNoteAbsolutePos.bottom < window.innerHeight
            && stickyNoteAbsolutePos.right < window.innerWidth
            && stickyNoteAbsolutePos.left > defaultPadding && stickyNoteAbsolutePos.top > headerTop);
    }

    // Coordinates offsets

    function decodeStickyNote(data) {
        try {
            let json = JSON.parse(data);
            stickyTextarea.value = json.text;
            let top = json.coords.top;
            let left = json.coords.left;
            const stickyNoteAbsolutePos = noteAbsolutePos(top, left);
            if (stickyNoteAbsolutePos.bottom > window.innerHeight) top = window.innerHeight - stickyNoteAbsolutePos.top - stickyNote.offsetHeight - defaultPadding;
            if (stickyNoteAbsolutePos.right > window.innerWidth) left = window.innerWidth - stickyContainerPos.left - stickyNote.offsetWidth - defaultPadding;
            stickyNote.style.top = top + 'px';
            stickyNote.style.left = left + 'px';
        } catch (e) {
            console.log("❌ ", e);
        }
    }

    function codeStickyNote() {
        return JSON.stringify({
            text: stickyTextarea.value,
            coords: {
                top: stickyNote.offsetTop,
                left: stickyNote.offsetLeft
            }
        });
    }

    /**
     * Function to load sticky note text
     */
    function loadStickyNote() {
        fetch('/app/load_sticky_note').then(r => r.json())
            .then((data) => {
                if (!data['error']) {
                    decodeStickyNote(data['result']);
                    return;
                }
                console.log("❌ ", data['msg']);
            }).catch((e) => {
            console.log("Error: ", e);
        });
    }

    /**
     * Function to save stiky note text
     */
    function saveStickyNote() {
        const data = codeStickyNote();
        let formData = new FormData();
        formData.append('sticky_note', data);
        fetch('/app/save_sticky_note', {
            method: "post", body: formData
        }).then(r => r.json())
            .then((data) => {
                if (data['error']) console.log("❌ ", data['msg']);
            }).catch((e) => {
            console.log("Error: ", e);
        });
    }

    // Load sticky note data
    loadStickyNote();

    // Save changes when note loses focus
    stickyTextarea.addEventListener('change', saveStickyNote);

    // Make note draggable from the top right corner
    dragElement(stickyNote);

    function dragElement(el) {
        const pos = {};
        moveArea.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            // get the mouse cursor position at startup:
            pos.cx = e.clientX;
            pos.cy = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            moveArea.classList.add('cursor-grabbing');
            // calculate the new cursor position:
            pos.x = pos.cx - e.clientX;
            pos.y = pos.cy - e.clientY;
            pos.cx = e.clientX;
            pos.cy = e.clientY;
            // set the element's new position:
            let posY = el.offsetTop - pos.y;
            let posX = el.offsetLeft - pos.x;
            console.log(posY + ", " + posX);
            console.log(offLimits(posY, posX));
            if (!offLimits(posY, posX)) {
                el.style.top = posY + "px";
                el.style.left = posX + "px";
            }
        }

        function closeDragElement() {
            moveArea.classList.remove('cursor-grabbing');
            // stop moving when mouse button is released:
            saveStickyNote();
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}