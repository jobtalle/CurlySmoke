import {gl} from "../gl.js";
import {Buffer} from "../buffers/buffer.js";

export class UniformBlock extends Buffer {
    bytes;

    /**
     * Construct a uniform block
     * @param {number} size The number of bytes required
     * @param {number} index The binding index
     * @param {GLenum} [usage] The buffer usage
     */
    constructor(size, index, usage = gl.DYNAMIC_DRAW) {
        super(gl.UNIFORM_BUFFER, usage, ((size + 0xF) >> 4) << 4);

        this.bytes = new ArrayBuffer(size);

        gl.bindBufferBase(gl.UNIFORM_BUFFER, index, this.buffer);
    }

    /**
     * Upload the data in this uniform block
     */
    upload() {
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.bytes);
    }
}