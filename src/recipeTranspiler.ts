import Recipe from "./recipe"

export default function recipeTranspiler (
    recipe: undefined | Function | string | string[] | Record< string, any >
): Record<string, any> {

    if ( Array.isArray(recipe) ) return { $take : recipe }
    
    if ( typeof recipe === 'function' ) return { $value : recipe }
    
    if ( typeof recipe === 'undefined' || recipe === '' ) return { $ignore : [] }
    
    if ( typeof recipe === 'string' || typeof recipe === 'number' ) return { $value : recipe }

    return recipe
}