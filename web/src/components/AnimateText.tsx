import { useEffect, useState } from 'react'

interface IAnimateText {
  text: string
  speed?: number
}

export const AnimateText: React.FC<IAnimateText> = ({ text: fullText, speed }) => {
    const [text, setText] = useState('')
    const [index, setIndex] = useState(0)
    const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setIndex(0)
    setText('')
    setIsDone(false)
  }, [speed, fullText])

    useEffect(() => {
        const timeout = setTimeout(() => {
          if (index >= fullText.length + 1) {
            setIsDone(true)
            clearTimeout(timeout)
            return
          }

          const _text = fullText.slice(0, index)
          setText(_text)
          setIndex((index) => index + 1)
        }, speed || 20)

        return () => {
          clearTimeout(timeout)
        }
    }, [index])

    return (
        <div className="typing-effect">
            {text}
            { !isDone && <span className="cursor">|</span>}
        </div>
    )
}

export default AnimateText