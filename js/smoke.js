import {Color} from "./color.js";
import {gl} from "./gl/gl.js";
import {Camera} from "./camera.js";
import {UniformBlocks} from "./gl/uniformBlocks.js";
import {CameraController} from "./cameraController.js";

export class Smoke {
    static #CLEAR_COLOR = new Color("#74a7b6");

    #camera = new Camera();
    #cameraController = new CameraController(this.#camera);

    constructor() {
        gl.clearColor(Smoke.#CLEAR_COLOR.r, Smoke.#CLEAR_COLOR.g, Smoke.#CLEAR_COLOR.b, 1);
    }

    update() {

    }

    render(time) {
        UniformBlocks.GLOBALS.setVP(this.#camera.vp);
        UniformBlocks.GLOBALS.upload();

        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}