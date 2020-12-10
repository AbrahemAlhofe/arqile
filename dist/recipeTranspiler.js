"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function recipeTranspiler(recipe) {
    if (Array.isArray(recipe))
        return { $take: recipe };
    if (typeof recipe === 'function')
        return { $value: recipe };
    if (typeof recipe === 'undefined' || recipe === '')
        return { $ignore: [] };
    if (typeof recipe === 'string' || typeof recipe === 'number')
        return { $value: recipe };
    return recipe;
}
exports.default = recipeTranspiler;
