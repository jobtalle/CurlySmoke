import {Renderable} from "./renderable.js";
import {Buffer} from "../gl/buffers/buffer.js";
import {gl} from "../gl/gl.js";
import {Shaders} from "../gl/shaders/shaders.js";

export class RenderableGrid extends Renderable {
    static #RADIUS = 4;
    static #SPACING = 1;
    static #LINE_COUNT = (RenderableGrid.#RADIUS * 2 + 1) << 1;

    #vertices = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW, RenderableGrid.#LINE_COUNT * 24);

    constructor() {
        super();

        const points = [];

        for (let x = -RenderableGrid.#RADIUS; x <= RenderableGrid.#RADIUS; x += RenderableGrid.#SPACING) {
            points.push(
                x, 0, -RenderableGrid.#RADIUS,
                x, 0, RenderableGrid.#RADIUS,
                -RenderableGrid.#RADIUS, 0, x,
                RenderableGrid.#RADIUS, 0, x);
        }

        this.#vertices.upload(new Float32Array(points));

        this.bind();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertices.buffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    }

    render() {
        super.render();

        Shaders.GRID.use();

        gl.drawArrays(gl.LINES, 0, RenderableGrid.#LINE_COUNT << 1);
    }
}