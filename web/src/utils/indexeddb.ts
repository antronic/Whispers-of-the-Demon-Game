let db: IDBDatabase | null = null

export const initialize = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('game', 4)

    request.onerror = (event) => {
      console.error('Failed to open indexedDB', event)
      reject(event)
    }

    request.onsuccess = (event) => {
      db = request.result
      resolve(event)
    }

    request.onupgradeneeded = (event) => {
      // db = event.target.result
      // db.createObjectStore('characters', { keyPath: 'id' })
      // db.createObjectStore('items', { keyPath: 'id' })
      // db.createObjectStore('user', { keyPath: 'id' })
    }
  })
}

export type Hero = {
  avatar_url: string
  name: string
}

export const addNewHero = (_hero: Hero) => {
  const hero = db!.transaction('heroes', 'readwrite')
  const objStore = hero.objectStore('heroes')

  const objStoreReq = objStore.add(_hero)

  objStoreReq.onsuccess = (event) => {
    console.log('Hero added', event)
    console.log(_hero)
    console.log('Hero added', objStoreReq.result)
  }
}