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
            // Bring element to the front on creation (without clicking it)
            this.containers[i].style.zIndex = this.zIndex + 10;
            // Create mouse down for the container to switch z-index with other draggable elements
            this.containers[i].onmousedown = (e) => {
                this.zIndexSwitch(this.containers[i]);
            }
            // Create touch start for the container to switch z-index with other draggable elements
            this.containers[i].ontouchstart = (e) => {
                this.zIndexSwitch(this.containers[i]);
            }
            // For the element which you move container from
            this.pointers[i].onmousedown = (e) => {
                this.dragDown(this.containers[i], this.pointers[i], e);
            }
            this.pointers[i].ontouchstart = (e) => {
                this.dragDown(this.containers[i], this.pointers[i], e);
            }
        }
        /*
         * / * RESET COORDINATES ON PAGE RESIZE * / *
         *
         * This avoids container to stay half outside of outside the inner window limits.
         */
        window.onresize = () => {
            for (let i = 0; i < this.containers.length; i++) {
                let c = this.containers[i];
                if (this.offLimits(c)) {
                    c.style.top = '15px';
                    c.style.left = '15px';
                }
            }
        }
    }

    zIndexSwitch = (c) => {
        for (let j = 0; j < this.pointers.length; j++) {
            // Leave those that are not being clicked behind
            this.containers[j].style.zIndex = this.zIndex;
        }
        // Bring it to the front when clicking on element
        c.style.zIndex = this.zIndex + 10;
    }

    /**
     * ********************************* *
     * *** Settings to drag and drop *** *
     * ********************************* *
     */
    dragDown = (c, p, e) => {
        // If touch screen
        if (e.changedTouches) {
            e.clientX = e.changedTouches[0].clientX;
            e.clientY = e.changedTouches[0].clientY;
        }
        // Save cursor position for mouse
        this.pos.cursorX = e.clientX;
        this.pos.cursorY = e.clientY;
        // Active drag on mouse down
        // On mouse move, move the container along with the cursor
        p.onmousemove = (e) => {
            this.elementDrag(c, p, e);
        }
        p.ontouchmove = (e) => {
            this.elementDrag(c, p, e);
        }
        // On mouse up, listeners on drag
        p.onmouseup = (e) => {
            this.removeListeners(c, p, e);
        }
        p.ontouchend = (e) => {
            this.removeListeners(c, p, e);
        }
    }

    /**
     * **************************** *
     * *** Move element on drag *** *
     * **************************** *
     */
    elementDrag = (c, p, e) => {
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
        let posY = c.offsetTop - this.pos.y;
        let posX = c.offsetLeft - this.pos.x;
        // Move container
        c.style.top = posY + "px";
        c.style.left = posX + "px";
    }

    removeListeners = (c, p, e) => {
        p.onmousemove = null;
        p.ontouchmove = null;
    }

    /**
     * *************************** *
     * *** Check offset limits *** *
     * *************************** *
     *
     * This avoids the container from going outside the window
     */
    offLimits = (c) => {
        return c.offsetTop - this.pos.y > window.innerHeight
            || c.offsetLeft - this.pos.y > window.innerWidth;
    }
}