import React, { useEffect, useState } from 'react'
import AnimateText from '@app/components/AnimateText'
import { Button } from '@app/components/common/UI'
import * as Api from '@app/utils/api'
import useSignalR from '@app/utils/useSignalR'

export const CharacterPage = () => {
  const signarR = useSignalR<any>('GENERATED_AVATAR')
  const [prompt, setPrompt] = useState<string>('')
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (signarR.message) {
      // console.log('Generated avatar:', signarR.message.message)
      preloadImage(JSON.parse(signarR.message).message)

    }
  }, [signarR.message])

  const onCreateClick = () => {
    Api.generateAvartar(prompt)
    setIsLoading(true)
  }

  const preloadImage = (url: string) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      setImgUrl(url)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="text-3xl text-shadow inline-block">
          <AnimateText text="DALL-E is drawing..." speed={20}/>

          <div className="animate-pencilWriting flex justify-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M18 2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2H2v6h6v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h-2V4h-2zm0 8h-2v2h-2v2h-2v2h-2v2H8v-2H6v-2h2v-2h2v-2h2V8h2V6h2v2h2zM6 16H4v4h4v-2H6z"></path></svg>
          </div>
        </div>
      </div>
    )
  }

  if (imgUrl) {
    return (
      <div className="p-4">
        <div className="relative">

          <img src={imgUrl} alt="avatar" className={`w-full z-10 relative rounded-full ${imgUrl && 'animate-shake'}`}/>
          <div className={`absolute top-0 left-0 w-full h-full z-0 bg-amber-200 rounded-full ${imgUrl && 'animate-zoomInAndFadeOut'}`}/>
        </div>

        <p className="text-3xl mt-6 mb-4 py-4 text-center bg-zinc-800">
          <AnimateText text={prompt}/>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-3xl text-shadow mb-2">
        <AnimateText text="Describe your character" />
      </div>

        <input
        className={`
          w-full px-2 py-1 input-text focus:outline-none mb-2
        `}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

        {/* Minecraft button */}
        <Button onClick={onCreateClick}>
          Create
        </Button>
    </div>
  )
}

export default CharacterPage