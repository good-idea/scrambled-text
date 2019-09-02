
import {
  scramble,
  scrambleCharWithCharSet,
} from '../scramble'

jest.useFakeTimers()

/**
 * Helper to test how much of a string was scrambled
 */
const getScrambledCharCount = (
  initialText: string,
  scrambled: string,
): number =>
  initialText.split('').filter((char, index) => char !== scrambled[index])
    .length

describe('scrambleCharWithCharSet', () => {
  it('if the charset has multiple characters, the scrambled character should always be different', () => {
    const initialText = 'aaaaaa'
    const charset = 'abc'
    const scrambleChar = scrambleCharWithCharSet(charset.split(''))

    initialText.split('').forEach((character) => {
      expect(scrambleChar(character)).not.toBe('a')
    })
  })

  it('should always return a scrambled character from the charset', async () => {
    const initialText = 'aaaaaaaaaaaaa'
    const charset = 'xyz'
    const scrambleChar = scrambleCharWithCharSet(charset.split(''))

    const validChars = charset.split('')

    initialText.split('').forEach((character) => {
      const scrambled = scrambleChar(character)
      expect(validChars).toContain(scrambled)
    })
  })

  it('if the charset is one character, allow the same character to be returned', async () => {
    const initialText = 'xyz'
    const charset = 'x'
    const scrambleChar = scrambleCharWithCharSet(charset.split(''))

    initialText.split('').forEach((character) => {
      expect(scrambleChar(character)).toBe('x')
    })
  })

  it('should throw if given more than one character to scramble', async () => {
    const charset = 'abc'
    const scrambleChar = scrambleCharWithCharSet(charset.split(''))

    expect(() => scrambleChar('ab')).toThrow()
  })
})

describe('scramble', () => {
  it('return a string of the same length as the starting string', async () => {
    const initialText = 'abcxyz'
    expect(scramble(initialText).length).toBe(initialText.length)
  })

  it('should scramble all characters by default', () => {
    const initialText = 'abcxyz'
    const scrambled = scramble(initialText)

    initialText.split('').forEach((character, index) => {
      expect(scrambled[index]).not.toBe(character)
    })
  })

  it('should scramble characters according to config.amount', async () => {
    const initialText = 'abcdefg'
    const config = {
      amount: 0.5, // with 7 chars, will round up to 4
    }
    const scrambled = scramble(initialText, config)

    const amount = getScrambledCharCount(initialText, scrambled)
    expect(amount).toBe(Math.round(config.amount * initialText.length))
  })

  it('should scramble text non-sequentially by default', async () => {
    const initialText = 'abcdefghij'
    const config = {
      sequential: false,
      amount: 0.5,
    }
    const scrambled = scramble(initialText, config)
    expect(scrambled).not.toMatch(/^abcd/)

    const scrambledAmount = getScrambledCharCount(initialText, scrambled)
    expect(scrambledAmount).toBe(Math.round(config.amount * initialText.length))
  })

  it('should scramble text sequentially when config.sequential === true', async () => {
    const initialText = 'abcdef'
    const config = {
      sequential: true,
      amount: 0.5,
    }
    const scrambled = scramble(initialText, config)
    expect(scrambled).toMatch(/^abc/)
  })

  it('should preserve capitalization when config.preserveCasing === true', async () => {
    const initialText = 'aBcDeFgHiJkLmNoPqRsT01234'
    const scrambled = scramble(initialText, { preserveCasing: true })

    const upcase = /[A-Z]/
    const lowercase = /[a-z]/
    const number = /\d/

    initialText.split('').forEach((character, index) => {
      const scrambledChar = scrambled[index]
      if (number.test(scrambledChar)) return
      if (upcase.test(character)) {
        expect(scrambledChar).toMatch(upcase)
      } else if (lowercase.test(character)) {
        expect(scrambledChar).toMatch(lowercase)
      }
    })
  })

  it('should preserve white space by default', async () => {
    const initialText = 'abc def'
    const scrambled = scramble(initialText)
    expect(scrambled[3]).toBe(' ')
  })

  it('should not preserve whitespace when preserveWhitespace === false', async () => {
    const initialText = 'abc def'
    const config = {
      preserveWhitespace: false,
    }
    const scrambled = scramble(initialText, config)
    expect(scrambled[3]).not.toBe(' ')
  })

  it('should preserve previously "unscrambled" text from config.previousText', () => {
    expect(scramble('abcd', { previousText: 'ab7z' })).toMatch(/^ab/)
    expect(scramble('abcd', { previousText: 'ab7z' })).toMatch(/^ab/)
    expect(scramble('abcd', { previousText: 'ab7z' })).toMatch(/^ab/)
    expect(scramble('abcd', { previousText: 'ab7z' })).toMatch(/^ab/)

    expect(scramble('abcd', { previousText: 'nbcR' })).toMatch(/\wbc\w/)
    expect(scramble('abcd', { previousText: 'nbcR' })).toMatch(/\wbc\w/)
    expect(scramble('abcd', { previousText: 'nbcR' })).toMatch(/\wbc\w/)

    expect(scramble('abcd', { previousText: '4fcd' })).toMatch(/cd$/)
    expect(scramble('abcd', { previousText: '4fcd' })).toMatch(/cd$/)
    expect(scramble('abcd', { previousText: '4fcd' })).toMatch(/cd$/)
    expect(scramble('abcd', { previousText: '4fcd' })).toMatch(/cd$/)
  })

  it('should always return the previous text, even when config.amount is lower', async () => {
    expect(scramble('abcd', { previousText: 'ab7z', amount: 0 })).toMatch(/^ab/)
  })
})

