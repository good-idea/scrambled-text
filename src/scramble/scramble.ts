import { identity, split, pipe, filter, slice, reverse } from 'lodash/fp'

// import identity from 'lodash/fp/identity'
// import split from 'lodash/fp/split'
// import pipe from 'lodash/fp/flow'
// import filter from 'lodash/fp/filter'
// import slice from 'lodash/fp/slice'
// import reverse from 'lodash/fp/reverse'

export interface ScrambleOptions {
  /* Number from 0-1. Determines the % of characters that should be scrambled
   * default: 1 */
  amount: number
  /* If true, scrambles from the end of the string.
   * If false, scrambles the characters randomly.
   * default: false */
  sequential: boolean
  /* If true, does not un-scramble white-space.
   * default: false */
  preserveWhitespace: boolean
  /* If true, scrambled characters will match the casing of the final text.
   * default: false */
  preserveCasing: boolean
  /* If supplied, the un-scrambled text will start with this string. Helpful
   * if you are calling this function repeatedly to animate unscrambling text */
  previousText: string

  /* The character set used to replace scrambled characters.
   * default: all lowercase a-z, uppercase A-Z, digits 0-9.
   * example: 'xyz' : 'scramble me' -> 'xzyxzzyx xy'
   * example: 'x' : 'scramble me' -> 'xxxxxxxx xx' */
  characterSet: string
}

const defaultCharset =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const defaultOptions = {
  amount: 1,
  sequential: false,
  preserveWhitespace: true,
  preserveCasing: false,
  previousText: undefined,
  characterSet: defaultCharset,
}

/* Adapted From:
 * https://stackoverflow.com/a/6274381/6402238 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function matchCase(char: string, charToMatch: string): string {
  if (/[A-Z]/.test(charToMatch)) return char.toUpperCase()
  if (/[a-z]/.test(charToMatch)) return char.toLowerCase()
  return char
}

function randomFromArray<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export const scrambleCharWithCharSet = (charset: string[]) => {
  function scrambleChar(char: string): string {
    if (char.length > 1)
      throw new Error(
        `You can only scramble one character at a time. Received: ${char}`,
      )
    const randomChar = randomFromArray(charset)
    if (charset.length === 1) return randomChar
    /* If there is more than one possible character, do not return
     * one that matches the input. Instead, call this function again */
    return randomChar === char ? scrambleChar(char) : randomChar
  }

  return scrambleChar
}

const getIndices = <T>(arr: T[]): number[] => arr.map((_, index) => index)

export const scramble = (
  text: string,
  userOptions?: Partial<ScrambleOptions>,
): string => {
  const config = {
    ...defaultOptions,
    ...userOptions,
  }
  const charSet = config.characterSet.split('')
  const scrambleChar = scrambleCharWithCharSet(charSet)

  const scrambleLimit = Math.round(config.amount * text.length)

  const characterIsUnscrambled = (index: number): boolean =>
    config.previousText && config.previousText.length
      ? config.previousText.charAt(index) !== text.charAt(index)
      : true

  const charactersToScramble = pipe(
    split(''),
    getIndices,
    reverse,
    config.sequential ? identity : shuffle,
    slice(0, scrambleLimit),
    config.previousText ? filter(characterIsUnscrambled) : identity,
  )(text)

  return text
    .split('')
    .map((char, index) => {
      if (config.preserveWhitespace && /\s/.test(char)) return char
      if (!charactersToScramble.includes(index)) return char
      const scrambled = scrambleChar(char)
      return config.preserveCasing ? matchCase(scrambled, char) : scrambled
    })
    .join('')
}
