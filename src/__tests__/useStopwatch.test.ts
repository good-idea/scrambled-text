import lolex from 'lolex'
import { act, renderHook } from '@testing-library/react-hooks'
import { wait } from '@testing-library/react'
import { useStopwatch } from '../react/useStopwatch'

let clock
beforeEach(() => {
  clock = lolex.install()
})

afterEach(() => {
  clock.uninstall()
})

const tick = async (amt: number = 100) => {
  act(() => {
    clock.tick(amt)
  })
  await wait()
}

describe('useStopwatch', () => {
  it('should return an "elapsed" number', async () => {
    const { result } = renderHook(() => useStopwatch(true))
    expect(result.current.elapsed).toBeGreaterThanOrEqual(0)
  })

  it('should return the correct elapsed time', async () => {
    const { result } = renderHook(() => useStopwatch(true, { interval: 100 }))
    expect(result.current.elapsed).toBe(0)
    await tick(100)
    expect(result.current.elapsed).toBe(100)
    await tick(100)
    expect(result.current.elapsed).toBe(200)
    await tick(100)
    await tick(100)
    await tick(100)
    expect(result.current.elapsed).toBe(500)
  })

  it('should start and stop the counter according to "running"', async () => {
    const defaultConfig = {
      interval: 100,
    }
    const { result, rerender } = renderHook(
      (running: boolean = true, config: any = defaultConfig) =>
        useStopwatch(running, config),
    )
    expect(result.current.elapsed).toBe(0)
    await tick(100)
    expect(result.current.elapsed).toBe(100)

    /* Stop the timer */
    rerender(false)
    await tick(100)
    expect(result.current.elapsed).toBe(100)
    await tick(100)
    expect(result.current.elapsed).toBe(100)

    /* Restart the timer */
    rerender(true)
    await tick(100)
    expect(result.current.elapsed).toBe(200)
  })
})
