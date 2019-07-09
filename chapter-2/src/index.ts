// import { EADDRNOTAVAIL } from "constants";

// // console.log("Hello Typescript!")

// // let a : Map<string, number> = new Map();
// // a.set("1", 1);

// // let b = new Set();

// // declare let c : Array<string>;

// // async function hello () {
// //     return "hello"
// // }

// // type Fun = (x: string) => boolean
// // async function hello2(callback: (x: string) => boolean) : Promise<boolean> {
// //     return callback("he")
// // }

// // type Age = number

// // function hello3(x) {
// //     x.r()
// // }

// const  s = Symbol("a")
// console.log(typeof s)


// let c : {
//     firstName: string,
//     lastName: string
// } = {
//     firstName: 'john',
//     lastName: 'barrowman'
// }

// class Person {
//     constructor(public firstName: string, public lastName: string) {}
// }

// c = new Person("matt", "smith")


// let a: object


// function trueOrNull(isTrue: boolean) {
//     if(isTrue) {
//         return 'true'
//     }
//     return null
// }



// // overload example
// type Reservation = {
//     trip: string
// }
// type Reserve = {
//     (from: Date, to: Date, destination: string): Reservation
//     (from: Date, destination: string): Reservation
// }
// const reserve: Reserve = (
//     from: Date,
//     toOrDestination: Date | string,
//     destination?: string
// ) => {
//     if(toOrDestination instanceof Date && destination !== undefined) {
//         // book a round trip
//         return {trip: "round"}
//     } else {
//         // book a one-way trip
//         return {trip: "one-way"}
//     }
// }

// interface Animal {
//     readonly name: string
//     eat(food: string): void
//     sleep(hours: number): void

// }

// interface Feline {
//     meow(): void

// }

// class Cat implements Animal, Feline {
//     name = "Whiskers"
//     eat(food: string) {
//         console.info("Ate some ", food, '. Mmm!')
//     }
//     sleep(hours: number) {
//         console.info("Sleep for", hours, 'hours')
//     }
//     meow() {
//         console.info("Meow")
//     }
// }

// let cat = new Cat()

const f = [1, true]

console.log("hh你好")

console.log("nihao")

function hekk(c: string): unknown {
    return 1;
}

let s = Symbol("s")