import { useEffect, useReducer } from 'react'
import { scramble, ScrambleOptions } from '../scramble'
import { useStopwatch } from './useStopwatch'

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
  debug?: boolean
}

interface State {
  currentText: string
  progress: number
}

interface Action {
  type: typeof TICK
  newText: string
  progress: number
}

const TICK = 'TICK'

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case TICK:
      return {
        ...state,
        currentText: action.newText,
        progress: action.progress,
      }

    default:
      return state
  }
}

const defaults = {
  running: true,
  interval: 30,
  duration: 3000,
}

interface DebugState extends State {
  elapsed: number
}

export const useScrambledText = ({
  text,
  config,
  running: userRunning,
  interval: userInterval,
  duration: userDuration,
}: // debug,
ScrambledTextParams): DebugState => {
  const duration = userDuration || defaults.duration
  const running = userRunning !== undefined ? userRunning : defaults.running
  const interval = userInterval || defaults.interval

  const { elapsed } = useStopwatch(running, { interval })
  const [state, dispatch] = useReducer(reducer, {
    currentText: scramble(text, config),
    progress: 0,
  })

  useEffect(() => {
    if (config && config.amount !== undefined) return
    const progress = elapsed / duration
    // if (debug) console.log(interval, elapsed, progress)
    const newText = scramble(text, {
      ...config,
      amount: 1 - progress,
      previousText: state.currentText,
    })
    dispatch({ type: TICK, progress, newText })
  }, [elapsed])

  // useEffect(() => {
  //   /** Don't refresh with new values if running is false,
  //    * or if the user is supplying their own 'amount' for the config */
  //   if (running === false) return () => undefined
  //   if (config && config.amount !== undefined) return () => undefined
  //   const timeoutId = setTimeout(() => {
  //     const elapsed = new Date().getTime() - initialTime
  //     const newProgress =
  //       1 - Math.min(1, elapsed / (duration || defaults.duration))
  //     const newText = scramble(text, {
  //       ...config,
  //       amount: newProgress,
  //       previousText: currentText,
  //     })
  //     dispatch({ type: TICK, newText, progress: newProgress })
  //   }, interval || defaults.interval)
  //   return () => clearTimeout(timeoutId)
  // }, [currentText, progress, initialTime])

  return { ...state, elapsed }
}
