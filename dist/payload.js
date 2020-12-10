"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Payload {
    constructor(path, value, parent = () => undefined) {
        this.path = path;
        this.value = value;
        this.parent = parent;
        this.keyname = "";
        this.metadata = {};
        this.keyname = path[path.length - 1];
    }
    get(keyname) {
        // console.log(this.value, keyname)
        const value = this.value[keyname];
        return value !== undefined ? new Payload(this.path.concat(keyname), value, () => this) : undefined;
    }
}
exports.default = Payload;
