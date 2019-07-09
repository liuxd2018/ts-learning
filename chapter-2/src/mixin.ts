// type ClassConstructor<T> = new(...args: any[]) => T

// function withEZDebug<C extends ClassConstructor<{getDebugValue(): object}>>(Class: C) {
//     return class extends Class {
//         debug() {
//             let Name = Class.constructor.name
//             let value = this.getDebugValue()
//             return Name + '(' + JSON.stringify(value) + ')'
//         }
//     }
// }

// class HardToDebugUser {
//     constructor(
//         private id: number,
//         private firstName: string,
//         private lastName: string
//     ) {}
//     getDebugValue() {
//         return {
//             id: this.id,
//             name: this.firstName + ' ' + this.lastName
//         }
//     }
// }

// const User = withEZDebug(HardToDebugUser)

// const user = new User(3, 'Emma', 'Gluzman')

// console.log(user.debug())

type ExistingUser = {
    id: number
    name: string
}

type NewUser = {
    name: string
}

function deleteUser(user: {id?:number, name: string}) {
    delete user.id
}

let existingUser: ExistingUser = {
    id: 123456,
    name: 'Iam'
}

deleteUser(existingUser)

// you can still access id the problem
existingUser.id
