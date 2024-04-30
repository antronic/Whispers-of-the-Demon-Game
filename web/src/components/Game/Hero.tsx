import React, { useState } from 'react'

interface IHeroProps {
  imgUrl: string
  action: 'attack' | 'defend' | 'idle' | 'hit'
  name: string
}

export const Hero: React.FC<IHeroProps> = (props) => {
  const [isAttack, setIsAttack] = useState(false)

  return (
    <div className={`
      w-full
      ${props.action === 'attack' ? 'animate-attack' : ''}
    `}>
      <div className="w-full flex justify-center">
        <div className="bg-black/50 text-shadow text-xl backdrop-blur-lg px-8 py-1 mb-2">
          <p>{props.name}</p>
        </div>
      </div>
      <img src={props.imgUrl} alt="hero" className="w-full rounded-full"/>
    </div>
  )
}

export default Hero