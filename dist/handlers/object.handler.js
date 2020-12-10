"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
class ObjectHandler {
    constructor(payload) {
        this.payload = payload;
        payload.metadata['value'] = {};
    }
    $take(keys) {
        /** @check : key is array of strings */
        keys.forEach(key => {
            const value = this.payload.value[key];
            if (value !== undefined)
                this.payload.metadata['value'][key] = value;
            else
                return; /** @warning : ${value} is not defined */
        });
    }
    $ignore(keys = []) {
        for (let key in this.payload.value)
            if (!keys.includes(key))
                this.payload.metadata['value'][key] = this.payload.value[key];
    }
    $include(_argument) {
        /** @assert $include return object */
        const object = utils_1.default.castFunction(_argument, this.payload.value);
        Object.assign(this.payload.metadata['value'], object);
    }
    $value(newValue) {
        /** @assert newValue or newValue after parsing is Record< string , any> */
        this.payload.metadata["value"] =
            typeof newValue === "string"
                ? utils_1.default.parse(this.payload.value, newValue)
                : newValue;
    }
    $keyname(newKeyname) {
        /** @assert newKeyname after parsing is string */
        this.payload.metadata["alias"] =
            typeof newKeyname === "string"
                ? utils_1.default.parse(this.payload.value, newKeyname)
                : newKeyname;
    }
    apply(recipe, onQuery = () => Promise.resolve()) {
        return utils_1.default.applyActions(this, recipe, onQuery);
    }
}
exports.default = ObjectHandler;
