
// any is the set of all values, you can do anything with any
// don't use it 

let a: any = 666
let b: any = ['danger']
let c = a + b // runtime error

// unknown is the set all values, you can compare them to find out the exact type(Refinement)
// == === || && ? ! typeof instanceof
// use it as placeholder to fill in

// when unknown is part of a union type, the result of the union will be unknown

let d: unknown = 30
let e = d === 123

//let f = d + 10 // ts error

if(typeof d === 'number') {
    let g = d + 10
}

// boolean and boolean literal
// ts infers different types for let and const, Type Widening

let h = true // boolean
const i = true // true
let j: true = true // true

// number
let k = 1 // number
const l = 2 // 2
let m: 3 = 3 // 3

// biginit
// tsconfig.json target: esnext

let n = 1234n
const o = 1234n
let p: 1234n = 1234n

// string
let q = "hello"
const r = "hello"
let s: "string" = "string"

// symbol

let t = Symbol("t")
const u = Symbol("u")
let v: unique symbol = Symbol("v") // ts error

// object(named record)
// object literal syntax {}
//  'shape'
const w = {
    b: 'x'    // {b: string} Type Widening
}             // because object are mutable, you might update their fields after you create them
let x = {
    a: 'y'  // {a: string}
}

let y: {b: number} = {
    b: 12
}

let z: {
    firstName: string
    lastName: string
} = {
    firstName: 'john',
    lastName: 'barrowman'
}

class Person {
    constructor(
        public firstName: string, // public is shorthand for this.firstName = firstName
        public lastName: string
    ) {}
}
 
z = new Person('matt', 'smith')


let ab: {b: number}
ab = {} //ts error
ab = {
    b: 1,
    c: 2  // ts error, due to `excess property checking`
} 

let cd = {b: 1, c: 2}

ab = cd // use a intermidiate name

ab = {
    b: 1,
    c: 2 
} as {b: number} // use type assertion

// definite assignment
// when you declare a variable in one place and initialize it later,
// TS will make sure that your variable is definitely assigned a value
// by the time you use it.

// modifiers
// ? optional T | undefined
// readonly   like const for object properties
// index signature
// [key: T] T is number or string 

let ac: {
    a: number
    b?: string
    readonly c: string
    [key: number]: boolean 
}

// three special object type
// {} Object object
// use object avoid {} and Object

// type-level operation

// type aliases
// just like variable declaration, you can declare a type alias that
// represent a type

// Wherever you see a type alias used, you can substitue in the type it aliasees
// without changing the meaning of your program

// you can't declare a type aliase twice in same scope

// inner type alias declarations shadow outer one

type Age = number

type People = {
    name: string
    age: Age
}

let ageOf = 55
let driver: People =  {
    name: "James May",
    age: ageOf
}


// union and intersection

type Cat = {name: string, purrs: boolean}
type Dog = {name: string, barks: boolean, wags: boolean}
type CatOrDogOrBoth = Cat | Dog
type CatAndDog = Cat & Dog

let ch: CatOrDogOrBoth = {
    name: 'Bonkers',
    purrs: true
}
ch = {
    name: 'Domino',
    barks: true,
    wags: true
}
ch = {
    name: 'Donkers',
    barks: true,
    purrs: true,
    wags: true
}

// unions come up naturally a lot more often than intersection do.

function trueOrNull(isTrue: boolean): 'true' | null {
    if(isTrue) {
        return 'true'
    }
    return null
}

function hh(a: string, b: number) {
    return a || b
}


// arrays
// special kinds of objects
// support concatenation, pushing, searching and slicing

let aa = [1, 2, 3]
const bb = ['a', 'b']
const cc = [1, 'a'] // you need to check which type before using it

cc.map(item => {
    if(typeof item === 'number') {   // `refinement type guard`
        return item * 3
    }
    return item.toUpperCase()
})

// two syntaxes for array: T[] Array<T>
// keep arrays homogeneous
// when you initialize an empty array, TS doesn't know
// what type the array's elements should be, so it will
// infer any[], once your array leaves the scope it was
// defined in, TS will assign it a final type that can't
// be expanded anymore

function buildArray() {
    let a = []
    a.push(1)
    a.push('x')
    return a
}
let myArray = buildArray()
myArray.push(true) // TS error

// tuples
// fixed length
// values at each index have specific, known types
// tuples have to be explicitly typed when you declare them
// because it have same syntax as array

let bbb: [string, string, number] = ['malcolm', 'gladwell', 1963]

// optional element

let trainFares: [number, number?][] = [
    [3.75],
    [8.25, 7.70],
    [10.50]
]
// equivalently
let moreFares: ([number] | [number, number])[] = [
    [3.75],
    [8.25, 7.70],
    [10.50]
]

// rest element

// a list of strings with at least 1 element
let friends: [string, ...string[]] = ['Sara', 'Tali']

// a heterogeneous list
let list: [number, boolean, ...string[]] = [1, false, 'a', 'b']

// read-only arrays and tuples

// you can't update them in place
// you can't use mutating methods(.push, .splice)
// you can use nonmutationg methods(.concat, .slice) 
let as: readonly number[] = [1,2,3]

// different syntax
// Readonly ReadonlyArray utilities

type A = readonly string[]
type B = ReadonlyArray<string>  
type C = Readonly<string[]>
type D = Readonly<Array<string>>

type E = readonly [number, string]
type F = Readonly<[number, string]>

// read-only (unmodifiable) vs immutable
// immutable collection support update in an efficient way

// null undefined void never

// unknown is the supertype of every other type, then never
// is the subtype of every other type(bottom type)

// `null` absence of a value, as sentinel value in api
// Option<T> in Haskell Rust

// `undefined` variable that has not been assigned a value yet

// `void` function that doesn't have a return statement eg. console.log

// `never` function that never returns(throw exception or infinite loop)

let ddd: string
ddd = null // string is not nullable
// ts strictNUllChecks

// enum

// not safe, avoid

// summary

// you can let ts infer types for you from your values,
// or you can explicit type your values.

// const will infer more specific types, let more general ones.

// most types have general and more specific counterparts,
// the latter is subtype of the former


// exercises

let hhh = null //:any type widening

// discriminated union types

// hint to ts that your union i disjoint and a value of that union
// has to be one or the other, and not both