type State = {
    [key: string]: string

}

class StringDatabase {
    state: State = {}
    get(key: string): string | null {
        return key in this.state ? this.state[key] : null
    }
    set(key: string, value: string): void {
        this.state[key] = value
    }
    static from(state: State) {
        let db = new StringDatabase()
        for (let key in state) {
            db.set(key, state[key])
        }
        return db
    }
}

// the instance type the class declaration generate

// interface StringDatabase {
//     state: State
//     get(key: string): string|null
//     set(key: string, value: string): void
// }

// the constructor type of the class declaration

// interface StringDatabaseConstructor {
//     new(): StringDatabase
//     from(state: State): StringDatabase
// }

console.table(typeof StringDatabase)