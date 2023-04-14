import {Color} from "./color.js";
import {gl} from "./gl/gl.js";

export class Smoke {
    static #CLEAR_COLOR = new Color("#74a7b6");

    constructor() {
        gl.clearColor(Smoke.#CLEAR_COLOR.r, Smoke.#CLEAR_COLOR.g, Smoke.#CLEAR_COLOR.b, 1);
    }

    update() {

    }

    render(time) {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}