import { scramble, ScrambleOptions } from './scramble'
import { tail } from '../utils/fp'

export const sequence = (
  text: string,
  steps: number,
  config?: Partial<ScrambleOptions>,
): string[] => {
  const counter = Array(steps).fill(undefined)

  return counter.reduce<string[]>((acc, _, index) => {
    const previousText = tail(acc)
    const amount = 1 - index / (steps - 1)
    const newText = scramble(text, {
      ...config,
      amount,
      previousText,
    })

    return [...acc, newText]
  }, [])
}
