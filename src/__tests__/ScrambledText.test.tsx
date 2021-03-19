import * as React from 'react'
import * as lolex from 'lolex'
import { act, render } from '@testing-library/react'
import { ScrambledText } from '../react'

jest.useFakeTimers()

describe('ScrambledText', () => {
  it('should render scrambled text', async () => {
    const text = 'i love frank'
    const { container } = render(<ScrambledText text={text} />)

    expect(container.textContent.length).toBe(text.length)
  })

  it('should display new scrambled text at intervals', async () => {
    const clock = lolex.install()
    const tick = async (amt: number = 100) => {
      act(() => {
        clock.tick(amt)
      })
    }
    const text = 'i love frank'
    const { container } = render(<ScrambledText text={text} />)
    const text1 = container.textContent
    await tick(1000)
    const text2 = container.textContent
    expect(text1).not.toBe(text2)
    clock.uninstall()
  })

  it('should not cycle through new scrambled text when running === false', async () => {
    const clock = lolex.install()
    const tick = async (amt: number = 100) => {
      act(() => {
        clock.tick(amt)
      })
    }
    const text = 'i love frank'
    const { container } = render(<ScrambledText running={false} text={text} />)

    const text1 = container.textContent
    await tick(100)
    const text2 = container.textContent
    expect(text1).toBe(text2)
    clock.uninstall()
  })

  it('should progressively render the completed text at the given intervals', async () => {
    const clock = lolex.install()
    const tick = async (amt: number = 100) => {
      act(() => {
        clock.tick(amt)
      })
    }
    const text = 'abcd'
    const config = {
      sequential: true,
    }
    const { container } = render(
      <ScrambledText
        interval={100}
        duration={390}
        text={text}
        config={config}
      />,
    )
    await tick(100)
    /* 25% complete, one character should be unscrambled */
    expect(container.textContent).toMatch(/^a/)
    expect(container.textContent).not.toMatch(/^ab/)

    await tick(100)
    /* 50% complete, two characters should be unscrambled */
    expect(container.textContent).toMatch(/^ab/)
    expect(container.textContent).not.toMatch(/^abc/)

    await tick(20)
    /* 55% complete, two characters should be unscrambled */
    expect(container.textContent).toMatch(/^ab/)
    expect(container.textContent).not.toMatch(/^abc/)

    await tick(80)
    /* 75% complete, three characters should be unscrambled */
    expect(container.textContent).toMatch(/^abc/)
    expect(container.textContent).not.toMatch(/^abcd$/)

    await tick(100)
    /* 100% complete, all characters should be unscrambled */
    expect(container.textContent).toMatch(/^abcd$/)

    await tick(100)
    /* past complete, all characters should be unscrambled */
    expect(container.textContent).toMatch(/^abcd$/)

    clock.uninstall()
  })

  it('should progressively display "unscrambled" text for the entire duration', async () => {
    const clock = lolex.install()
    const text = 'abcd'
    const config = {
      sequential: true,
    }
    render(
      <ScrambledText
        interval={100}
        duration={400}
        text={text}
        config={config}
      />,
    )

    // expect(container.textContent).not.toMatch(/^a/)

    /* Advance 100ms, should show only 1 correct character */
    act(() => {
      clock.tick(100)
    })

    // expect(container.textContent).toMatch(/^a/)
    // expect(container.textContent).not.toMatch(/^ab/)

    /* Advance 100ms, should show only 2 correct characters */
    act(() => {
      clock.tick(100)
    })

    // expect(container.textContent).toMatch(/^ab/)
    // expect(container.textContent).not.toMatch(/^abc/)

    /* Advance 100ms, should show only 3 correct character */
    act(() => {
      clock.tick(100)
    })

    // expect(container.textContent).toMatch(/^abc/)
    // expect(container.textContent).not.toMatch(/^abcd/)

    /* Advance 100ms, should show all 4 correct characters */
    act(() => {
      clock.tick(100)
    })

    // expect(container.textContent).toMatch(/^abcd$/)
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

  it.skip('should only count the duration when running === true', async () => {
    const clock = lolex.install()
    const text = 'abcd'
    const config = {
      sequential: true,
    }

    const props = {
      interval: 10,
      duration: 500,
      config,
      text,
    }

    const tick = async (amt: number = 100) => {
      act(() => {
        clock.tick(amt)
      })
    }
    const { rerender, container } = render(
      <ScrambledText {...props} running={false} />,
    )

    const text1 = container.textContent
    await tick() // 100ms while stopped
    // await tick() // 200ms while stopped

    /* Nothing should have changed */
    expect(container.textContent).toBe(text1)

    /* Props have been updated: running is now true */
    rerender(<ScrambledText {...props} running={true} />)
    /* Timer has started, but no re-renders yet, nothing should have changed */
    expect(container.textContent).toBe(text1)

    await tick() // 100ms while running
    /* Timer has advanced by 20% of the duration. The first character should be unscrambled */
    const text2 = container.textContent
    console.log(text2)
    expect(text2).not.toBe(text1)
    // expect(text2).toMatch(/^a/)
    // expect(text2).not.toMatch(/^ab/)

    await tick() // + 100ms while running = 200ms
    /* Timer has advanced by 40% of the duration. The first 2 characters should be unscrambled */
    const text3 = container.textContent
    console.log(text3)
    expect(text3).not.toBe(text2)
    // expect(text3).toMatch(/^ab/)
    // expect(text3).not.toMatch(/^abc/)

    /* Stop the timer */
    rerender(<ScrambledText {...props} running={false} />)

    await tick()
    await tick()

    /* Time has passed while running === false. Text shouldbe in the same state */
    expect(container.textContent).toBe(text3)

    /* Start the timer */
    rerender(<ScrambledText {...props} running={true} />)

    await tick() // +100ms while running = 300ms
    await tick(10) // +100ms while running = 300ms
    // await tick() // +100ms while running = 400ms
    // await tick() // +100ms while running = 500ms
    /* 300ms have elapsed while running === true.
     * The text should now have three unscrambled characters */
    const text4 = container.textContent
    expect(text4).not.toBe(text3)
    // expect(text4).toMatch(/^abc/)
    // expect(text4).not.toMatch(/^abcd$/)
    //
    clock.uninstall()
  })
})
