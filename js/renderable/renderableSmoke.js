import {Renderable} from "./renderable.js";
import {Buffer} from "../gl/buffers/buffer.js";
import {gl} from "../gl/gl.js";
import {Shaders} from "../gl/shaders/shaders.js";

export class RenderableSmoke extends Renderable {
    static CAPACITY = 512;

    #vertices = new Buffer(gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW, RenderableSmoke.CAPACITY * 3 << 2);
    #count = 0;

    constructor() {
        super();

        this.bind();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertices.buffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    }

    render() {
        super.render();

        Shaders.SMOKE.use();

        gl.drawArrays(gl.POINTS, 0, this.#count);
    }
}