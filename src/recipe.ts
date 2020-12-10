import recipeTranspiler from "./recipeTranspiler";
import utils from "./utils";

export default class Recipe {
    keyname : string;

    alias: string;

    constructor(
        public path: string[],
        public readonly value: Record<string, any>,
        public parent: () => undefined | Recipe = () => undefined
    ) {

        const [ keyname, alias ] = path[ path.length - 1 ].split(/ *: */)
        this.keyname = keyname
        this.alias = alias ?? keyname
        this.value = recipeTranspiler(value);
    }

    get (keyname: string) {
        return new Recipe(this.path.concat(keyname), this.value[keyname])
    }
}
