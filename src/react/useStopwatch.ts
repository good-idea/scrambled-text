import { useEffect, useReducer } from 'react'

interface State {
  startTime: number | undefined
  elapsed: number
  previouslyElapsed: number
}

interface UseStopwatchOptions {
  interval: number
}

// interface UseStopwatchArguments {
//   running: boolean
// }

interface UseStopwatchValues {
  elapsed: number
}

const START = 'START'
const STOP = 'STOP'
const RESTART = 'RESTART'
const TICK = 'TICK'

interface StartAction {
  type: typeof START
}

interface StopAction {
  type: typeof STOP
}

interface RestartAction {
  type: typeof RESTART
}

interface TickAction {
  type: typeof TICK
}

type Action = StartAction | StopAction | RestartAction | TickAction

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case RESTART:
    case START:
      return {
        ...state,
        startTime: new Date().getTime(),
      }
    case STOP:
      return {
        ...state,
        previouslyElapsed: state.elapsed,
        startTime: undefined,
      }
    case TICK:
      const elapsed =
        new Date().getTime() - state.startTime + state.previouslyElapsed
      return {
        ...state,
        elapsed,
      }
    default:
      return state
  }
}

const defaultConfig = {
  interval: 30,
}

export const useStopwatch = (
  running: boolean,
  userConfig?: Partial<UseStopwatchOptions>,
): UseStopwatchValues => {
  const config: UseStopwatchOptions = {
    ...defaultConfig,
    ...userConfig,
  }

  const { interval } = config

  const [state, dispatch] = useReducer(reducer, {
    startTime: undefined,
    elapsed: 0,
    previouslyElapsed: 0,
  })
  const { elapsed } = state

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: TICK })
    }, interval)
    if (!running) {
      dispatch({ type: STOP })
      clearTimeout(timeoutId)
    }
    if (running && state.startTime === undefined) {
      dispatch({ type: START })
    }

    return () => clearTimeout(timeoutId)
  }, [running, elapsed])

  return { elapsed }
}
