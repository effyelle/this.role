/**
 * @autor Erica Pastor
 *
 * Draggable makes items draggable around the DOM.
 */
class Draggable {
    /**
     * ******************* *
     * *** Constructor *** *
     * ******************* *
     *
     * Receive two class identificators to init events for a NodeList of HTML elements.
     * Must receive it in the querySelectorAll format.
     *
     * @param c -Container to be moved
     * @param p -Element that triggers the movement
     * @param options -You can set zIndex so that it fits your DOM.
     *
     * Add any other settings you might need in options and use them freely.
     *
     * If trigger element is not given, container itself will be the trigger
     */
    constructor(c, p, options = {}) {
        if (!p) p = c;
        this.containers = document.querySelectorAll(c);
        this.pointers = document.querySelectorAll(p);
        this.zIndex = 2015;
        if (options.zIndex) this.zIndex = options.zIndex;
        this.pos = {};
        this.buildDraggable();
    }

    /**
     * ********************** *
     * *** Init listeners *** *
     * ********************** *
     */
    buildDraggable = () => {
        // Bring it to the front
        for (let i = 0; i < this.pointers.length; i++) {
            this.container = this.containers[i];
            this.pointer = this.pointers[i];
            // Bring element to the front on creation (without clicking it)
            this.container.style.zIndex = this.zIndex + 10;
            // Set it resizable
            this.container.style.resize = 'both';
            this.container.style.overflowX = 'hidden';
            this.container.style.overflowY = 'auto';
            // Create mouse down for the container to switch z-index with other draggable elements
            this.container.onmousedown = this.zIndexSwitch;
            this.container.ontouchstart = this.zIndexSwitch;
            // For the element which you move container from
            this.pointer.onmousedown = this.dragDown;
            this.pointer.ontouchstart = this.dragDown;
        }
        /*
         * / * RESET COORDINATES ON PAGE RESIZE * / *
         *
         * This avoids container to stay half outside of outside the inner window limits.
         */
        window.onresize = () => {
            for (let i = 0; i < this.containers.length; i++) {
                if (this.offLimits()) {
                    this.container.style.top = '15px';
                    this.container.style.left = '15px';
                }
            }
        }
    }

    zIndexSwitch = () => {
        for (let j = 0; j < this.pointers.length; j++) {
            // Leave those that are not being clicked behind
            this.containers[j].style.zIndex = this.zIndex;
        }
        // Bring it to the front when clicking on element
        this.container.style.zIndex = this.zIndex + 10;
    }

    /**
     * ********************************* *
     * *** Settings to drag and drop *** *
     * ********************************* *
     */
    dragDown = (e) => {
        // If touch screen
        if (e.touches) {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }
        // Save cursor position for mouse
        this.pos.cursorX = e.clientX;
        this.pos.cursorY = e.clientY;
        // Active drag on mouse down
        // On mouse move, move the container along with the cursor
        this.pointer.onmousemove = this.elementDrag;
        this.pointer.ontouchmove = this.elementDrag;
        // On mouse up, listeners on drag
        this.pointer.onmouseup = this.removeListeners;
        this.pointer.ontouchend = this.removeListeners;
    }

    /**
     * **************************** *
     * *** Move element on drag *** *
     * **************************** *
     */
    elementDrag = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        // If touch screen
        if (e.touches) {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }
        // Save coords
        this.pos.x = this.pos.cursorX - e.clientX;
        this.pos.y = this.pos.cursorY - e.clientY;
        this.pos.cursorX = e.clientX;
        this.pos.cursorY = e.clientY;
        let posY = this.container.offsetTop - this.pos.y;
        let posX = this.container.offsetLeft - this.pos.x;
        // Move container
        this.container.style.top = posY + "px";
        this.container.style.left = posX + "px";
    }

    removeListeners = () => {
        this.pointer.onmousemove = null;
        this.pointer.ontouchmove = null;
    }

    /**
     * *************************** *
     * *** Check offset limits *** *
     * *************************** *
     *
     * This avoids the container from going outside the window
     */
    offLimits = () => {
        return this.container.offsetTop - this.pos.y > window.innerHeight
            || this.container.offsetLeft - this.pos.y > window.innerWidth;
    }
}