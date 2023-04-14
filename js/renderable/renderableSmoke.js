import {Renderable} from "./renderable.js";
import {Buffer} from "../gl/buffers/buffer.js";
import {gl} from "../gl/gl.js";
import {Shaders} from "../gl/shaders/shaders.js";

export class RenderableSmoke extends Renderable {
    static CAPACITY = 512;

    static #STRIDE = 10;

    #staging = new Float32Array(RenderableSmoke.CAPACITY * RenderableSmoke.#STRIDE << 2);
    #vertices = new Buffer(gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW, RenderableSmoke.CAPACITY * RenderableSmoke.#STRIDE << 2);
    #count = 0;

    constructor() {
        super();

        this.bind();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertices.buffer);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 40, 0);

        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 40, 12);

        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 40, 16);

        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 40, 20);

        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.FLOAT, false, 40, 36);
    }

    stream(particles, time) {
        if ((this.#count = particles.length) === 0)
            return;

        for (let particle = 0; particle < this.#count; ++particle) {
            const offset = RenderableSmoke.#STRIDE * particle;

            this.#staging[offset] = particles[particle].position.x + particles[particle].velocity.x * time;
            this.#staging[offset + 1] = particles[particle].position.y + particles[particle].velocity.y * time;
            this.#staging[offset + 2] = particles[particle].position.z + particles[particle].velocity.z * time;
            this.#staging[offset + 3] = particles[particle].life - particles[particle].decay * time;
            this.#staging[offset + 4] = particles[particle].scale;
            this.#staging[offset + 5] = particles[particle].noiseOffsetDirection.x;
            this.#staging[offset + 6] = particles[particle].noiseOffsetDirection.y;
            this.#staging[offset + 7] = particles[particle].noiseOffsetDirection.z;
            this.#staging[offset + 8] = particles[particle].noiseOffset;
            this.#staging[offset + 9] = particles[particle].rotation;
        }

        this.#vertices.upload(this.#staging, this.#count * RenderableSmoke.#STRIDE << 2)
    }

    render() {
        super.render();

        Shaders.SMOKE.use();

        gl.drawArrays(gl.POINTS, 0, this.#count);
    }
}