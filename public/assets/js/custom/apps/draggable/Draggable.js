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
        console.log(this.containers)
        console.log(this.pointers)
        this.zIndex = 2015;
        if (options.zIndex) this.zIndex = options.zIndex;
        this.pos = {};
        this.buildDraggable();
    }

    /**
     * ********************** *
     * *** Init listeners *** *
     * ********************** *
     *
     */
    buildDraggable = () => {
        // Bring it to the front
        for (let i = 0; i < this.pointers.length; i++) {
            // Bring element to the front on creation (without clicking it)
            this.containers[i].style.zIndex = this.zIndex + 10;
            // Delete mousedown
            this.pointers[i].onmousedown = null;
            // Create mouse down for the container
            this.containers[i].onmousedown = () => {
                for (let j = 0; j < this.pointers.length; j++) {
                    // Leave those that are not being clicked behind
                    this.containers[j].style.zIndex = this.zIndex;
                }
                // Bring it to the front when clicking on element
                this.containers[i].style.zIndex = this.zIndex + 10;
            }
            // Create mousedown for the element which you move container from
            this.pointers[i].onmousedown = (e) => {
                // Save cursor position X
                this.pos.cursorX = e.clientX;
                // Save cursor position Y
                this.pos.cursorY = e.clientY;
                // Active drag on mouse down
                this.dragMouseDown(this.containers[i], this.pointers[i]);
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
                c.style.top = '15px';
                c.style.left = '15px';
                c.style.maxWidth = '90%';
                c.style.maxHeight = '90vh';
            }
        }
    }
    /**
     * *************************** *
     * *** Check offset limits *** *
     * *************************** *
     *
     * This avoids the container from going outside the window
     */
    offLimits = (top, bottom, left, right) => {
        return top < 0 || bottom > window.innerHeight
            || left < 0 || right > window.innerWidth;
    }
    /**
     * **************************** *
     * *** Move element on drag *** *
     * **************************** *
     */
    elementDrag = (c) => {
        let posY = c.offsetTop - this.pos.y;
        let posX = c.offsetLeft - this.pos.x;
        // Check if new positions is off limits
        if (!this.offLimits(posY, posY + c.offsetHeight,
            posX, posX + c.offsetWidth)) {
            // Move container
            c.style.top = posY + "px";
            c.style.left = posX + "px";
        }
    }
    /**
     * ********************************* *
     * *** Settings to drag and drop *** *
     * ********************************* *
     */
    dragMouseDown = (c, p) => {
        // On mouse move, move the container along with the cursor
        p.onmousemove = (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            // Save coords
            this.pos.x = this.pos.cursorX - e.clientX;
            this.pos.y = this.pos.cursorY - e.clientY;
            this.pos.cursorX = e.clientX;
            this.pos.cursorY = e.clientY;
            this.elementDrag(c);
        }
        // On mouse up, listeners on drag
        p.onmouseup = () => {
            p.onmousemove = null;
            p.onmouseup = null; // Remove itself for laters usages
        }
    }
}