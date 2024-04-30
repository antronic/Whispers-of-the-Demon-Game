import { useRef, useState } from 'react'

export type GameConfig = {
  enemyHp: number
}

export type Hero = {
  signalr_id: string
  avatar_url: string
  name: string
  action: 'attack' | 'defend' | 'idle' | 'hit'
}

export const useGame = (config: GameConfig) => {
  const [heros, setHeros] = useState<Hero[]>([
    { signalr_id: '1', avatar_url: '/images/characters/hero-1.png', name: 'Aren', action: 'idle'},
    { signalr_id: '2', avatar_url: '/images/characters/hero-2.png', name: 'Mary', action: 'idle'},
  ])

  const enemyMaxHp = useRef<number>(config.enemyHp)
  const [enemyHp, setEnemyHp] = useState(config.enemyHp)
  const [enemyStatus, setEnemyStatus] = useState<'idle' | 'attack' | 'defeat' | 'hit'>('idle')

  // Attack enemy
  const attack = (hero: Hero, damage: number) => {
    if (enemyHp <= 0) {
      setEnemyStatus('defeat')
      return
    }

    updateHeroAction(hero, 'attack')

    setTimeout(() => {
      setEnemyStatus('hit')
      setEnemyHp(enemyHp - damage)
    }, 500)

    // Reset hero action
    setTimeout(() => {
      updateHeroAction(hero, 'idle')
    }, 500)

    // Reset enemy status
    setTimeout(() => {
      setEnemyStatus('idle')
    }, 1000)
  }

  // Add hero to the list
  const addHero = (hero: Hero) => {
    setHeros([...heros, hero])
  }

  const removeHero = (hero: Hero) => {
    setHeros(heros.filter((h) => h.signalr_id !== hero.signalr_id))
  }

  const updateHeroAction = (hero: Hero, action: Hero['action']) => {
    setHeros(heros.map((h) => {
      if (h.signalr_id === hero.signalr_id) {
        return {
          ...h,
          action,
        }
      }
      return h
    }))
  }

  return {
    heros,
    addHero,
    removeHero,
    attack,
    enemyStatus,
    enemyMaxHp,
    enemyHp,
  }
}