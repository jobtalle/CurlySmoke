import {UniformBlock} from "./uniformBlock.js";

export class UniformBlockGlobals extends UniformBlock {
    static BINDING = 0;
    static NAME = "Globals";

    #floats;

    constructor() {
        super(34 << 2, UniformBlockGlobals.BINDING);

        this.#floats = new Float32Array(this.bytes);
    }

    setVP(vp) {
        this.#floats.set(vp.buffer);
    }

    setProjection(projection) {
        this.#floats.set(projection.buffer, 16);
    }

    setViewport(width, height) {
        this.#floats[32] = width;
        this.#floats[33] = height;
    }
}


// language=GLSL
export const glslGlobals = `
layout(std140) uniform ${UniformBlockGlobals.NAME} {
    mat4 vp;
    mat4 projection;
    vec2 viewport;
};
`;