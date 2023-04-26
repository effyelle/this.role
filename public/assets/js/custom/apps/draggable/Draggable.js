class Draggable {
    constructor(options = {}) {
        this.draggableContainer = document.querySelector(options.container);
        this.draggableArea = document.querySelector(options.pointer);
        this.pos = {};
        this.draggableArea.onmousedown = this.dragMouseDown;
    }

    offLimits = (top, bottom, left, right) => {
        return top < 0 || bottom > window.innerHeight
            || left < 0 || right > window.innerWidth;
    }
    closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    elementDrag = (e) => {
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
    dragMouseDown = (e) => {
        // Save cursor position X
        this.pos.cursorX = e.clientX;
        // Save cursor position Y
        this.pos.cursorY = e.clientY;
        // On mouse up, remove all listeners on drag
        document.onmouseup = this.closeDragElement;
        // On mouse move, move the container along with the cursor
        document.onmousemove = this.elementDrag;
    }
}