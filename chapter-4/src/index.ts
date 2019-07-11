// first-class objects

// assigned to variables
// passed to other functions
// returned from functions
// stored on object properties(methods)

function add(a: number, b: number): number {
    return a + b
}

// ts will always infer return type
// ts will sometime infer parameter type(Contextual Typing) a, already
// known the funciton's type b, as callback function

// good practice
// explicitly annotate return types
// because you first write the signature then write the body
// this will enfore your body to confirm the signature

// ways to create function

// funciton declaration
function great(name: string): string {
    return 'hello ' + name
}

// function expression
const greet2 = function(name: string): string {
    return 'hello ' + name
}

// arrow function expression
const greet3 = (name: string): string => {
    return 'hello ' + name
}

// optional and default parameters

// use ? or use default value

function log(message: string, userId = 'Not signed in') {
    let time = new Date().toISOString()
    console.log(time, message, userId)
}

type Context = {
    appId?: string,
    userId?: string
}

function log2(message: string, context: Context = {}) {
    let time = new Date().toISOString()
    console.log(time, message, context.userId)
}


// Rest parameter
// variadic function API

// at most one rest parameter, and that parameter has to be 
// last one in the funciton's parameter list

function sumVariadic(...numbers: number[]) {
    return numbers.reduce((total, n) => total + n, 0)
}

interface Console {
    log(message?: any, ...optionalParams: any[]): void
}

// call, apply and bind

function add3(a: number, b: number): number {
    return a + b
}

add3(10, 20)
add.apply(null, [10, 20])
add.call(null, 10 ,20)
add.bind(null, 10, 20)()

// typing this argument

// this variable is defined for every function, not just for those
// functions that live as methods on classes

// this has a different value depending on the way you called a function,
// and not on the way you declared it

// declare this type as your function's first parameter

function fancyDate(this: Date) {
    return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`
}

fancyDate.call(new Date)
fancyDate() // ts error

// ts flag noImplicitThis


// generator functions

// generate a bunch of values
// fine control over the pace at which values are produced, because
// they're lazy
// do things that can be hard to do, eg. generate infinite lists

function* createFibonacciGenerator(): IterableIterator<number> {
    let a = 0
    let b = 1
    while (true) {
        yield a;
        [a, b] = [b, a+b]
    }
}

let fibonacciGenerator = createFibonacciGenerator()
fibonacciGenerator.next() // {value: 0, done: false}


// iterable:
//    any object that contains a property called `Symbol.iterator`, whose value is
//    a function that returns an iterator.

// iterator:
//    any object that defines a method called next, which returns an object with
//    the properties `value` and `done`

// generator's return type is both an iterable and iterator

// define a iterable
let numbers = {
    *[Symbol.iterator] () {
        for (let n = 1; n <= 10; n++) {
            yield n
        }
    }
}
// built-in iterable Array Map Set String

// operation for iterable

// for-of
for (let a of numbers) {
    console.log(a)
}
// spread
let allNumbers = [...numbers]
// destructure
let [one, two, ...rest] = numbers


// express the full types of functions

type Log = (message: string, userId?: string) => void

const logs: Log = (m, u = 'Not signed in') => { // m, u doesn't need to
    let time = new Date().toISOString()         // be the same as in type
    console.log(time, m, u)                     // aliase
}

// contextual typing

function times (
    f: (index: number) => void,
    n: number
) {
    for(let i = 0; i < n; i++) {
        f(i)
    }
}

times(n => console.log(n), 4) // ts infer n is number

// full call signature vs shorthand call signature

type Log1 = (message: string, userId?: string) => void

type Log2 = {
    (message: string, userId?: string): void
}

// use cases for full signature
// a. overloading
// b. function with properties

// overloaded function:
//      a function with multiple call signatures

// overloaded function signatures to design really expressive API
type Reservation = {
    roundTrip: boolean
}

type Reserve = {
    (from: Date, to: Date, destination: string): Reservation
    (from: Date, destination: string): Reservation 
    (destination: string): Reservation 
}

const reserve: Reserve = (
    from: Date | string,
    toOrDestination?: Date | string,
    destination?: string
) => {
    if(typeof from === 'string') {
        return {roundTrip: false}
    } else if(typeof toOrDestination === 'string') {
        return {roundTrip: false}
    } else {
        return {roundTrip: true}
    }
    // // todo
    // if(toOrDestination instanceof Date && destination !== undefined) {
    //     toOrDestination.getDate()
    //     // round trip
    //     return {roundTrip: true}
    // } else if (typeof toOrDestination === 'string') {
    //     // one-way trip
    //     return {roundTrip: false}
    // }
    // return null
}

// from a caller's point of view, function's type is the union of those overload signature
// form a implementer's point of view, function needs to be single, combined type

// ts resolves overloads in the order they were declared.

// ??? the implementation should be subtype to all overloaded interface ???


let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x: {suit: string; card: number; }[] | number): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
console.log("card: " + pickedCard2.card + " of " + pickedCard2.suit);

// model properties on function

type WarnUser = {
    (warning: string): void
    wasCalled: boolean
}
const warnUser: WarnUser = (warning: string) => {
    if( !warnUser.wasCalled) {
        warnUser.wasCalled = true
        console.log(warning)
    }
}
warnUser.wasCalled = false


// polymorphism


// concrete type
// boolean string Date[] {a:number} | {b: string} (numbers: number[]) => number

type Filter = {
    (array: number[], f: (item: number) => boolean): number[]
    (array: string[], f: (item: string) => boolean): number[]
    //...
    // more overload
    // arity is the same
    // so you can use generic
}

// generic type parameter
//   a placeholder type used to enforce a type-level constraint in multiple
//   places. Also known as polymorphic type parameter

type FilterGeneric = {
    <T>(array: T[], f: (item: T) => boolean): T[] // return type depending on input type
}

// or type FilterGeneric = <T>(array: T[], f: (item: T) => boolean) => T[]

// you don't need to supply the type parameter, ts will infer T from
// the type we pass in for array

// where you place the angle brackets scopes the generics(there are just
// a few places you can put them), and ts makes sure that within their scope,
// all instances of the generic type parameters are eventually bound to the
// same concrete types

const filter: FilterGeneric = (array, f) => {
    let result = []
    for (let i = 0;  i< array.length; i++) {
        let item = array[i]
        if(f(item)) {
            result.push(item)
        }
    }
    return result
}
// or
function filterDeclaration<T>(array: T[], f: (item: T) => boolean): T[] {
    let result = []
    for (let i = 0;  i< array.length; i++) {
        let item = array[i]
        if(f(item)) {
            result.push(item)
        }
    }
    return result
}

filter([1,2,3], _ => _ > 2)

filter(['a', 'b'], _ => _ !== 'b')

let names = [
    {firstName: 'beth'},
    {firstName: 'caitlyn'},
    {firstName: 'xin'}
] 
filter(names, _ => _.firstName.startsWith('b'))

// generic types can also be used in type aliases, classes, and interfaces

type Filter2<T> = {
    (array: T[], f: (item: T) => boolean): T[] // this can be called generic type
}

let filter2: Filter2<number> // use it this way


//map function
function map(array: unknown[], f: (item: unknown) => unknown): unknown[] {
    let result = []
    for(let i = 0; i < array.length; i++) {
        result[i] = f(array[i])
    }
    return result
}

function map2<T, U>(array: T[], f: (item: T) => U): U[] {
    let result = []
    for(let i = 0; i < array.length; i++) {
        result[i] = f(array[i])
    }
    return result
}

// you can explicitly annotate generic function call

map2<string, boolean>(['a', 'b'], _ => _ === 'a');

let promise = new Promise<number>(resolve => resolve(45))

promise.then(result => result * 4)

let promise2: Promise<number> = new Promise(resolve => resolve(45))

promise2.then(result => result * 4)

// generic type aliases

type MyEvent<T> = {
    target: T
    type: string
}

// when you use a generic type, you have to explicitly bind its type
// parameters when you use the type, they won't be inferred for you

type ButtonEvent = MyEvent<HTMLButtonElement>

let myEvent: MyEvent<HTMLButtonElement | null> = {
    target: document.querySelector('#myButton'),
    type: 'click'
}

function triggerEvent<T>(event: MyEvent<T>): void {
    //...
}

triggerEvent({ // t is Element | null
    target: document.querySelector('#myButton'),
    type: 'click'
})


// bounded polymorphism

type TreeNode = {
    value: string
}
type LeafNode = TreeNode & { //LeafNode is subtype of TreeNode
    isLeaf: true
}
type InnerNode = TreeNode & { //InnerNode is subtype of TreeNode
    children: [TreeNode] | [TreeNode, TreeNode]
}

function mapNode<T extends TreeNode>(
    node: T,
    f: (value: string) => string
): T {
    return {
        ...node,
        value: f(node.value)
    }
}

let a: TreeNode = {value: 'a'}
let b: LeafNode = {value: 'b', isLeaf: true}
let c: InnerNode = {value: 'c', children: [b]}

let a1 = mapNode(a, _ => _.toUpperCase())
let b1 = mapNode(b, _ => _.toUpperCase())
let c1 = mapNode(c, _ => _.toUpperCase())

// bounded polymorphism with multiple constraints

type HasSides = {numberOfSides: number}
type SidesHaveLength = {sideLength: number}

function logPerimeter<Shap extends HasSides & SidesHaveLength>(s: Shap): Shap {
    console.log(s.numberOfSides * s.sideLength)
    return s
}

let square = {numberOfSides: 4, sideLength: 3}
logPerimeter(square)

// variadic function with generic parameter
// model arity

function call<T extends unknown[], R>(
    f: (...args: T) => R,
    ...args: T
): R {
    return f(...args)
}
// my solution
function callE<T, U extends unknown[], R>(
    f:(a: T, b: string, ...args: U) => R,
    a: T,
    b: string,
    ...args: U
): R {
    return f(a, b, ...args)
}
// answer only type signature is changed
function callA<T extends [unknown, string, ...unknown[]], R>(
    f: (...arg: T) => R,
    ...args: T
): R {
    return f(... args)
}



function fill(length: number, value: string): string[] {
    return Array.from({length}, () => value)
}

function add1(a: number, b: number): number {
    return a + b
}

callE(fill, 10, 'a')
callE(add1, 1, 2)

call(fill, 10, 'a')

call(fill, 10)
call(fill, 10, 'a', 'z')

// generic type defaults

type MyEvent2<T extends HTMLElement = HTMLElement> = {
    target: T
    type: string
}

// now you don't have to bind the type parameter
let myElement = document.querySelector('a')
let myEvent3: MyEvent2 = {
    target: myElement!, // ! denote value is not null
    type: 'h'
}

// generic types with defaults have to appear after types without defaults

// type-driven development

// a style of programming where you sketch out type signatures first, and
// fill in values later.
// in other words, lead with types -- filling in the implementations later.

// type-level code vs value-level code

// type-level code, types and type operators
// will be discarded before runtime
// is not valid js code
// some part of ts is inter-mingled with js
// class generate both a type and a value
// namespaces exist just at the value level