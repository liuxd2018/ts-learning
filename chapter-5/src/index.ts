import { BADFAMILY } from "dns";

// classes and inheritance

// enumerate possible values as type literals
type Color = 'Black' | 'White'
type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8


// a set of coordinates for a piece
class Position {
    constructor(
        private file: File, // access modifier automatically assigns the parameter to this
        private rank: Rank  // public protected private
    ){}
    distanceFrom(position:Position) {
        return {
            rank: Math.abs(position.rank - this.rank),
            file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0))
        }
    }
}
// a chess piece
abstract class Piece { // abstract means you can't instantiate the class directly
    protected position: Position
    constructor(
        private readonly color: Color,
        file: File,
        rank: Rank
    ) {
        this.position = new Position(file, rank)
    }
    moveTo(position: Position) {  // a default implementation, subclass can override
        this.position = position
    }
    abstract canMoveTo(position: Position): boolean // need to implement in subclass
}

// six types of pieces
class King extends Piece {
    canMoveTo(position: Position) {
        let distance = this.position.distanceFrom(position)
        return distance.rank < 2 && distance.file < 2
    }
}
class Queen extends Piece {}
class Bishop extends Piece {}
class Knight extends Piece {}
class Rook extends Piece {}
class Pawn extends Piece {}

// a chess game
class Game {
    private pieces = Game.makePieces()
    private static makePieces() {
        return [
            // Kings
            new King('White', 'E', 1),
            new King('Black', 'E', 8),

            // Queens
            new Queen('White', 'D', 1),
            new Queen('Black', 'D', 8),

            // Bishops
            new Bishop('White', 'C', 1),
            new Bishop('White', 'F', 1),
            new Bishop('Black', 'C', 8),
            new Bishop('Black', 'F', 8),
            // ...
        ]
    }
}

// es feature

// class keyword for class declaration, constructor function, instance member and class member(with static)
// field declaration in constructor body
// shorthand for constructor function

// extends keyword for inheritance, super() for call super constructor, super for access superclass properties
// you need setup constructor properly, call super() first
// inheritance is limitly useful, used to inherit Error

// ts feature

// private protected public visibility modifiers
// property initializers
// abstract class

// this can be used both as value and type, return this, annotate this as return type
// this can be useful for annotating method's return types
// easy for subclass to share implementation for some method



// interface

// like aliases, interfaces are a way to name a type so you don't have to define it inline.
// they are mostly two syntaxes for the same thing

interface Food {
    calories: number
    tasty: boolean
}

interface Sushi extends Food { // _interface can extend any shape_: an object type, a class, or another interface
    salty: boolean
}

interface Cake extends Food {
    sweet: boolean
}

// type Food = {
//     calories: number
//     tasty: boolean
// }

// type Sushi = Food & {
//     salty: boolean
// }

// type Cake = Food & {
//     sweet: boolean
// }


// differences

// 1
// type aliases are more general, in that their righthand side can be any type,
// including a type expression(a type, and maybe some type operators like & or |)
// for interface, the righthand side must be a shape

type A = number
type B = A | number

// 2
// when extends an interface, ts will make sure that the property of the interface you're extending
// is assignable to your extension property of the same name
// as to intersection, ts will do its best to combine your extension with the type it's extending,
// resulting in an overloaded signature for same name

interface AA {
    good(x: number): string
    bad(x: number): string
}
interface BB extends AA { // error
    bad(x: string): string
}

// 3
// multiple interfaces wiht the same name in the same scope are automatically merged;
// multiple type aliases with the same name in the same scope will throw a compile-time error.
// declaration merging // enums namespaces interfaces
// two interface can't confilict

interface User {
    age: string
  }
  
interface User {
    age: number  // Error TS2717: Subsequent property declarations must have
} 

interface User<Age extends number> {  // Error TS2428: All declarations of 'User'
    age: Age                            // must have identical type parameters.
}

interface User<Age extends string> {
    age: Age
}

// implements

// interface can declare instance properties, but they can't declare visibility modifiers
// and no static member

interface Animal {
    readonly name: string
    eat(food: string): void
    sleep(hours: number): void
  }
  
  interface Feline {
    meow(): void
  }
  
  class Cat implements Animal, Feline {
    name = 'Whiskers'
    eat(food: string) {
      console.info('Ate some', food, '. Mmm!')
    }
    sleep(hours: number) {
      console.info('Slept for', hours, 'hours')
    }
    meow() {
      console.info('Meow')
    }
  }

// an interface is a way to model a shape
// at the value level, that means an object, array, function, class, class instance
// interface do not emit javascript code and only exist at compile time

// classes are structurally typed
// a class is compatible with any other type that shares its shape, including
// a regular old object that defines the same properits or methods as the class
// (you don't need to new C() to create a instance of C)

// and js don't need inheritance to setup subtyping relationship

// class declare both values and types

// type and values are namespaced separately in ts. depending on how you use
// a term, ts knows whether to resolve it to a type or to a value

// class and enums are special. they are unique because they generate both a type
// in the type namespace and a value in the value namespace

class C {}
let c: C = new C()
enum E {F, G}
let e: E = E.F // first used as type, then used as value


// typeof 
// a: value-level
// type of value in string, null ==> 'object' funciton ==> 'funciton'
let h = typeof c

// b: type-level
type i = typeof c


  type State = {
    [key: string]: string
  }
  
  class StringDatabase {
    
    constructor(public state: State = {}){}
    get(key: string): string | null {
      return key in this.state ? this.state[key] : null
    }
    set(key: string, value: string): void {
      this.state[key] = value
    }
    static from(state: State) {
      let db = new StringDatabase
      for (let key in state) {
        db.set(key, state[key])
      }
      return db
    }
  }

  // the type StringDatabase class generate
  interface StringDatabase {
    state: State
    get(key: string): string | null
    set(key: string, value: string): void
  }

  // the type StringDatabase itself
  interface StringDatabaseConstructor {
    new(state?: State): StringDatabase
    from(state: State): StringDatabase
  }


  // generic

  class MyMap<K, V> { // class level type parameters
    constructor(initialKey: K, initialValue: V) { // constructor use class-level generic
      // ...
    }
    get(key: K): V { 
      // ...
    }
    set(key: K, value: V): void {
      // ...
    }
    merge<K1, V1>(map: MyMap<K1, V1>): MyMap<K | K1, V | V1> {  // instance methods have access to
      // ...                                                    // class-level generic, and can also
    }                                                           // declare their own
    static of<K, V>(k: K, v: V): MyMap<K, V> {  // static methods do not have access to class's generic
      // ...
    }
  }

  // you can bind concrete types to generic explicitly, or let ts infer

  let map1 = new Map([['a' ,1]])
  let map2: Map<string, number> = new Map([['a' ,1]])
  let map3 = new Map<string, number>([['a' ,1]])




// mixin

// decorator

// simulating final class

// factory pattern

// builder pattern


// what inheritance used for

// 1 share code(subclass doedn't need to override method) <===> function operating on value object(doesn't need methods) with a specific shape(generic function)
// 2 create subclass relationship (js doesn't need)



// enum
// like class create both a type and a vlaue
// enum support declaration merging

enum Language {
  English = 0, // the value of each member can be number or string
  Spanish = 1,
  Chinese = 2
}

let lan = Language.English // compile to `let lan = 0`
// better not use this
let lan1 = Language['Spanish'] // you can access member use object access syntax
// avoid this
let lan2 = Language[2]
let lan3 = Language[6] // problems !!


const enum Animals {  // const enum doesn't let you do reverse lookups
  Dogs = 0,
  Cats = 1
}

// you need to configure ts to support const enum compile output
// preserveConstEnums 

// all numbers can assign to number enums

// ts's assignability rules

// all the pitfalls that come with using enums safely, i recommend you stay away
// from them

// enum is a way to give pretty name to number and string
//  used for golbal things, like error no

// union of literal value is like refinement type
// used for constrait the value of some name

class P {
  protected constructor(public h: string) {}
}


class X extends P {
  constructor(public h: string, public x: string) {super(h)}
  hell() {
    new P('g')
  }
}