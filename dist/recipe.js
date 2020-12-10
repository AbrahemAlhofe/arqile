"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipeTranspiler_1 = __importDefault(require("./recipeTranspiler"));
class Recipe {
    constructor(path, value, parent = () => undefined) {
        this.path = path;
        this.value = value;
        this.parent = parent;
        const [keyname, alias] = path[path.length - 1].split(/ *: */);
        this.keyname = keyname;
        this.alias = alias !== null && alias !== void 0 ? alias : keyname;
        this.value = recipeTranspiler_1.default(value);
    }
    get(keyname) {
        return new Recipe(this.path.concat(keyname), this.value[keyname]);
    }
}
exports.default = Recipe;
