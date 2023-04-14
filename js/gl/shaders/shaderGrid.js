import {Shader} from "./shader.js";
import {gl} from "../gl.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";

export class ShaderGrid extends Shader {
    // language=GLSL
    static #SHADER_VERTEX = glslGlobals + `
        layout(location = 0) in vec3 position;
        
        void main() {
            gl_Position = vp * vec4(position, 1.);
        }
        `;

    // language=GLSL
    static #SHADER_FRAGMENT = `
        uniform vec3 color;
        
        out vec4 colorOut;
        
        void main() {
            colorOut = vec4(color, 1.);
        }
        `;

    /**
     * Construct a grid shader
     * @param {Color} color The grid color
     */
    constructor(color) {
        super(ShaderGrid.#SHADER_VERTEX, ShaderGrid.#SHADER_FRAGMENT);

        this.use();

        gl.uniform3f(this.uniformLocation("color"), color.r, color.g, color.b);

        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}