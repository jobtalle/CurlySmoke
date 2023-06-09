import {Vector2} from "./math/vector2.js";
import {Vector3} from "./math/vector3.js";
import {Camera} from "./camera.js";

export class CameraController {
    #camera;
    #sensitivity;
    #down = false;
    #anchor = new Vector2();
    #from = new Vector3();
    #pivot = new Vector3();
    #direction = new Vector3();
    #angle = Math.PI * .25;
    #pitch = Math.PI * .125;
    #zoom;
    #updated = false;

    /**
     * Construct a camera controller
     * @param {Camera} camera The camera to control
     * @param {number} [zoom] The initial zoom level
     * @param {number} [sensitivity] The mouse sensitivity
     */
    constructor(camera, zoom = 2, sensitivity = 4) {
        this.#camera = camera;
        this.#sensitivity = sensitivity;
        this.#zoom = zoom;

        this.moved();
    }

    /**
     * Get the eye position
     * @returns {Vector3} The eye position
     */
    get eye() {
        return this.#from;
    }

    /**
     * Get the viewing direction
     * @returns {Vector3} The viewing direction
     */
    get direction() {
        return this.#direction;
    }

    /**
     * Update before rendering
     * @returns {boolean} True if the camera updated
     */
    render() {
        const updated = this.#updated;

        this.#updated = false;

        return updated;
    }

    /**
     * Set the pivot
     * @param {Vector3} vector The pivot vector
     */
    setPivot(vector) {
        this.#pivot.set(vector);

        this.moved();
    }

    /**
     * Press the mouse
     * @param {number} x The X coordinate in the range [0, 1]
     * @param {number} y The Y coordinate in the range [0, 1]
     */
    mouseDown(x, y) {
        this.#down = true;
        this.#anchor.x = x;
        this.#anchor.y = y;
    }

    /**
     * Move the mouse
     * @param {number} x The X coordinate in the range [0, 1]
     * @param {number} y The Y coordinate in the range [0, 1]
     */
    mouseMove(x, y) {
        if (!this.#down)
            return;

        const dx = x - this.#anchor.x;
        const dy = y - this.#anchor.y;

        this.#angle -= dx * this.#sensitivity;
        this.#pitch = Math.min(Math.PI * .35, Math.max(Math.PI * -.35, this.#pitch + dy * this.#sensitivity));

        this.#anchor.x = x;
        this.#anchor.y = y;

        this.moved();
    }

    /**
     * Release the mouse
     */
    mouseUp() {
        this.#down = false;
    }

    /**
     * Scroll up
     */
    scrollUp() {
        this.#zoom = Math.max(.5, this.#zoom * .9);

        this.moved();
    }

    /**
     * Scroll down
     */
    scrollDown() {
        this.#zoom = Math.min(20, this.#zoom * 1.1);

        this.moved();
    }

    /**
     * The perspective has moved
     */
    moved() {
        this.#from.x = this.#pivot.x + Math.cos(this.#angle) * Math.cos(this.#pitch) * this.#zoom;
        this.#from.y = this.#pivot.y + Math.sin(this.#pitch) * this.#zoom;
        this.#from.z = this.#pivot.z + Math.sin(this.#angle) * Math.cos(this.#pitch) * this.#zoom;
        this.#direction.set(this.#pivot).subtract(this.#from).normalize();
        this.#direction.setCoordinates(0, -1, 0).normalize();

        this.#camera.view.lookAt(this.#from, this.#pivot, Vector3.UP);

        this.#updated = true;
    }
}