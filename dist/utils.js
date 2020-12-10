"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    /** @type : use ( IActions ) in return */
    GET_itemsRecipe_dataRecipe(recipe = {}) {
        var _a;
        return [
            (_a = recipe["*"]) !== null && _a !== void 0 ? _a : {},
            ((r) => {
                delete r["*"];
                return r;
            })(recipe),
        ];
    }
    observer_name(path) {
        let key = path[path.length - 1];
        let observer_name = key;
        // is item key is number
        if (!isNaN(Number(key)))
            observer_name = path.join(".").replace(/\d/g, "*");
        return observer_name;
    }
    parse(item, query) {
        if (query[0] !== "@")
            return query;
        return this.get(item, query.slice(1));
    }
    applyActions(handler, recipe, onQuery) {
        const onQueries = [];
        for (let key in recipe.value) {
            /** @Enchance : use Promise.all() instead */
            const value = this.castFunction(recipe.value[key], [handler.payload]);
            if (key[0] !== "$")
                onQueries.push(onQuery(key, value));
            /** @Fix : type of it */
            if (key in handler)
                handler[key](value);
        }
        return Promise.all(onQueries);
    }
    castFunction(data, args) {
        return typeof data == "function" ? data(...args) : data;
    }
    get(from, path) {
        if (typeof path === "string")
            return path
                .replace(/\[([^\[\]]*)\]/g, ".$1.")
                .split(".")
                .filter((t) => t !== "")
                .reduce((obj, cur) => obj && obj[cur], from);
        if (Array.isArray(path))
            /** @Fix : type of it */
            return path.reduce((obj, cur) => obj && obj[cur], from);
    }
    isPlainObject(data) {
        return (typeof data === "object" &&
            !Array.isArray(data) &&
            !(data instanceof Promise) &&
            !(data instanceof Date));
    }
}
exports.default = new Utils();
