import Payload from "../payload";
import Recipe from "../recipe";
import utils from "../utils"

export default class ObjectHandler {

    constructor (public payload: Payload) {
        payload.metadata['value'] = {}
    }
    
    $take (keys: string[]) {
        /** @check : key is array of strings */
        keys.forEach( key => {
            const value = this.payload.value[key];
            if ( value !== undefined ) this.payload.metadata['value'][key] = value
            else return /** @warning : ${value} is not defined */
        })
    }

    $ignore (keys: string[] = []) {
        for ( let key in this.payload.value )
            if ( !keys.includes(key) ) this.payload.metadata['value'][key] = this.payload.value[key]
    }

    $include (_argument: object | Function) {
        /** @assert $include return object */
        const object: Record<string, any> = utils.castFunction( _argument, this.payload.value )
        Object.assign(this.payload.metadata['value'], object)
    }

    $value (newValue: Record< string, any > | string) {
        /** @assert newValue or newValue after parsing is Record< string , any> */
        this.payload.metadata["value"] =
            typeof newValue === "string"
                ? utils.parse(this.payload.value, newValue)
                : newValue;
    }

    $keyname (newKeyname: string) {
        /** @assert newKeyname after parsing is string */
        this.payload.metadata["alias"] =
            typeof newKeyname === "string"
                ? utils.parse(this.payload.value, newKeyname)
                : newKeyname;
    }

    apply (recipe: Recipe, onQuery: Function = () => Promise.resolve()) {
        return utils.applyActions(this, recipe, onQuery)
    }

}