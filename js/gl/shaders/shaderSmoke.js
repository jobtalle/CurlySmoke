import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";

export class ShaderSmoke extends Shader {
    // language=GLSL
    static #SHADER_NOISE = `
        float hash(float n) {
            return fract(sin(n) * 43758.5453);
        }
        
        float noise(vec3 x) {
            vec3 p = floor(x);
            vec3 f = fract(x);
        
            f = f * f * (3. - 2. * f);
            
            float n = p.x + p.y * 57. + 113. * p.z;
            
            return mix(mix(mix(hash(n + 0.), hash(n + 1.),f.x), 
                mix(hash(n + 57.), hash(n + 58.),f.x),f.y),
                mix(mix(hash(n + 113.), hash(n + 114.),f.x),
                mix(hash(n + 170.), hash(n + 171.),f.x),f.y),f.z);
        }
        `;

    // language=GLSL
    static #SHADER_VERTEX = glslGlobals + `
        layout(location = 0) in vec3 position;
        
        void main() {
            gl_Position = vp * vec4(position, 1.);
            gl_PointSize = viewport.y * .2 * projection[1][1] / gl_Position.w;
        }
        `;

    // language=GLSL
    static #SHADER_FRAGMENT = ShaderSmoke.#SHADER_NOISE + `
        out vec4 color;
        
        void main() {
            color = vec4(vec3(noise(vec3(gl_PointCoord.xy * 5., 1.))), .5);
        }
        `;

    constructor() {
        super(ShaderSmoke.#SHADER_VERTEX, ShaderSmoke.#SHADER_FRAGMENT);

        this.use();

        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}