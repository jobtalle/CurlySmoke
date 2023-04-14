import {ShaderGrid} from "./shaderGrid.js";
import {Color} from "../../color.js";
import {ShaderSmoke} from "./shaderSmoke.js";

export class Shaders {
    static GRID = new ShaderGrid(new Color("#e8e8e8"));
    static SMOKE = new ShaderSmoke();
}