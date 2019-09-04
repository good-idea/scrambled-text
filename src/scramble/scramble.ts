import { shuffle, identity, split, pipe, slice, reverse } from '../utils/fp'
//
// import identity from 'lodash-es/identity'
// import split from 'lodash-es/split'
// import pipe from 'lodash-es/flow'
// import filter from 'lodash-es/filter'
// import slice from 'lodash-es/slice'
// import reverse from 'lodash-es/reverse'

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

function matchCase(char: string, charToMatch: string): string {
  if (/[A-Z]/.test(charToMatch)) return char.toUpperCase()
  if (/[a-z]/.test(charToMatch)) return char.toLowerCase()
  return char
}

function randomFromArray<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export const scrambleCharWithCharSet = (
  charset: string[],
  preserveCasing?: boolean,
) => {
  function scrambleChar(char: string): string {
    if (char.length > 1)
      throw new Error(
        `You can only scramble one character at a time. Received: ${char}`,
      )
    const randomChar = randomFromArray(charset)
    const casedChar = preserveCasing ? matchCase(randomChar, char) : randomChar
    if (charset.length === 1) return casedChar
    /* If there is more than one possible character, do not return
     * one that matches the input. Instead, call this function again */
    return casedChar === char ? scrambleChar(char) : casedChar
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
  const scrambleChar = scrambleCharWithCharSet(charSet, config.preserveCasing)

  const scrambleLimit = Math.round(config.amount * text.length)

  const characterIsUnscrambled = (index: number): boolean =>
    config.previousText.charAt(index) === text.charAt(index)

  const charactersToScramble = pipe(
    split(''),
    getIndices,
    reverse,
    config.sequential ? identity : shuffle,
    slice(0, scrambleLimit),
  )(text)

  return text
    .split('')
    .map((char, index) => {
      if (config.preserveWhitespace && /\s/.test(char)) return char
      if (config.previousText && characterIsUnscrambled(index)) return char
      if (!charactersToScramble.includes(index)) return char
      return scrambleChar(char)
    })
    .join('')
}
