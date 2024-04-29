import React from 'react'
import Logo from '../Logo'

interface IFramProps {
  children: React.ReactNode
}

export const Frame: React.FC<IFramProps> = (props) => {
  return (
    <div className="w-full max-h-2/3 px-4">
      <div className="mx-auto max-h-2/3 lg:w-3/4 bg-zinc-300 px-6 py-6 border-4 border-black rounded-xl shadow-md">
        <div className="text-[3rem] text-stone-800 text-center mb-4">
          <Logo/>
        </div>

        <div className="bg-zinc-500 px-4 py-4 border-2 border-t-zinc-800 border-l-zinc-800">
          {props.children}
        </div>
      </div>
    </div>
  )
}