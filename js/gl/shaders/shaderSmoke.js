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
            
            return .5 + .5 * mix(mix(mix(hash(n + 0.), hash(n + 1.), f.x), 
                mix(hash(n + 57.), hash(n + 58.), f.x), f.y),
                mix(mix(hash(n + 113.), hash(n + 114.), f.x),
                mix(hash(n + 170.), hash(n + 171.), f.x), f.y), f.z);
        }
        `;

    // language=GLSL
    static #SHADER_VERTEX = glslGlobals + `
        layout(location = 0) in vec3 position;
        layout(location = 1) in float life;
        layout(location = 2) in float scale;
        layout(location = 3) in vec4 noiseOffset;
        layout(location = 4) in float rotation;
        
        out float vAlpha;
        out float vMagnitude;
        out mat2 vRotation;
        out mat3 vOffset;
        out float vOffsetDistance;
        
        void main() {
            float life2 = life * life;
            float life3 = life2 * life;
            float angle = (life2 + 4.) * rotation;
            float angleCos = cos(angle);
            float angleSin = sin(angle);
            vec3 offsetDirection = noiseOffset.xyz;
            vec3 offsetRight = normalize(vec3(-offsetDirection.z, 0., offsetDirection.x));
            vec3 offsetUp = cross(offsetDirection, offsetRight);
            float scaleLife = scale * (1. - life * .8);
            
            gl_Position = vp * vec4(position, 1.);
            gl_PointSize = viewport.y * scaleLife * projection[1][1] / gl_Position.w;

            vAlpha = 4. * (life3 - life3 * life3);
            vMagnitude = 1.5;
            vRotation = mat2(angleCos, -angleSin, angleSin, angleCos);
            vOffsetDistance = noiseOffset.z - position.y;
            vOffset = mat3(
                offsetDirection,
                offsetRight,
                offsetUp);
        }
        `;

    // language=GLSL
    static #SHADER_FRAGMENT = ShaderSmoke.#SHADER_NOISE + `
        in float vAlpha;
        in float vMagnitude;
        in mat2 vRotation;
        in mat3 vOffset;
        in float vOffsetDistance;

        out vec4 color;

        float noiseOctaves(const vec3 x) {
            float n1 = noise(x);
            float n2 = noise(x * -2.81);
            
            return n1 * n1 * n2;
        }

        void main() {
            vec2 delta = 2. * gl_PointCoord.xy - 1.;
            vec3 noiseCoordinate = vOffset * vec3(
                vec2(abs(delta.x), delta.y) * vRotation * vMagnitude,
                vOffsetDistance);
            float alpha = max(0., 1. - length(delta)) * vAlpha;
            float noiseValue = noiseOctaves(noiseCoordinate);

            color = vec4(mix(vec3(1.), vec3(.05), gl_PointCoord.y), 2. * noiseValue * alpha * (1. - gl_PointCoord.y * gl_PointCoord.y));
        }
    `;

    constructor() {
        super(ShaderSmoke.#SHADER_VERTEX, ShaderSmoke.#SHADER_FRAGMENT);

        this.use();

        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}