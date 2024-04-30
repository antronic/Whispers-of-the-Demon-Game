import React, { useEffect, useState } from 'react'
import { Button } from '@app/components/common/UI'
import AnimateText from '@app/components/AnimateText'
import { IntroductionPage } from './Introduction'
import { AppStorage } from '@app/utils/storage'
import { generateDamage } from '@app/utils/api'
import useSignalR from '@app/utils/useSignalR'
import { convertMessageToBase64 } from '@app/utils/data'

type OpenAIChat = { role: 'user' | 'assistant', content: { message: string, damange: number, type: string } }

const GamePage = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [pageIndex, setPageIndex] = useState(AppStorage.get('GAME_STAGE').json<any>()['introdction'] === true ? 1 : 0)
  const [isShowLog, setIsShowLog] = useState(false)
  const [error, setError] = useState<any | null>(null)

  const user = AppStorage.get('USER').json<any>()
  const { message } = useSignalR('GENERATED_PALUNG')

  const [history, setHistory] = useState<OpenAIChat[]>([])

  useEffect(() => {
    const chatHistory = AppStorage.get('USER_ATTACK_CHAT').json<any>()
    if (chatHistory && chatHistory.history) {
      setHistory(AppStorage.get('USER_ATTACK_CHAT').json<any>().history)
    }
  }, [])

  useEffect(() => {
    if (history.length > 0) {
      AppStorage.updateJSON('USER_ATTACK_CHAT', { history })
    }
  }, [history])

  function addChat(role: 'user' | 'assistant', content: any) {
    setHistory([...history, { role, content }])
  }

  useEffect(() => {
    if (message) {
      const data = convertMessageToBase64(message as string)
      // console.log(data)
      // console.log(typeof data)
      // console.log(JSON.parse(data))
      try {
        const json = JSON.parse(data)
        addChat('assistant', json)
        setResult(json)
        setHasResult(true)
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setHasResult(false)
        setIsLoading(false)
      }
    }
  }, [message])

  if (pageIndex === 0)
    return <IntroductionPage onDone={() => setPageIndex(1)}/>

  const onPromptClick = async () => {
    addChat('user', prompt)
    setIsLoading(true)
    // setTimeout(() => setIsLoading(false), 2000)

    const charcter = AppStorage.get('USER').json<any>().avatar_prompt
    // const _history = history.map((item) => ({ content: item.content.message, role: item.role })).slice(0, history.length - 1)
    const _history: any[] = []
    const result = await generateDamage(prompt, charcter, _history)
    console.log('result:', result)
  }

  const onNextPromptClick = () => {
    setPrompt('')
    setError(null)
    setHasResult(false)
  }

  const viewLog = () => {
    return (
      <div className="flex flex-col gap-y-2">
        {history.map((item, index) => (
          <div key={index} className="flex gap-x-2">
            <div className="text-gray-500">{item.role}</div>
            <div>{item.content.message}</div>
          </div>
        ))}
      </div>
    )
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
            <img src={user.avatar} alt="hero" className="w-full rounded-full"/>
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
                  Damage: <span>{result['damage']}</span>
                </p>
              </div>

              <hr/>

              <div className="jersey-10 leading-6 my-2">
                <p className="font-bold text-blue-400">Reason:</p>
                <p className="">
                  {result['message']}
                </p>
              </div>

              <hr/>
              <Button
                className="mt-2 !border-black hover:!border-zinc-200"
                onClick={onNextPromptClick}
              >
                Next prompt
              </Button>

              <a href="#" onClick={() => setIsShowLog(!isShowLog)}>Toggle log</a>
            </div>
          </div>
        </div>

        {/* Chat log */}
        {
          isShowLog && (
            <div className="bg-zinc-800 mt-4 p-4">
              {viewLog()}
            </div>
          )
        }
      </div>
    )
  }

  return (
    <>
      <div className="flex">
        <div className="w-full">
          {
            error && (
              <div className="bg-red-500 text-white p-4">
                {error.message}
              </div>
            )
          }
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
              value={prompt}
            ></textarea>

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