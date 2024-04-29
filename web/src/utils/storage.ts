import { UIState } from '@app/store/ui'

const PREFIX_STORAGE = 'WOTD'

type InitialState = {
  TOKEN: string
  USER: object
  NAV_USER_PAGE: UIState['userPage']
  NAV_PAGE: UIState['page']
}

const initialState: InitialState = {
  TOKEN: '',
  USER: {},
  NAV_USER_PAGE: 'HOME',
  NAV_PAGE: 'HOME',
}

// type of initialState key
type InitialStateKey = keyof typeof initialState

// value of initialState key
type InitialStateValue = typeof initialState[InitialStateKey]

// export const Storage = {
//   set: (key: InitialStateKey, value: InitialStateValue) => {
//     localStorage
//       .setItem
//       (`${PREFIX_STORAGE}_${key}`, JSON.stringify(value))
//   }
//   ,
//   get: (key: InitialStateKey) => {
//     const value = localStorage
//       .getItem
//       (`${PREFIX_STORAGE}_${key}`)

//     // Try to parse JSON the value, value could be strigng or null, if it's not JSON format, return the value or initialState[key]
//     try {
//       return JSON.parse(value as string)
//     } catch (error) {
//       return value || initialState[key as InitialStateKey]
//     }
//   }
//   ,
//   remove: (key: InitialStateKey) => {
//     localStorage
//       .removeItem
//       (`${PREFIX_STORAGE}_${key}`)
//   },
//   setup: () => {
//     for (let key in initialState) {
//       // console.log('Setting up storage', key, initialState[key as InitialStateKey], `${PREFIX_STORAGE}_${key}`)
//       if (localStorage.getItem(`${PREFIX_STORAGE}_${key}`) === null) {
//         Storage.set(`${key}` as InitialStateKey, initialState[key as InitialStateKey])
//       }
//     }
//   }
// }

export class Storage {
  // Private non-static properties
  static value: string | null

  static set(key: InitialStateKey, value: InitialStateValue) {
    localStorage.setItem(`${PREFIX_STORAGE}_${key}`, value instanceof Object ? JSON.stringify(value) : String(value))
  }

  static get(key: InitialStateKey) {
    const value = localStorage.getItem(`${PREFIX_STORAGE}_${key}`)
    this.value = value

    console.log('value', value, typeof value)

    return this
  }

  // Format value to JSON
  static json<T>(): T {
    return JSON.parse(this.value as string)
  }

  // Format value to string
  static text<T>(): T {
    return this.value as T
  }

  static remove(key: InitialStateKey) {
    localStorage.removeItem(`${PREFIX_STORAGE}_${key}`)
  }

  static setup() {
    for (let key in initialState) {
      if (localStorage.getItem(`${PREFIX_STORAGE}_${key}`) === null) {
        Storage.set(`${key}` as InitialStateKey, initialState[key as InitialStateKey])
      }
    }
  }
}