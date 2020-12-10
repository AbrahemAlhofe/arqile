import utils from './utils'
import { Collector } from "./collector";

// Handlers
import ArrayHandler from './handlers/array.handler';
import ObjectHandler from "./handlers/object.handler";
import StringHandler from "./handlers/string.handler";

// Units
import Layers from './layers';
import Payload from './payload';
import Recipe from './recipe';
import { indexOf } from 'lodash';

class Qreal extends Layers {

  constructor() {
    super()
  }

  async pass(
    data: Array<Record<string, any>>,
    recipe: { [key: string]: any },
    callback: Function = () => {}
  ) {
    
    const _recipe = new Recipe(['@root'], recipe)
    const _data = new Payload(['@root'], data)

    /** @check : [ data ] is array */

    function onQuery () {
      /** @warning : you should use * qurey instead */
    }

    await new ArrayHandler( _data ).apply( _recipe, onQuery )

    const result = new Collector(_data.metadata['value'].length, callback)

    _data.metadata['value'].forEach((item__value: any, index: number) => {
      const item = new Payload( ["@root", String(index)], item__value);
      const item__recipe = _recipe.get('*') ?? new Recipe(['@root', '*'], {})
      this.apply( item, item__recipe ).then(payload => {
        const keyname = payload.metadata['alias'] === '*' ? index : payload.metadata['alias']
        result.insert( keyname, payload.metadata['value'])
      })
    });

    return result.onCompelete();
  }

  async apply ( payload: Payload, recipe: Recipe ): Promise< Payload > {
    const qreal = this;

    // ============================
    // Asign Default Value
    // ============================
    payload.metadata['value'] = payload.value

    // ============================
    // Layers
    // ============================
    /** @reject : if there is any error in observers functions */
    await this.observe( payload, recipe );

    // ===========================
    // Alias
    // ===========================
    payload.metadata['alias'] =
      recipe.alias[0] === "@"
        ? utils.parse(payload.value, recipe.alias.slice(0))
        : recipe.alias;

    // ===================================
    // Array
    // ===================================
    if (Array.isArray(payload.value)) {
      const result = [];

      await new ArrayHandler(payload).apply(recipe);

      for (let index in payload.metadata['value']) {
        const item__value = payload.metadata['value'][index];
        const item_payload = new Payload(
          payload.path.concat(index),
          item__value,
          () => payload
        );
        const item__recipe = new Recipe(
          recipe.path.concat("*"),
          recipe.value["*"] ?? {}
        );
        const item = await qreal.apply(item_payload, item__recipe);
        result.push(item.metadata['value']);
      }

      payload.metadata['value'] = result
    }

    // ===================================
    // Object
    // ===================================
    if (utils.isPlainObject(payload.value)) {
      await new ObjectHandler(payload).apply(recipe, onQuery);

      async function onQuery(queryName: string) {
        const subPayload__recipe = recipe.get(queryName);
        const subPayload = payload.get(subPayload__recipe.keyname)
        if ( !subPayload ) return 
        const item = await qreal.apply( subPayload, subPayload__recipe );
        payload.metadata['value'][item.metadata['alias']] = item.metadata['value'];
      }
    }

    // ===================================
    // String
    // ===================================
    if (typeof payload.value === "string") await new StringHandler(payload).apply(recipe);

    return payload
  }

}

export default Qreal

module.exports = Qreal