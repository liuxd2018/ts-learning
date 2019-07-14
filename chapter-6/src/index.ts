// an existing user that we got from the server
type ExistingUser = {
    id: number,
    name: string
}
// a new user that hasn't been saved to the server yet
type NewUser = {
    name: string
}

function deleteUser(user: {id?: number, name: string}) {
    delete user.id
}

let existingUser: ExistingUser = {
    id: 123456,
    name: 'Ima'
}

deleteUser(existingUser)


// safety issue

let id = existingUser.id // this is wrong

// ts is not designed to be perfectly safe; instead, its type system
// tries to strike a balance between catching real mistakes and being
// easy to use, without you needing to get a degree in programming language
// theory to understand why something is an error.

// destructive updates(like deleting a property) are relatively rare in practice


type LegacyUser = {
    id?: number | string,
    name: string
}

let legacyUser: LegacyUser = {
    id: '123456',
    name: 'Xin'
}

deleteUser(legacyUser) // ts error


// refinement

// possible values a CSS unit can have
type Unit = 'cm' | 'px' | '%'

// check each unit, and return null if there is no match
let units: Unit[] = ['cm', 'px', '%']
function parseUnit(value: string): Unit | null {
    for(let i = 0; i < units.length; i++) {
        if(value.endsWith(units[i])) {
            return units[i]
        }
    }
    return null
}
type Width = {
    unit: Unit,
    value: number
}

function parseWidth(width: number | string | null | undefined): Width | null {
    // if width is null or undefined, return early
    if(width == null) {
        return null
    }
    // if width is a number, default to pixels
    if(typeof width === 'number') {
        return {unit: 'px', value: width}
    }
    // try to parse a unit
    let unit = parseUnit(width)
    if(unit) {
        return {unit, value: parseFloat(width)}
    }
    // other wise return null
    return null
}

// totality

type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

function getNextDay(w: Weekday): Day {
    switch(w) {
        case 'Mon' : return 'Tue'
    }
}


// keyin

type APIResponse = {
    user: {
      userId: string
      friendList: {
        count: number
        friends: {
          firstName: string
          lastName: string
        }[]
      }
    }
  }

  type FriendList = APIResponse['user']['friendList']

  type Friend = FriendList['friends'][number]

  type v = keyof {a: number}


let nextDay: {[K in Weekday]: Day} = {
    Mon: 'Tue'
}

type Record<K extends keyof any, T> = {
    [P in K]: K
}


type Account = {
    id: number
    isEmployee: boolean
    notes: string[]
  }
  
  // Make all fields optional
  type OptionalAccount = {
    [K in keyof Account]?: Account[K] 
  }
  
  // Make all fields nullable
  type NullableAccount = {
    [K in keyof Account]: Account[K] | null 
  }
  
  // Make all fields read-only
  type ReadonlyAccount = {
    readonly [K in keyof Account]: Account[K] 
  }
  
  // Make all fields writable again (equivalent to Account)
  type Account2 = {
    -readonly [K in keyof ReadonlyAccount]: Account[K] 
  }
  
  // Make all fields required again (equivalent to Account)
  type Account3 = {
    [K in keyof OptionalAccount]-?: Account[K] 
  }



  type Dialog = {
    id?: string
  }
  
  function closeDialog(dialog: Dialog) {
    if (dialog.id) {
        setTimeout(() => // this arrow function create a new scope, invalidates the refinement we made
        removeFromDOM(
          dialog,
          document.getElementById(dialog.id!)! // dialog.id don't carry over
        ), 10
      )
    } else {
        return
    }
    
  }
  
  function removeFromDOM(dialog: Dialog, element: Element) {
    element.parentNode!.removeChild(element)
    delete dialog.id
  }


type Exclusive<T, U> = Exclude<T, U> | Exclude<U, T>

type A = Exclusive<1|2|3, 2|3|4>
