import AnimateText from '@app/components/AnimateText'
import { AppStorage } from '@app/utils/storage'
import { useEffect, useRef, useState } from 'react'

interface IIntroductionPage {
  onDone: () => void
}

export const IntroductionPage: React.FC<IIntroductionPage> = (props) => {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)

  const user = useRef(AppStorage.get('USER').json<{ name: string }>())

  const dialouges = [
      `Hi, ${user.current.name}!`,
      'Welcome to the Whispers of the Demon world.',
      `We don't have much time to talk; we are in a very tense situation.`,
      `Monsters have suddenly invaded our village, and we must protect our people.`,
      `Please, ${user.current.name}, use your power, your Generative AI power, to defeat those monsters.`,
      'Utilize your prompt engineering skills to protect our village.',
      `Go ahead, hero ${user.current.name}! Protect our village and people! ⚔️`
    ]

  useEffect(() => {
    renderText()
  }, [index])

  function renderText() {

    setText(dialouges[index])
  }

  function nextPage() {
    if (index + 1 < dialouges.length) {
      setIndex((prev) => prev + 1)
    } else {
      AppStorage.set('GAME_STAGE', { introdction: true })
      props.onDone()
    }
  }

  return (
    <div onClick={nextPage} className="bg-black/25 -m-4 p-4">
      <div className="text-3xl text-shadow inline-block">
        <AnimateText text={text} speed={20} keepCursorBlink={true}/>
      </div>
    </div>
  )
}