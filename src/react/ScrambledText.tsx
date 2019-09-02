import * as React from 'react'
import { scramble, ScrambleOptions } from './scramble'

const { useState, useEffect, useMemo } = React

interface ScrambledTextProps {
  /* The text to be scrambled */
  text: string
  /* if true, cycles through random text for the duration,
   * progressively revealing the initial text.
   * default: true */
  running?: boolean
  /* Config for the scrambler */
  config?: Partial<ScrambleOptions>
  /* The interval at which the text should be re-scrambled, in MS
   * default: 50 */
  interval?: number
  /* The total duration of the "scrambling", in MS.
   * default: 3000 */
  duration?: number
}

const defaults = {
  interval: 50,
  duration: 3000,
}

export const ScrambledText = ({
  text,
  config,
  running,
  interval,
  duration,
}: ScrambledTextProps) => {
  // const initialTime = useMemo(() => new Date().getTime(), [])
  const [initialTime] = useState(new Date().getTime())
  // console.log(initialTime)
  const [currentText, setCurrentText] = useState(scramble(text, config))

  useEffect(() => {
    /** Don't refresh with new values if running is false,
     * or if the user is supplying their own 'amount' for the config */
    if (running === false) return
    if (config && config.amount !== undefined) return
    const timeoutId = setTimeout(() => {
      const elapsed = new Date().getTime() - initialTime
      const amount = 1 - Math.min(1, elapsed / (duration || defaults.duration))
      setCurrentText(
        scramble(text, { ...config, amount, previousText: currentText }),
      )
    }, interval || defaults.interval)
    return () => clearTimeout(timeoutId)
  }, [currentText])

  return <span>{currentText}</span>
}
