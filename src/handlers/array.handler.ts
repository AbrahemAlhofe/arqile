import Payload from "../payload";
import Recipe from "../recipe";
import utils from "../utils"

export default class ArrayHandler<T> {
    
    constructor (public payload: Payload) {
        this.payload.metadata['value'] = []
    }

    $take ( argument: number | number[] = this.payload.value.length ) {
        /** @assert : if argument is number or tuble of numbers  */
        
        // take only first two itmes in take argument
        const take = Array.isArray(argument) ? argument : [ argument ]

        // placeholding [ take ]
        let [from, to] = [ ...new Array(2 - take.length).fill(0), ...take ]

        // if [ form ] attribute object get index of it if not keep it
        const index = this.payload.value.findIndex(v => v === from);
        from = ( index !== -1 ) ? index : from

        // convert [ to ] attribute to index syntax to make it work with slice
        to = from + to + take.length - 1

        this.payload.metadata['value'] = this.payload.value.slice( from, to )
    }

    $ignore (ignoredItems: T[]) {
        this.payload.metadata['value'] = this.payload.value.filter( item => !ignoredItems.includes(item) )
    }
  
    $include (argument: { [key: number] : T } | T[]) {
        /** @assert $include return array or object */
        if ( Array.isArray( argument ) ) this.payload.metadata['value'] = this.payload.value.concat(argument)
        else {
            const init = [ ...this.payload.value ]
            for ( let key in argument ) {
                const key_number = Number( key )
                const index = key_number < 0 ? key_number + ( init.length + 1) : key_number
                init.splice(index, 0, argument[key])
            }
            this.payload.metadata['value'] = init
        }
    }

    $value (newValue: T[] | string) {
        /** @assert newValue value after parsing is array */
        this.payload.metadata['value'] = typeof newValue === 'string'
                ? utils.parse(this.payload.value, newValue)
                : newValue
    }

    $keyName (newKeyname: string) {
        /** @assert newKeyname is string */
        this.payload.metadata['alias'] = typeof newKeyname === 'string'
                ? utils.parse(this.payload.value, newKeyname)
                : newKeyname
    }

    async apply (recipe: Recipe, onQuery: Function = () => Promise.resolve()) {
        await utils.applyActions(this, recipe, onQuery);
        this.payload.metadata['value'] = this.payload.metadata['value'].length === 0 ? this.payload.value : this.payload.metadata['value'];
    }

}