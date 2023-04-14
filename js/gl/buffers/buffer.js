import {gl} from "../gl.js";

export class Buffer {
    #usage;

    buffer = gl.createBuffer();
    type;
    capacity;

    constructor(type, usage, initial) {
        this.#usage = usage;

        this.type = type;

        gl.bindBuffer(type, this.buffer);

        if (typeof initial === "number")
            gl.bufferData(type, this.capacity = initial, usage);
        else
            gl.bufferData(type, initial, usage);
    }

    upload(data) {
        gl.bindBuffer(this.type, this.buffer);
        gl.bufferSubData(this.type, 0, data);
    }
}