import Payload from "../payload";
import Recipe from "../recipe";
import utils from "../utils"

export default class StringHandler {

    constructor (public payload: Payload) {
        payload.metadata['value'] = ''
    }

    /** @change name of it to $slice */
    $take ( argument: number | (number | object)[] = this.payload.value.length ) {
        // take only first two itmes in take argument
        const take = Array.isArray(argument) ? argument : [ argument ]

        // placeholding [ take ]
        let [from, to] = [ ...new Array(2 - take.length).fill(0), ...take ]

        // if [ form ] attribute object get index of it if not keep it
        const index = this.payload.value.indexOf(from);
        from = ( index !== -1 ) ? index : from

        // convert [ to ] attribute to index syntax to make it work with slice
        to = from + to + take.length - 1

        this.payload.metadata['value'] = this.payload.value.slice( from, to )
    }

    $ignore (ignoredItems: string | string[]) {
        const regex = new RegExp(`${ ( Array.isArray( ignoredItems ) ? ignoredItems : [ ignoredItems ] ).join('|')}`, 'g')
        this.payload.metadata['value'] = this.payload.value.replace(regex, '')
    }
  
    $include (argument: { [key: number] : string } | string | Array<string> ) {
        /** @assert $include return string or object */
        if ( typeof argument === 'string' ) this.payload.metadata['value'] = this.payload.value + argument
        else if ( Array.isArray( argument ) ) this.payload.metadata['value'] = this.payload.value + argument.join('')
        else {
            const init = [ ...this.payload.value ]
            for ( let key in argument ) {
                const key_number = Number( key )
                const index = key_number < 0 ? key_number + ( init.length + 1) : key_number
                init.splice(index, 0, argument[key])
            }
            this.payload.metadata['value'] = init.join('')
        }
    }

    $value (newValue: string) {
        /** @assert newValue or newValue after parsing is string */
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

    async apply (recipe: Recipe, onQuery: Function = () => Promise.resolve()) {
        await utils.applyActions(this, recipe, onQuery)
        this.payload.metadata['value'] = this.payload.metadata['value'].length === 0 ? this.payload.value : this.payload.metadata['value']
    }

}