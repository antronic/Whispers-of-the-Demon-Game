import { useState } from 'react'

import { Button } from '@app/components/common/UI.tsx'
import { useUiStore } from '@app/store/ui'
import AnimateText from '@app/components/AnimateText'

const SetNamePage = () => {
  const [page, setPage] = useUiStore((s) => [s.userPage, s.setUserPage])

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [isSet, setIsSet] = useState(false)
  const [generatedName, setGeneratedName] = useState<string|null>(null)

  const onNext = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSet(true)
      setGeneratedName('Dominic')
    }, 2000)
  }

  const onChangeClick = () => {
    setIsSet(false)
    setGeneratedName(null)
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

      <div className="w-full h-px bg-slate-50 my-2"></div>

      <div className="flex gap-x-4">
        <Button className="!bg-orange-500 !text-black" onClick={onChangeClick}>Change it</Button>
        <Button>Next</Button>
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
          w-full px-2 py-1 input-text focus:outline-none
        `}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Next button */}
      <Button onClick={onNext}>
        Next
      </Button>
    </div>
  )
}

export default SetNamePage