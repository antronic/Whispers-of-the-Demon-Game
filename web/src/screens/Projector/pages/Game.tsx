import React from 'react'
import Hero from '@app/components/Game/Hero'
import { useGame } from '@app/utils/game'

type HealthBarProps = {
  maxHp: number
  hp: number
}

export const HealthBar = (props: HealthBarProps) => {
  return (
    <div className="xl:w-2/4 w-full mx-auto">
      <p className="text-shadow text-xl">Monster HP:</p>
      <div className="w-full h-8 bg-gray-800 border-gray-800 border-2">
        <div className="h-full bg-red-500 transition-all" style={{ width: `${(props.hp / props.maxHp) * 100}%` }}/>
      </div>
    </div>

  )
}

export const MainStage: React.FC = () => {
  const { heros, attack, enemyStatus, enemyMaxHp, enemyHp} = useGame({ enemyHp: 100 })

  return (
    <>
      <div className="h-full w-full fixed top-0 left-0 z-[-1] projector-bg bg-invert"/>

      <div className="w-full p-4 relative">

        <div className="z-20 relative w-full h-full">
          <div className="w-full my-4 z-50 flex-1">
            <HealthBar maxHp={enemyMaxHp.current} hp={enemyHp}/>
          </div>

          {/* Character */}
          <div className="flex items-center">
            {/* Enemy */}
            <div className={`flex-shrink-0 ${enemyStatus === 'hit' ? 'animate-shake': ''}`}>
              <img src="/images/characters/monster-1.png" alt="enemy" className="w-full"/>
            </div>

            {/* Heros */}
            <div className="flex justify-center h-full">
              <div className="grid xl:grid-cols-6 grid-cols-4 gap-x-4 gap-y-4" dir="rtl">
                {
                  heros.map((hero, index) => (
                    <div key={hero.signalr_id}>
                      <Hero
                        key={hero.signalr_id}
                        imgUrl={hero.avatar_url}
                        action={hero.action}
                        name={hero.name}
                      />
                      <button className="" onClick={() => attack(hero, 10)}>
                        Attack
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full absolute z-10 top-0 left-0 projector-bg grayscale-[100%]"/>
      </div>
    </>
  )
}

export default MainStage