import {UniformBlock} from "./uniformBlock.js";

export class UniformBlockGlobals extends UniformBlock {
    static BINDING = 0;
    static NAME = "Globals";

    #floats;

    /**
     * Construct the global variables
     */
    constructor() {
        super(16 << 2, UniformBlockGlobals.BINDING);

        this.#floats = new Float32Array(this.bytes);
    }

    /**
     * Set the VP matrix
     * @param {Matrix4} vp The VP matrix
     */
    setVP(vp) {
        this.#floats.set(vp.buffer);
    }
}


// language=GLSL
export const glslGlobals = `
layout(std140) uniform ${UniformBlockGlobals.NAME} {
    mat4 vp;
};
`;