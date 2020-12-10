import ArrayHandler from './handlers/array.handler';
import ObjectHandler from './handlers/object.handler';
import StringHandler from './handlers/string.handler';
import Recipe from './recipe';

class Utils {
  /** @type : use ( IActions ) in return */
  GET_itemsRecipe_dataRecipe(
    recipe: Record<string, any> = {}
  ): Record<string, any>[] {
    return [
      recipe["*"] ?? {}, // items recipe
      ((r) => {
        delete r["*"];
        return r;
      })(recipe), // array recipe
    ];
  }

  observer_name(path: string[]) {
    let key = path[path.length - 1];
    let observer_name = key;

    // is item key is number
    if (!isNaN(Number(key))) observer_name = path.join(".").replace(/\d/g, "*");

    return observer_name;
  }

  parse(item: any, query: string) {
    if (query[0] !== "@") return query;
    return this.get(item, query.slice(1));
  }

  applyActions(
    handler: ObjectHandler | ArrayHandler<any> | StringHandler,
    recipe: Recipe,
    onQuery: Function
  ) {
    const onQueries = [];
    for (let key in recipe.value) {
      /** @Enchance : use Promise.all() instead */
      const value = this.castFunction(recipe.value[key], [ handler.payload ]);
      if (key[0] !== "$") onQueries.push(onQuery(key, value));
      /** @Fix : type of it */
      if (key in handler) handler[key](value);
    }

    return Promise.all(onQueries);
  }

  castFunction(data: any, args: any[]): any {
    return typeof data == "function" ? data(...args) : data;
  }

  get(
    from: Record<string | symbol, any>,
    path: (string | symbol)[] | string
  ): any {
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

  isPlainObject(data: unknown): data is Record<string, any> {
    return (
      typeof data === "object" &&
      !Array.isArray(data) &&
      !(data instanceof Promise) &&
      !(data instanceof Date)
    );
  }

}

export default new Utils()