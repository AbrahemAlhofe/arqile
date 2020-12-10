export default class Payload {
    keyname: string = "";

    metadata: Record< string | symbol, any > = {};

    constructor(
        public path: string[],
        public readonly value: any,
        public parent: () => undefined | Payload = () => undefined
    ) {
        this.keyname = path[path.length - 1];
    }

    get (keyname: string) {
        // console.log(this.value, keyname)
        const value = this.value[keyname]
        return value !== undefined ? new Payload(this.path.concat(keyname), value, () => this) : undefined
    }

}