import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'

import AnimateText from '@app/components/AnimateText'
import { Button } from '@app/components/common/UI'
import * as Api from '@app/utils/api'
import useSignalR from '@app/utils/useSignalR'
import { AppStorage } from '@app/utils/storage'
import { useUiStore } from '@app/store/ui'

export const CharacterPage = () => {
  const signarR = useSignalR<any>('GENERATED_AVATAR')
  const [prompt, setPrompt] = useState<string>('')
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  // const [imgUrl, setImgUrl] = useState<string | null>('https://herograveyard.azureedge.net/isekai-avatar/-hsr6ATUzUcOnnaQpjgaowi8Fs8wu02.png')
  const [isLoading, setIsLoading] = useState(false)
  const [imgAnimate, setImgAnimate] = useState(false)
  const [isImgLoaded, setIsImgLoaded] = useState(false)

  const user = useRef(AppStorage.get('USER').json<{ name: string }>())
  const timeout = useRef<number>()
  const apiTimeout = useRef<number>()
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useUiStore((s) => [s.userPage, s.setUserPage])



  useEffect(() => {
    if (signarR.message) {
      // Clear the API timeout
      clearTimeout(apiTimeout.current)

      preloadImage(JSON.parse(signarR.message).message)

    }
  }, [signarR.message])

  const onCreateClick = () => {
    setIsLoading(true)
    setError(null)
    Api.generateAvartar(prompt)

    // Set timeout for the API
    apiTimeout.current = setTimeout(() => {
      setIsLoading(false)
      setError('It seems that DALL-E is taking too long to respond. Please try again later.')
      clearTimeout(apiTimeout.current)
    }, 2 * 60 * 1000)
  }

  const preloadImage = (url: string) => {
    const img = new Image()
    img.src = url
    setImgUrl(url)

    img.onload = () => {
      setIsImgLoaded(true)
      setIsLoading(false)

      setImgAnimate(true)
      timeout.current = setTimeout(() => {
        setImgAnimate(false)
        clearTimeout(timeout.current)
      }, 750)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="text-3xl text-shadow inline-block">
          <AnimateText text={imgUrl ? '👍 DONE! Loading image...' : `DALL-E is drawing...`} speed={20}/>

          <div className="animate-pencilWriting flex justify-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M18 2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2H2v6h6v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h-2V4h-2zm0 8h-2v2h-2v2h-2v2h-2v2H8v-2H6v-2h2v-2h2v-2h2V8h2V6h2v2h2zM6 16H4v4h4v-2H6z"></path></svg>
          </div>
        </div>
      </div>
    )
  }

  const onAcceptClick = () => {
    // Save the avatar
    AppStorage.updateJSON('USER', { avatar: imgUrl, avatar_prompt: prompt })
    AppStorage.updateJSON('GAME_STAGE', { introdction: false })
    setPage('GAME_PROMPT')
  }

  if (isImgLoaded && imgUrl) {
    return (
      <div className="p-4">
        <div
          className="relative"
          onClick={() => {
            if (!timeout.current) {
              setImgAnimate(true)

              // Set timeout to clear the animation
              timeout.current = setTimeout(() => {
                setImgAnimate(false)
                timeout.current = undefined
              }, 500)
            }
          }}
        >

          <img
            src={imgUrl}
            alt="avatar"
            className={`w-full z-10 relative rounded-full ${imgAnimate && 'animate-shake'}`}
          />
          <div className={`absolute top-0 left-0 w-full h-full z-0 bg-amber-200 rounded-full ${imgAnimate && 'animate-zoomInAndFadeOut'}`}/>
        </div>

        <div className="text-3xl mt-6 mb-4 py-4 text-center bg-zinc-800">
          <AnimateText text={prompt}/>
        </div>

        <div className="mt-4">
          <Button onClick={onAcceptClick}>
            Cool, let's go!
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {
        error && (
          <div className="text-white bg-red-600 text-center mb-4">
            {error}
          </div>
        )
      }

      <div className="text-3xl text-shadow mb-2 flex items-center">
        <Icon icon="pixelarticons:human" width="2rem" height="2rem" className="inline mr-2"></Icon>
        <AnimateText inline={true} text={`Describe your character, ${user.current.name}`} />
      </div>

      <div className="text-xl">
        <p>Sample: I'm a pink samurai with a rainbow katana riding a unicorn.</p>
      </div>

        <input
        className={`
          w-full px-2 py-1 input-text focus:outline-none mb-2
        `}
        type="text"
        value={prompt}
        placeholder=""
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