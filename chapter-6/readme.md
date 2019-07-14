# advanced type

powerful type-level programming feature make declaring type constraints 
for type parameter and relationships between types simple, terse, and 
most of the time, inferred.

subtyping, assignability, variance

widening

control-flow-based typechecking feature, refinement and totality

keying into and keyof

mapping over object types

conditional types

custom type guards

escape hatches: type assertions and definite assignment assertion

companion object pattern

improving inference for tuple types

? simulating nominal types

? safely extending the prototype

## relationship between types and assignability

types relationship is similar to set relationship

### for simple type and union and intersection

flowchart and reasoning

everything is a subtype of any

never is a subtype of everything

number is subtype of number | string

### notation for subtyping

A <: B A is a subtype of or the same as the type B
A >: B A is a supertype of or the same as the type B

### four sorts of variance

variance refers to how subtyping  between more complex types relates to subtyping between their components.

invariance: you want exactly a T

covariance: you want a <:T

contravariance: you want a >:T

bivariance: you're ok with either <:T or >:T

### shape and array(parameterized/generic type) variance

if you expect a shape, you can pass a type with property types
that are the subtypes ot their expected types, but you cannot 
pass a shap with property types that are supertypes of their
expected types.

in ts, every complex types is covariant in its members, objects,
class, arrays, and function return types -- with one exception:
function parameter types which are contravariant.

not all languages make this design, in some language objects are
invariant in their property types, because, covariant property types
can lead to unsafe behavior. Some languages have different rules for
mutable and immutable objecs. Some languages have explicit syntax for
programmers to specify variance for their own data types.

### function variance

 A function A is subtype of function B if A has the same or lower arity(number
 of parameters) than B and:

 1 A's this type either isn't specified, or is >: B's this type
 2 Each of A's parameters is >: its corresponding parameter in B
 3 A's return type is <: B's return type

precondition: more loose
postcondition: more strict

be liberal in what you accept and conservative in what you produce

`strictFunctionTypes`

### assignability

for non-enum types:

A is assignable to B if either of the following is true:

    1. A <: B ( A is a subtype of B)
    2. A is any (convenience for interoperating with js code)

for enum types with `enum` or `const enum` keywords

a type A is assignable to an enum B if either of these  is true:

    1. A is a member of enum B
    2. B has at least one member that's a `number`, and A is a `number` (big source of unsafety)

### excess property checking

when you try to assign a fresh object literal T to another type U, and T has properties
that aren't present in U, ts reports an error.

a fresh object literal type is the type ts infers from an object literal. If that object literal either
uses a type assertion or is assigned to a variable, then fresh object literal is widened to a regular
object type, and its freshness diappears.

## widening

### type widening is a feature of ts's type inference.

When you declare a variable in a way that allows it to be mutated later,
its type is widened from its literal value to that base type that literal
belongs to:

```ts
let a = 'x' // string
let b = 3  // number
var c = true  // boolean

enum E {X, Y, Z}
let e = E.X  // E
const ec = E.Y // E.Y

const d = {x: 3}  // {x: number}
```

use an explicit type annotation to prevent your type from being widened.

```ts
const d: {x: 3} = {x: 3}
```

reassign a nonwidened type using let or var, ts widens it for you.
to keep it narrow, add explicit type annotation to your original declaration.

```ts
const a = "x" // "x"
let b =a // string

const c: 'x' = 'x'
let d = c // 'x'
```

variables initialized to `null` and `undefined` are widened to `any`,
but when they leaves the scope it was declared in, ts assign it a definite type:

```ts
function x() {
    let a = null // any
    a = 3        // any
    a = 'x'      // any
    return a
}
x() // string
```

### const type

used as a type assertion `as const`, const opts you type out of widening and
recursively marks its members as readonly, even for deeply nested data structure.

```ts
let a = {x: 3} as const // {readonly x: 3}
let e = [1, {x: 2}] as const // readonly [1, {readonly x: 2}]
```

## refinement

ts performs __flow-based type inference__, which is a kind of symbolic execution.
typechecker uses control flow statements like if ? || and switch, as well as type
queries like typeof instanceof and in to refine types as it goes.

used for union types.

loose equality check against `null` will return `true` for both `null` and `undefined` 

### discriminated union types

members of a union might overlap, ts needs a more reliable way to know when we're in one case
of a union type versus another case.

a literal type to tag each case of your union type

```ts
type UserTextEvent = {type: 'TextEvent', value: string, target: HTMLInputElement}
type UserMouseEvent = {type: 'MouseEvent', value: [number, number], target: HTMLElement}

type UserEvent = UserTextEvent | UserMouseEvent

function handle(event: UserEvent) {
    if(event.type === 'TextEvents') {
        event.value // string
        event.target // HTMLInputElement
        //...
        return
    }
    event.value // [number, number]
    event.target // HTMLElement
}
```

### totality

exhaustiveness checking, typechecker make sure you're coverd all your cases.

`noImplicitReturns` flags in tsconfig.json

## aditional type operator on shape

### keyin

shape['key'] // object property
shape[number] // array
shape[0] // tuple(number literal)

### keyof

`keyof` get all of an object's key as union of stiring literal types

typesafe getter function

```ts
function get<O extends object, K extends keyof O>(o: O, k: K): O[K] {
    return o[k]
}
```

## Mapped types

type MyMappedType = {
    [key in UnionType]: ValueType
}

a way to map over union type as object's key and value type

like index signature, you can have at most one mapped type per object

### build-in mapped types

    * Record<Key, Values>: an object with keys of type Keys and values of type Values
    * Partial<Object>: marks every field in Object as optional
    * Required<Object>: marks every field in Object as nonoptional
    * Readonly<Object>: marks every field in Object as read-only
    * Pick<Object, Keys>: return a subtype of Object, with just the given Keys

### property modifiers

mark fields optional with `?` read only with `readonly`, unmark them with `-` minus

## companion object pattern

pair together a type and an object

```ts
type Currency = {
    unit: 'EUR' | 'GBP' | 'JPY' | 'USD'
    value: number
}
let Currency = {
    DEFAULT: 'USD',
    from(value: number, unit = Currency.DEFAULT): Currency {
        return {unit, value}
    }
}
```

lets you group type and value information that's semantically part of 
a single name together. also lets consumers import both at one:

```ts
import {Currency} from './Currency'

let amountDue: Currency = {
    unit: 'JPY',
    value: 83733.10
}
let otherAmountDue = Currency.from(330, 'EUR')
```

## tuple() function

when you declare a tuple in ts, ts will always infer array type.

* user a type assertion to cast your tuple(inferred as array) to tuple type
* `as const` assertion

take advantage of the way ts infers types for rest parameters

using bounded poly polymorphism to model arity

```ts
function tuple<
T extends unknown[] // T is an array of any kind of type
>(...ts: T  // because T decribes a rest parameter, ts will infer a tuple type for it
): T {  // returns a value of the same tuple type that it inferred ts as
    return ts
}

let a = tuple(1, true) // [number, boolean]
```

## user-defined type guards

useful for not inline all type refinement logic

```ts
function isString(a: unknown): boolean {
    return typeof a === 'string'
}
function parseInput(input: string | number) {
    let formattedInput: string
    if(isString(input)) {
        formattedInput = input.toUpperCase() // error
    }
}
```

`is` operator, like typeof and instanceof

limited to a single parameter, but aren't limited to simple types

```ts
function isString(a: unknown): a is string {
    return typeof a === 'string'
}

type LegacyDialog = // ...
type Dialog = // ...

function isLegacyDialog(dialog: LegacyDialog | Dialog): dialog is LegacyDialog {
    // ...
}
```

without them, you'd have to inline all your typeof and instanceof type guards instead of building functions


## conditional types

```ts
type IsString<T> = T extends string ? true : false

type A = IsString<string> // true
type B = IsString<number> // false
```
looks like a regular value-level ternary expression, but at the type level.
you can use them almost anywhere you can as a type: in type aliases, interface, class, paramerter types,
and generic defaults in functions and methods

### distribute conditionals

distribute law(conditional with union)

string extends T ? A : B    ===   string extends T ? A : B

(string | number) extends T ? A : B   === (string extends T ? A : B) | (number extends T ? A : B)

(string|number|boolean) extends T ? A : B === (string extends T ? A:B)|(number extends T ? A:B)|(boolean extends T ? A:B)


```ts
type ToArray<T> = T[]

type A = ToArray<number> // number[]
type B = ToArray<number | string> // (number | string)[]

type ToArray2 = T extends unknown ? T[] : T[]

type C = ToArray2<number> // number[]
type D = ToArray2<number | string> // number[] | string[]
```

```ts
type Without<T, U> = T extends U ? never : T

type A = Without<boolean | number | string, boolean> // number | string
```

let's walk through what happened.

1 starts input

type A = Without<boolean | number | string, boolean> 
= (boolean | number | string) extends boolean ? never : (boolean | number | string)

2 distribute

= (boolean extends boolean ? never : boolean) |
(number extends boolean ? never : number)|
(string extends boolean ? never : string)

3 simplify
= never | number | string = number | string

references to T within the conditional type are resolved to individual constituents of the union type (i.e. T refers to the individual constituents after the conditional type is distributed over the union type).


### infer in extends clause


unpack complex type

```ts
type ElementType<T> = T extends unknown[] ? T[number]: T
type A = ElementType<number[]> // number

type ELementType2<T> = T extends (infer U)[] ? U : T
type B = ElementType2<number[]>  // number


type SecondArg<F> = F extends (a: any, b: infer B) => any ? B : never

// the type of Array.slice
type F =  typeof Array['prototype']['slice']

type C = SecondAra<F> // number | undefined

```
### built-in conditional types

* Exclude<T, U>: compute those types in T that are not in U
* Extract<T, U>: compute the types in T that you can assign to U
* NonNullable<T>: compute a version of T that excludes null and undefined
* ReturnType<F>: compute a function's return type(doesn't what for generic and overload functions)
* InstanceType<C>: computes the instance type of a class constructor

## escape hatches

### type assertions


#### A <: B <: C

you can only assert that a type is a supertype or a subtype of itself

`value as stirng`

`<string>value` // this can clash with TSX syntax

#### assert as any

two types might not be sufficiently related, because any
is assignable to anything

type assertion are unsafe, should avoid using

```ts
funciton addToList(list: string[], item: string) {
    // ...
}
addToList('this is really' as any, 'really unsafe')

```

#### nonnull assertion `!`

T|null or T|null|undefined


#### definite assignment assertion

```ts
let userId!: string
fetchUser()

userId.toUpperCase()

function fetchUser() {
    userId = globalCache.get('userId')
}
```

#### type branding simulating nominal types

## monkey patching built-in


javaScript has seven falsy values: null, undefined, NaN, 0, -0, "", and of course, false. 
Everything else is truthy