import {gl} from "./gl.js";

export class Buffer {
    #usage;

    buffer = gl.createBuffer();
    type;
    capacity;

    /**
     * Construct a buffer
     * @param {GLenum} type A buffer type
     * @param {GLenum} usage The buffer usage type
     * @param {ArrayBuffer | number} initial Initial capacity, or an array buffer to upload
     */
    constructor(type, usage, initial) {
        this.#usage = usage;

        this.type = type;

        gl.bindBuffer(type, this.buffer);

        if (typeof initial === "number")
            gl.bufferData(type, this.capacity = initial, usage);
        else
            gl.bufferData(type, initial, usage);
    }
}