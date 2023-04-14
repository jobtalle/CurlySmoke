import {Renderable} from "./renderable.js";
import {Buffer} from "../gl/buffers/buffer.js";
import {gl} from "../gl/gl.js";
import {Shaders} from "../gl/shaders/shaders.js";

export class RenderableSmoke extends Renderable {
    static CAPACITY = 512;

    static #STRIDE = 3;

    #staging = new Float32Array(RenderableSmoke.CAPACITY * RenderableSmoke.#STRIDE << 2);
    #vertices = new Buffer(gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW, RenderableSmoke.CAPACITY * RenderableSmoke.#STRIDE << 2);
    #count = 0;

    constructor() {
        super();

        this.bind();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertices.buffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    }

    stream(particles, time) {
        if ((this.#count = particles.length) === 0)
            return;

        for (let particle = 0; particle < this.#count; ++particle) {
            const offset = RenderableSmoke.#STRIDE * particle;

            this.#staging[offset] = particles[particle].position.x + particles[particle].velocity.x * time;
            this.#staging[offset + 1] = particles[particle].position.y + particles[particle].velocity.y * time;
            this.#staging[offset + 2] = particles[particle].position.z + particles[particle].velocity.z * time;
        }

        this.#vertices.upload(this.#staging, this.#count * RenderableSmoke.#STRIDE << 2)
    }

    render() {
        super.render();

        Shaders.SMOKE.use();

        gl.drawArrays(gl.POINTS, 0, this.#count);
    }
}