export class Collector<T> {
    container: Record<string, T> = {}
    container_isArray : boolean = true
    completed: Function = () => {}

    get isCompeleted () {
        return Object.keys(this.container).length === this.length;
    }

    constructor (public length: number, public callback: Function = () => {}) {}

    insert (index: number, item: T) {
        if ( isNaN( Number(index) ) ) this.container_isArray = false
        this.container[index] = item
        this.callback(index, item)
        if ( this.isCompeleted ) this.completed()
    }

    onCompelete (): Promise< T[] | Record<string, T> > {
        return new Promise((resolve, reject) => {
            this.completed = () => resolve( this.container_isArray ? Object.entries(this.container).map( p => p[1] ) : this.container )
            if ( this.isCompeleted ) this.completed()
        })
    }
}