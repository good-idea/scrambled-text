import { useEffect, useReducer } from 'react'
import { scramble, ScrambleOptions } from '../scramble'
import { useStopwatch } from './useStopwatch'

export interface UseScrambledTextConfig {
  config?: Partial<ScrambleOptions>
  /* if true, cycles through random text for the duration,
   * progressively revealing the initial text.
   * default: true */
  running?: boolean
  /* The interval at which the text should be re-scrambled, in MS
   * default: 30 */
  interval?: number
  /* The total duration of the "scrambling", in MS.
   * default: 3000 */
  duration?: number
  debug?: boolean
}

interface ReducerState {
  currentText: string
  progress: number
}

interface Action {
  type: typeof TICK
  newText: string
  progress: number
}

const TICK = 'TICK'

const reducer = (state: ReducerState, action: Action): ReducerState => {
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

interface UseScrambledTextState extends ReducerState {
  elapsed: number
}

export const useScrambledText = (
  text: string,
  options: UseScrambledTextConfig,
): UseScrambledTextState => {
  const {
    running: customRunning,
    interval: customInterval,
    duration: customDuration,
    config,
  } = options
  const duration = customDuration || defaults.duration
  const running = customRunning !== undefined ? customRunning : defaults.running
  const interval = customInterval || defaults.interval

  const { elapsed } = useStopwatch(running, { interval })

  const [state, dispatch] = useReducer(reducer, {
    currentText: scramble(text, config),
    progress: 0,
  })

  useEffect(() => {
    if (elapsed === 0) return
    if (config && config.amount !== undefined) return
    const progress = elapsed / duration
    const newText = scramble(text, {
      ...config,
      amount: 1 - progress,
      previousText: state.currentText,
    })
    dispatch({ type: TICK, progress, newText })
  }, [elapsed])

  return { ...state, elapsed }
}
