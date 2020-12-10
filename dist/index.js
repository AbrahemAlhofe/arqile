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
const utils_1 = __importDefault(require("./utils"));
const collector_1 = require("./collector");
// Handlers
const array_handler_1 = __importDefault(require("./handlers/array.handler"));
const object_handler_1 = __importDefault(require("./handlers/object.handler"));
const string_handler_1 = __importDefault(require("./handlers/string.handler"));
// Units
const layers_1 = __importDefault(require("./layers"));
const payload_1 = __importDefault(require("./payload"));
const recipe_1 = __importDefault(require("./recipe"));
class Qreal extends layers_1.default {
    constructor() {
        super();
    }
    pass(data, recipe, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const _recipe = new recipe_1.default(['@root'], recipe);
            const _data = new payload_1.default(['@root'], data);
            /** @check : [ data ] is array */
            function onQuery() {
                /** @warning : you should use * qurey instead */
            }
            yield new array_handler_1.default(_data).apply(_recipe, onQuery);
            const result = new collector_1.Collector(_data.metadata['value'].length, callback);
            _data.metadata['value'].forEach((item__value, index) => {
                var _a;
                const item = new payload_1.default(["@root", String(index)], item__value);
                const item__recipe = (_a = _recipe.get('*')) !== null && _a !== void 0 ? _a : new recipe_1.default(['@root', '*'], {});
                this.apply(item, item__recipe).then(payload => {
                    const keyname = payload.metadata['alias'] === '*' ? index : payload.metadata['alias'];
                    result.insert(keyname, payload.metadata['value']);
                });
            });
            return result.onCompelete();
        });
    }
    apply(payload, recipe) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const qreal = this;
            // ============================
            // Asign Default Value
            // ============================
            payload.metadata['value'] = payload.value;
            // ============================
            // Layers
            // ============================
            /** @reject : if there is any error in observers functions */
            yield this.observe(payload, recipe);
            // ===========================
            // Alias
            // ===========================
            payload.metadata['alias'] =
                recipe.alias[0] === "@"
                    ? utils_1.default.parse(payload.value, recipe.alias.slice(0))
                    : recipe.alias;
            // ===================================
            // Array
            // ===================================
            if (Array.isArray(payload.value)) {
                const result = [];
                yield new array_handler_1.default(payload).apply(recipe);
                for (let index in payload.metadata['value']) {
                    const item__value = payload.metadata['value'][index];
                    const item_payload = new payload_1.default(payload.path.concat(index), item__value, () => payload);
                    const item__recipe = new recipe_1.default(recipe.path.concat("*"), (_a = recipe.value["*"]) !== null && _a !== void 0 ? _a : {});
                    const item = yield qreal.apply(item_payload, item__recipe);
                    result.push(item.metadata['value']);
                }
                payload.metadata['value'] = result;
            }
            // ===================================
            // Object
            // ===================================
            if (utils_1.default.isPlainObject(payload.value)) {
                yield new object_handler_1.default(payload).apply(recipe, onQuery);
                function onQuery(queryName) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const subPayload__recipe = recipe.get(queryName);
                        const subPayload = payload.get(subPayload__recipe.keyname);
                        if (!subPayload)
                            return;
                        const item = yield qreal.apply(subPayload, subPayload__recipe);
                        payload.metadata['value'][item.metadata['alias']] = item.metadata['value'];
                    });
                }
            }
            // ===================================
            // String
            // ===================================
            if (typeof payload.value === "string")
                yield new string_handler_1.default(payload).apply(recipe);
            return payload;
        });
    }
}
exports.default = Qreal;
module.exports = Qreal;
