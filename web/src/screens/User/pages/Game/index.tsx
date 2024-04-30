import React, { useState } from 'react'
import { Button } from '@app/components/common/UI'
import AnimateText from '@app/components/AnimateText'

const GamePage = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(true)

  const onPromptClick = () => {
    setIsLoading(true)
  }

  const onNextPromptClick = () => {
    setHasResult(false)
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="text-3xl text-shadow inline-block">
          <AnimateText text="Sending..." speed={20}/>

          <div className="animate-evelope flex justify-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M20 4H2v16h10v-2H4V6h16v6h2V4zM6 8h2v2H6zm4 4H8v-2h2zm4 0v2h-4v-2zm2-2v2h-2v-2zm0 0V8h2v2zm8 8h-2v-2h-2v-2h-2v2h2v2h-6v2h6v2h-2v2h2v-2h2v-2h2z"></path></svg>
          </div>
        </div>
      </div>
    )
  }

  if (hasResult) {
    return (
      <div className="text-center">
        <div className="text-3xl text-shadow inline-block">
          <AnimateText text="Success!" speed={20}/>
        </div>

        <div className="bg-zinc-800 mt-4 border-t-2 border-l-2 border-zinc-900 flex p-4 gap-x-4">
          <div className="flex-1">
            {/* Hero image */}
            <img src="/images/characters/hero-2.png" alt="hero" className="w-full rounded-full"/>
          </div>

          <div className="flex-1 text-left px-4 py-2 text-3xl flex flex-col justify-center items-start">
            <div className="">
              <div className="my-2">
                <p className="font-bold jersey-10">Your prompt: </p>
                <p className="">{prompt}</p>
              </div>

              <hr/>

              <div className="jersey-10 my-2">
                <p className="font-bold">
                  Damage: <span>0</span>
                </p>
              </div>

              <hr/>

              <div className="jersey-10 leading-6 my-2">
                <p className="font-bold text-blue-400">Reason:</p>
                <p className="">
                  asdfadsfasdfasdf
                </p>
              </div>

              <hr/>
              <Button
                className="mt-2 !border-black hover:!border-zinc-200"
                onClick={onNextPromptClick}
              >
                Next prompt
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex">
        <div className="w-full">
          <div className="text-3xl text-shadow mb-2">
            <p className="">
              To attack the enemy, you need to tell how do you flight the enemy.
            </p>
          </div>

          <div className="">
            <textarea
              className={`
                w-full px-2 py-1 input-text focus:outline-none
              `}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`For example: "I attack the enemy with my sword."`}
            >{prompt}</textarea>

            {/* Next button */}
            <Button className="mt-2" onClick={onPromptClick}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GamePage