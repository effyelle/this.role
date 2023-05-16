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
     * @param c (string) -Container to be moved
     * @param p (string) -Element that triggers the movement
     * @param opt (object) -You can set zIndex so that it fits your DOM
     *
     * - opt.zIndex (string) -> Sets a zIndex to work with
     * - opt.open (string) -> Sets openers (HTML Objects) to click and show the draggable
     * - ope.close (string) -> Sets closers (HTML Objects) to click and hide the draggable
     *
     * Add any other settings you might need in options and use them freely.
     *
     * If trigger element is not given, container itself will be the trigger
     */
    constructor(c, p, opt = {}) {
        this.error = 1;
        if (!p) p = c;
        this.containers = document.querySelectorAll(c);
        this.pointers = document.querySelectorAll(p);
        this.zIndex = 2015;
        if (opt.zIndex) this.zIndex = opt.zIndex;
        this.openers = null;
        if (opt.open) this.openers = document.querySelectorAll(opt.open);
        this.closers = null;
        if (opt.close) this.closers = document.querySelectorAll(opt.close);
        this.pos = {};
        if (this.pointers.length > 0 && this.pointers.length === this.containers.length) {
            this.buildDraggable();
            return;
        }
        this.error = 0;
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
            if (this.openers && this.openers.length === this.pointers.length) {
                this.openers[i].onclick = (e) => {
                    this.toggleTransition(this.containers[i], 'open');
                }
                this.openers[i].ontouchend = (e) => {
                    this.toggleTransition(this.containers[i], 'open');
                }
            }
            if (this.closers && this.closers.length === this.pointers.length) {
                this.closers[i].onclick = (e) => {
                    this.toggleTransition(this.containers[i], 'close');
                }
                this.closers[i].ontouchend = (e) => {
                    this.toggleTransition(this.containers[i], 'close');
                }
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

    toggleTransition = (c, mode) => {
        c.style.transition = 'all 0.5s ease';
        switch (mode) {
            case 'open':
                c.style.top = '1.5rem';
                break;
            case 'close':
                c.style.top = '100vh';
                break;
        }
        setTimeout(function () {
            c.style.transition = 'none';
        }, 500);
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