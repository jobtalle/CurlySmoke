import {gl} from "../gl/gl.js";

export class Renderable {
    vao = gl.createVertexArray();

    bind() {
        gl.bindVertexArray(this.vao);
    }

    render() {
        this.bind();
    }
}