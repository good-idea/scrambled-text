import * as React from 'react'
import * as lolex from 'lolex'
import { act, wait, render } from '@testing-library/react'
import { ScrambledText } from '../react'

jest.useFakeTimers()

describe('ScrambledText', () => {
  it('should render scrambled text', async () => {
    const text = 'i love frank'
    const { container } = render(<ScrambledText text={text} />)

    expect(container.textContent.length).toBe(text.length)
  })

  it('should display new scrambled text at intervals', async () => {
    const text = 'i love frank'
    const { container } = render(<ScrambledText text={text} />)
    // expect(a).toBe(b)
    const text1 = container.textContent
    act(() => jest.advanceTimersByTime(100))
    const text2 = container.textContent
    expect(text1).not.toBe(text2)
  })

  it('should not cycle through new scrambled text when running === false', async () => {
    const text = 'i love frank'
    const { container } = render(<ScrambledText running={false} text={text} />)

    const text1 = container.textContent
    act(() => jest.advanceTimersByTime(100))
    const text2 = container.textContent
    expect(text1).toBe(text2)
  })

  it('should render the completed text at the given intervals', async () => {
    const text = 'i love frank'
    const { container } = render(<ScrambledText interval={100} text={text} />)
    const text1 = container.textContent
    act(() => jest.advanceTimersByTime(90)) // -> 90ms
    expect(container.textContent).toBe(text1)
    act(() => jest.advanceTimersByTime(60)) // -> 150ms

    const text2 = container.textContent
    expect(text2).not.toBe(text1)
    act(() => jest.advanceTimersByTime(40)) // -> 190ms
    expect(container.textContent).toBe(text2)

    act(() => jest.advanceTimersByTime(15)) // -> 205ms
    expect(container.textContent).not.toBe(text2)
  })

  it('should progressively display "unscrambled" text for the entire duration', async () => {
    const clock = lolex.install()
    const text = 'abcd'
    const config = {
      sequential: true,
    }
    const { container } = render(
      <ScrambledText
        interval={100}
        duration={400}
        text={text}
        config={config}
      />,
    )

    expect(container.textContent).not.toMatch(/^a/)

    /* Advance 100ms, should show only 1 correct character */
    act(() => {
      clock.tick(100)
    })
    await wait()

    expect(container.textContent).toMatch(/^a/)
    expect(container.textContent).not.toMatch(/^ab/)

    /* Advance 100ms, should show only 2 correct characters */
    act(() => {
      clock.tick(100)
    })
    await wait()

    expect(container.textContent).toMatch(/^ab/)
    expect(container.textContent).not.toMatch(/^abc/)

    /* Advance 100ms, should show only 3 correct character */
    act(() => {
      clock.tick(100)
    })
    await wait()

    expect(container.textContent).toMatch(/^abc/)
    expect(container.textContent).not.toMatch(/^abcd/)

    /* Advance 100ms, should show all 4 correct characters */
    act(() => {
      clock.tick(100)
    })
    await wait()

    expect(container.textContent).toMatch(/^abcd$/)
    clock.uninstall()
  })

  it('should use a custom Wrapper (tag)', async () => {
    const text = 'i love frank'
    const { container } = render(<ScrambledText text={text} wrapper="h1" />)
    expect(container.querySelector('h1')).toBeTruthy()
    expect(container.textContent.length).toBe(text.length)
  })

  it('should use a custom Wrapper (component)', async () => {
    const text = 'i love frank'
    const MyComponent = ({ children }: { children: React.ReactNode }) => (
      <section>
        <h2>{children}</h2>
      </section>
    )
    const { container } = render(
      <ScrambledText text={text} wrapper={MyComponent} />,
    )
    expect(container.querySelector('section')).toBeTruthy()
    expect(container.querySelector('h2')).toBeTruthy()
    expect(container.textContent.length).toBe(text.length)
  })
})
