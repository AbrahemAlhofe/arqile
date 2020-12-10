"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collector {
    constructor(length, callback = () => { }) {
        this.length = length;
        this.callback = callback;
        this.container = {};
        this.container_isArray = true;
        this.completed = () => { };
    }
    get isCompeleted() {
        return Object.keys(this.container).length === this.length;
    }
    insert(index, item) {
        if (isNaN(Number(index)))
            this.container_isArray = false;
        this.container[index] = item;
        this.callback(index, item);
        if (this.isCompeleted)
            this.completed();
    }
    onCompelete() {
        return new Promise((resolve, reject) => {
            this.completed = () => resolve(this.container_isArray ? Object.entries(this.container).map(p => p[1]) : this.container);
            if (this.isCompeleted)
                this.completed();
        });
    }
}
exports.Collector = Collector;
