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
     */
    buildDraggable = () => {
        // Bring it to the front
        for (let i = 0; i < this.pointers.length; i++) {
            // Bring element to the front on creation (without clicking it)
            this.containers[i].style.zIndex = this.zIndex + 10;
            // Set it resizable
            this.containers[i].style.resize = 'both';
            this.containers[i].style.overflowX = 'hidden';
            this.containers[i].style.overflowY = 'auto';
            // Delete mousedown
            this.pointers[i].onmousedown = null;
            // Create mouse down for the container
            ['mousedown', 'touchstart'].forEach(evt => {
                this.containers[i].addEventListener(evt, (e) => {
                    for (let j = 0; j < this.pointers.length; j++) {
                        // Leave those that are not being clicked behind
                        this.containers[j].style.zIndex = this.zIndex;
                    }
                    // Bring it to the front when clicking on element
                    this.containers[i].style.zIndex = this.zIndex + 10;
                });
                // For the element which you move container from
                this.pointers[i].addEventListener(evt, (e) => {
                    // Save cursor position X
                    this.pos.cursorX = e.clientX;
                    // Save cursor position Y
                    this.pos.cursorY = e.clientY;
                    // Active drag on mouse down
                    this.dragDown(this.containers[i], this.pointers[i]);
                });
            });
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

    /**
     * **************************** *
     * *** Move element on drag *** *
     * **************************** *
     */
    elementDrag = (c) => {
        let posY = c.offsetTop - this.pos.y;
        let posX = c.offsetLeft - this.pos.x;
        // Move container
        c.style.top = posY + "px";
        c.style.left = posX + "px";
    }


    /**
     * ********************************* *
     * *** Settings to drag and drop *** *
     * ********************************* *
     */
    dragDown = (c, p) => {
        // On mouse move, move the container along with the cursor
        ['mousemove', 'touchmove'].forEach(evt => {
            p.addEventListener(evt, (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                // Save coords
                this.pos.x = this.pos.cursorX - e.clientX;
                this.pos.y = this.pos.cursorY - e.clientY;
                this.pos.cursorX = e.clientX;
                this.pos.cursorY = e.clientY;
                this.elementDrag(c);
            });
        });
        // On mouse up, listeners on drag
        ['mouseup', 'touchup'].forEach(evt => {
            p.addEventListener(evt, () => {
                ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchup'].forEach(evt => {
                    p.removeEventListener(evt,);
                });
            });
        });
    }
}