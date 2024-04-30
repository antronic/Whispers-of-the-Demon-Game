import { UIState } from '@app/store/ui'

const PREFIX_STORAGE = 'WOTD'

type InitialState = {
  TOKEN: string
  USER: object
  SIGNAL_R_URL: string
  SIGNAL_R_ID: string
  NAV_USER_PAGE: UIState['userPage']
  NAV_PROJECTOR_PAGE: UIState['projectorPage']
}

const initialState: InitialState = {
  TOKEN: '',
  USER: {},
  SIGNAL_R_URL: 'https://isekaisignalrhandler.azurewebsites.net',
  SIGNAL_R_ID: '',
  NAV_USER_PAGE: 'HOME',
  NAV_PROJECTOR_PAGE: 'HOME',
}

// type of initialState key
type InitialStateKey = keyof typeof initialState

// value of initialState key
type InitialStateValue = typeof initialState[InitialStateKey]

export class AppStorage {
  // Private non-static properties
  static value: string | null

  static set(key: InitialStateKey, value: InitialStateValue) {
    localStorage.setItem(`${PREFIX_STORAGE}_${key}`, value instanceof Object ? JSON.stringify(value) : String(value))
  }

  static get(key: InitialStateKey) {
    const value = localStorage.getItem(`${PREFIX_STORAGE}_${key}`)
    this.value = value

    // console.log('value', value, typeof value)

    return this
  }

  static updateJSON<T extends object>(key: InitialStateKey, value: T) {
    const currentValue = this.get(key).json<{}>()
    console.log('currentValue', currentValue, typeof currentValue)
    this.set(key, { ...currentValue, ...value })
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
        this.set(`${key}` as InitialStateKey, initialState[key as InitialStateKey])
      }
    }
  }
}