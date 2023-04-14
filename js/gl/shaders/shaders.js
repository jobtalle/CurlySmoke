import {ShaderGrid} from "./shaderGrid.js";
import {Color} from "../../color.js";
import {ShaderSmoke} from "./shaderSmoke.js";

export class Shaders {
    static GRID = new ShaderGrid(new Color("#bdbdbd"));
    static SMOKE = new ShaderSmoke();
}