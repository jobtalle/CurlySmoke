import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";

export class ShaderSmoke extends Shader {
    // language=GLSL
    static #SHADER_NOISE = `
        float hash(const float n) {
            return fract(sin(n) * 43758.5453);
        }
        
        float noise(const vec3 x) {
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
        layout(location = 1) in float life;
        layout(location = 2) in float scale;
        layout(location = 3) in float noiseOffset;
        layout(location = 4) in float rotation;
        
        out float vY;
        out float vAlpha;
        out float vScale;
        out mat2 vRotation;
        
        void main() {
            float life2 = life * life;
            float angle = (life2 + 4.) * rotation;
            float angleCos = cos(angle);
            float angleSin = sin(angle);
            
            vScale = scale * (1. - life2);
            
            gl_Position = vp * vec4(position, 1.);
            gl_PointSize = viewport.y * vScale * projection[1][1] / gl_Position.w;
            
            vY = noiseOffset - position.y;
            vAlpha = 4. * (life2 - life2 * life2);
            vRotation = mat2(angleCos, -angleSin, angleSin, angleCos);
        }
        `;

    // language=GLSL
    static #SHADER_FRAGMENT = ShaderSmoke.#SHADER_NOISE + `
        in float vY;
        in float vAlpha;
        in float vScale;
        in mat2 vRotation;
        
        out vec4 color;
        
        float noiseOctaves(const vec3 x) {
            return noise(x) * .5 + noise(x * 2.) * .3 + noise(x * 3.) * .2;
        }
        
        void main() {
            float alpha = max(0., 1. - length(gl_PointCoord.xy - .5) * 2.) * vAlpha;
            float noiseValue = .5 * .5 * noiseOctaves(vec3(
                vScale * vec2(abs(gl_PointCoord.x - .5), gl_PointCoord.y - .5) * vRotation * 20.,
                vY));
            
            color = vec4(vec3(1.), 2. * noiseValue * alpha);
        }
        `;

    constructor() {
        super(ShaderSmoke.#SHADER_VERTEX, ShaderSmoke.#SHADER_FRAGMENT);

        this.use();

        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}