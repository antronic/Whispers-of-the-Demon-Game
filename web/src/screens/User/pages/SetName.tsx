import { useEffect, useState } from 'react'

import { Button } from '@app/components/common/UI.tsx'
import { useUiStore } from '@app/store/ui'
import AnimateText from '@app/components/AnimateText'
import * as Api from '@app/utils/api'
import useSingalR from '@app/utils/useSignalR'
import { AppStorage } from '@app/utils/storage'
import { InlineIcon } from '@iconify/react/dist/iconify.js'

const SetNamePage = () => {
  const [page, setPage] = useUiStore((s) => [s.userPage, s.setUserPage])

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [isSet, setIsSet] = useState(false)
  const [generatedName, setGeneratedName] = useState<string | null>(null)
  const signal = useSingalR<any>('GENERATED_NAME')

  useEffect(() => {
    if (signal.message) {
      setGeneratedName(JSON.parse(signal.message).message)
      setIsLoading(false)
      setIsSet(true)
    }
  }, [signal.message])

  const generateName = async () => {
    const data = await Api.generateName(name)
  }

  const onOkClick = () => {
    setIsLoading(true)
    generateName()
  }

  const onChangeClick = () => {
    signal.reset()
    setIsSet(false)
    setGeneratedName(null)
  }

  const onThinkAgainClick = () => {
    signal.reset()
    generateName()
    setIsLoading(true)
  }

  const onGoodToMeClick = () => {
    AppStorage.set('USER', { name: generatedName })
    setPage('CHARACTER')
  }

  // If loading
  if (isLoading) {
    return (
      <div>
        <div className="text-3xl text-shadow inline-block">
          <AnimateText text="Loading..." speed={20}/>
        </div>
      </div>
    )
  }

  // If the generated name is set
  if (isSet) {
    return (
      <div>
        <div className="text-3xl text-shadow mb-2">
          <AnimateText text={`Ok, let me call you, ${generatedName}`} speed={20}/>
        </div>

      <div className="w-full h-px bg-slate-50 mt-2 mb-4"></div>

      <div className="grid lg:grid-cols-3 gap-x-4 gap-y-2">
        <Button className="!bg-orange-500 !text-black flex justify-center items-center gap-x-2" onClick={onChangeClick}>
          <InlineIcon icon={'pixelarticons:edit'} />
          Change it
        </Button>
        <Button className="!bg-blue-600 flex justify-center items-center gap-x-2" onClick={onThinkAgainClick}>
          <InlineIcon icon={'pixelarticons:reload'} />
          Think again
        </Button>
        <Button className="flex justify-center items-center gap-x-2" onClick={onGoodToMeClick}>
          <InlineIcon icon={'pixelarticons:check'} />
          <span>Good to me!</span>
        </Button>
      </div>
      </div>
    )
  }

  // Default page
  return (
    <div>
      <div className="text-3xl text-shadow mb-2">
        <AnimateText text="What do the people in your world call you?" speed={20}/>
      </div>
      <p className="text-xl">
        Your name:
      </p>

      <input
        className={`
          w-full px-2 py-1 input-text focus:outline-none mb-2
        `}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Next button */}
      <Button disabled={name === ''} className="mt-2" onClick={onOkClick}>
        OK
      </Button>
    </div>
  )
}

export default SetNamePage