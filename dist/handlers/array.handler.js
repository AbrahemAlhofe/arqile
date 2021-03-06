"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
class ArrayHandler {
    constructor(payload) {
        this.payload = payload;
        this.payload.metadata['value'] = [];
    }
    $take(argument = this.payload.value.length) {
        /** @assert : if argument is number or tuble of numbers  */
        // take only first two itmes in take argument
        const take = Array.isArray(argument) ? argument : [argument];
        // placeholding [ take ]
        let [from, to] = [...new Array(2 - take.length).fill(0), ...take];
        // if [ form ] attribute object get index of it if not keep it
        const index = this.payload.value.findIndex(v => v === from);
        from = (index !== -1) ? index : from;
        // convert [ to ] attribute to index syntax to make it work with slice
        to = from + to + take.length - 1;
        this.payload.metadata['value'] = this.payload.value.slice(from, to);
    }
    $ignore(ignoredItems) {
        this.payload.metadata['value'] = this.payload.value.filter(item => !ignoredItems.includes(item));
    }
    $include(argument) {
        /** @assert $include return array or object */
        if (Array.isArray(argument))
            this.payload.metadata['value'] = this.payload.value.concat(argument);
        else {
            const init = [...this.payload.value];
            for (let key in argument) {
                const key_number = Number(key);
                const index = key_number < 0 ? key_number + (init.length + 1) : key_number;
                init.splice(index, 0, argument[key]);
            }
            this.payload.metadata['value'] = init;
        }
    }
    $value(newValue) {
        /** @assert newValue value after parsing is array */
        this.payload.metadata['value'] = typeof newValue === 'string'
            ? utils_1.default.parse(this.payload.value, newValue)
            : newValue;
    }
    $keyName(newKeyname) {
        /** @assert newKeyname is string */
        this.payload.metadata['alias'] = typeof newKeyname === 'string'
            ? utils_1.default.parse(this.payload.value, newKeyname)
            : newKeyname;
    }
    apply(recipe, onQuery = () => Promise.resolve()) {
        return __awaiter(this, void 0, void 0, function* () {
            yield utils_1.default.applyActions(this, recipe, onQuery);
            this.payload.metadata['value'] = this.payload.metadata['value'].length === 0 ? this.payload.value : this.payload.metadata['value'];
        });
    }
}
exports.default = ArrayHandler;
