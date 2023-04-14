import {Color} from "./color.js";
import {gl, glCanvas} from "./gl/gl.js";
import {Camera} from "./camera.js";
import {UniformBlocks} from "./gl/uniforms/uniformBlocks.js";
import {CameraController} from "./cameraController.js";
import {RenderableGrid} from "./renderable/renderableGrid.js";
import {Vector2} from "./math/vector2.js";
import {RenderableSmoke} from "./renderable/renderableSmoke.js";
import {SmokeParticles} from "./smokeParticles.js";

export class Smoke {
    static #CLEAR_COLOR = new Color("#2d5b79");

    #camera = new Camera(new Vector2(0, .5));
    #cameraController = new CameraController(this.#camera);
    #grid = new RenderableGrid();
    #smoke = new RenderableSmoke();
    #smokeParticles = new SmokeParticles(this.#smoke);

    constructor() {
        this.#addListeners();

        this.#camera.updateProjection(glCanvas.width / glCanvas.height);

        UniformBlocks.GLOBALS.setViewport(glCanvas.width, glCanvas.height);
        UniformBlocks.GLOBALS.setProjection(this.#camera.projection);

        gl.clearColor(Smoke.#CLEAR_COLOR.r, Smoke.#CLEAR_COLOR.g, Smoke.#CLEAR_COLOR.b, 1);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendEquation(gl.FUNC_ADD);
        gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    }

    #addListeners() {
        glCanvas.addEventListener("mousedown", event => {
            this.#cameraController.mouseDown(
                event.clientX / glCanvas.clientHeight,
                event.clientY / glCanvas.clientHeight);
        });

        glCanvas.addEventListener("mousemove", event => {
            this.#cameraController.mouseMove(
                event.clientX / glCanvas.clientHeight,
                event.clientY / glCanvas.clientHeight);
        });

        glCanvas.addEventListener("mouseup", () => {
            this.#cameraController.mouseUp();
        });

        glCanvas.addEventListener("wheel", event => {
            if (event.deltaY > 0)
                this.#cameraController.scrollDown();
            else if (event.deltaY < 0)
                this.#cameraController.scrollUp();
        }, {
            passive: true
        });
    }

    update() {
        this.#smokeParticles.update();
    }

    render(time) {
        if (this.#cameraController.render()) {
            this.#camera.updateVP();

            UniformBlocks.GLOBALS.setVP(this.#camera.vp);
            UniformBlocks.GLOBALS.upload();
        }

        this.#smokeParticles.stream(time);

        gl.clear(gl.COLOR_BUFFER_BIT);

        this.#grid.render();

        gl.enable(gl.BLEND);

        this.#smoke.render();

        gl.disable(gl.BLEND);
    }
}