import { useEffect, useRef, useState } from 'react'

interface IAnimateText {
  text: string
  speed?: number
  inline?: boolean
  keepCursorBlink?: boolean
  onDone?: () => void
}

export const AnimateText: React.FC<IAnimateText> = ({ text: fullText, speed, inline, keepCursorBlink, onDone }) => {
    const [text, setText] = useState('')
    const [index, setIndex] = useState(0)
    const [isDone, setIsDone] = useState(false)

    const currentText = useRef<string>(fullText)

  useEffect(() => {
    setIndex(0)
    setText('')
    setIsDone(false)
  }, [speed, fullText])

  useEffect(() => {
    if (fullText !== currentText.current) {
      currentText.current = fullText
      setIndex(0)
      setText('')
      setIsDone(false)
    }
  }, [fullText])

  useEffect(() => {
    if (isDone && onDone) {
      onDone()
    }
  }, [isDone])

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
      <div className={`typing-effect ${inline && 'inline'}`}>
          {text}
          { !isDone || keepCursorBlink && <span className="cursor animate-blink ml-1 font-bold">|</span>}
      </div>
    )
}

export default AnimateText