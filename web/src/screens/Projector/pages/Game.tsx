import React from 'react'
import Hero from '@app/components/Game/Hero'

export const MainStage: React.FC = () => {

  return (
    <>
      <div className="h-full w-full fixed top-0 left-0 z-[-1] projector-bg bg-invert"/>
      <div className="w-full p-4 relative">
        <div className="z-20 relative w-full h-full flex items-center">
          {/* Enemy */}
          <div className="flex-shrink-0">
            <img src="/images/characters/monster-1.png" alt="enemy" className="w-full"/>
          </div>

          {/* Heros */}
          <div className="flex justify-center h-full">
            <div className="grid grid-cols-6 gap-x-4 gap-y-4" dir="rtl">
              <Hero
                imgUrl="/images/characters/hero-1.png"
                action="attack"
                name="Aren"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-full absolute z-10 top-0 left-0 projector-bg grayscale-[100%]"/>
      </div>
    </>
  )
}

export default MainStage