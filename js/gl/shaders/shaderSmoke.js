import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";

export class ShaderSmoke extends Shader {
    static #SHADER_VERTEX = glslGlobals + `
        layout(location = 0) in vec3 position;
        
        void main() {
            gl_Position = vp * vec4(position, 1.);
            gl_PointSize = viewport.y * .2 * projection[1][1] / gl_Position.w;
        }
        `;

    static #SHADER_FRAGMENT = `
        out vec4 color;
        
        void main() {
            color = vec4(1., 0., 0., 1.);
        }
        `;

    constructor() {
        super(ShaderSmoke.#SHADER_VERTEX, ShaderSmoke.#SHADER_FRAGMENT);

        this.use();

        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}