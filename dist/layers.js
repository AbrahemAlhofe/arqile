"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Observer {
    constructor() {
        this.layers = new Map();
    }
    addLayer(layerMatcher, layerHandler) {
        this.layers.set(layerMatcher, layerHandler);
    }
    observe(payload, recipe) {
        const layers = [];
        this.layers.forEach((layerHandler, layerMatcher) => {
            if (layerMatcher(payload, recipe))
                layers.push(layerHandler(payload, recipe));
        });
        return Promise.all(layers);
    }
}
exports.default = Observer;
