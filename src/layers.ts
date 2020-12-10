import Payload from './payload'
import Recipe from './recipe'
import { TLayerHandler, TLayerMatcher } from "./types";

export default class Observer {

    layers: Map< TLayerMatcher, TLayerHandler > = new Map()

    constructor () {}

    addLayer ( layerMatcher : TLayerMatcher, layerHandler : TLayerHandler ) {
        this.layers.set(layerMatcher, layerHandler)
    }
    
    observe ( payload: Payload, recipe: Recipe): Promise<any> {
        const layers: Promise<any>[] = []
        this.layers.forEach((layerHandler, layerMatcher) => {
            if ( layerMatcher(payload, recipe) ) layers.push( layerHandler(payload, recipe) )
        })
        return Promise.all(layers)
    }

}