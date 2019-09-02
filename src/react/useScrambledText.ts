import { useEffect, useReducer } from 'react'
import { scramble, ScrambleOptions } from '../scramble'

export interface ScrambledTextParams {
  /* The text to be scrambled */
  text: string
  /* if true, cycles through random text for the duration,
   * progressively revealing the initial text.
   * default: true */
  running?: boolean
  /* Config for the scrambler */
  config?: Partial<ScrambleOptions>
  /* The interval at which the text should be re-scrambled, in MS
   * default: 30 */
  interval?: number
  /* The total duration of the "scrambling", in MS.
   * default: 3000 */
  duration?: number
}

const defaults = {
  interval: 30,
  duration: 10000,
}

interface State {
  initialTime: number
  currentText: string
  progress: number
}

interface Action {
  type: string
  newText?: string
  progress?: number
}

const TICK = 'TICK'

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case TICK:
      return {
        ...state,
        currentText: action.newText || state.currentText,
        progress: action.progress || state.progress,
      }

    default:
      return state
  }
}

export const useScrambledText = ({
  text,
  config,
  running,
  interval,
  duration,
}: ScrambledTextParams): State => {
  const [state, dispatch] = useReducer(reducer, {
    initialTime: new Date().getTime(),
    currentText: scramble(text, config),
    progress: 0,
  })

  const { currentText, progress, initialTime } = state

  useEffect(() => {
    /** Don't refresh with new values if running is false,
     * or if the user is supplying their own 'amount' for the config */
    if (running === false) return () => undefined
    if (config && config.amount !== undefined) return () => undefined
    const timeoutId = setTimeout(() => {
      const elapsed = new Date().getTime() - initialTime
      const progress =
        1 - Math.min(1, elapsed / (duration || defaults.duration))
      const newText = scramble(text, {
        ...config,
        amount: progress,
        previousText: currentText,
      })
      dispatch({ type: TICK, newText, progress })
    }, interval || defaults.interval)
    return () => clearTimeout(timeoutId)
  }, [currentText, progress, initialTime])

  return state
}
