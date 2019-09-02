<div align="center">
<h1>WbLhpMzz6 Nk4S → OpnQf8yz2 DtPG → zctW7JuTI 74Dm → 2c4azibbm S9bv → XcFaz2XWd zpqv → rcraHL3md 6Edg → Ucraij1bd yeZl → 8craKbKSd TePq → 3craBbs0d Teut → ncramb47d TePt → 2crambfed TeGt → Scrambhed Tewt → Scrambled Te7t → <strong><em>Scrambled Text</em></strong></h1>
  <a href="https://npmjs.com/package/scrambled-text">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/scrambled-text.svg" />
  </a>
  <a href="https://codecov.io/gh/good-idea/scrambled-text">
    <img alt="Test Coverage" src="https://codecov.io/gh/good-idea/scrambled-text/branch/master/graph/badge.svg" />
  </a>
  <a href="https://bundlephobia.com/result?p=scrambled-text">
    <img alt="Minified gzip size" src="https://img.shields.io/bundlephobia/minzip/scrambled-text.svg?label=gzip%20size" />
  </a>
  <a href="https://github.com/good-idea/scrambled-text#maintenance-status">
    <img alt="Maintenance Status" src="https://img.shields.io/badge/maintenance-active-green.svg" />
  </a>
</div>

A simple & configurable utility function for scrambling text. Low bundle size, 0 dependencies, and written in Typescript.

**Bonus** React component `<ScrambledText />` and hook `useScrambledText`

## Installation

`npm install scrambled-text` or `yarn install scrambled-text`

## API

### `scramble`

`scramble` is the core function of this (tiny) library. Usage:

```ts
import { scramble } from 'scrambled-text'

scramble('I Love Dogs') // => 'x M8aZ 6vfO'
```

#### Configuration

By default, the function will:

- Scramble all characters in the string
- Preserve white space
- Scramble with a character set of `a-z`, `A-Z`, and `0-9`

All of this is configurable by passing in a `config` object as the second parameter:

```ts
scramble('I Love Dogs', config)
```

_Options:_

| parameter          | type    | default     | description                                                                                                                                    |
| ------------------ | ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| amount             | number  | 1           | A number ranging from 0-1. It determines the percentage of characters that will be scrambled.                                                  |
| sequential         | boolean | false       | When set to `true`, non-scrambled characters will be at the beginning of the string. (This will have no effect when `amount` is `1`)           |
| preserveWhitespace | boolean | true        | When set to `true`, whitespace characters will not be scrambled.                                                                               |
| preserveCasing     | boolean | false       | When set to `true`, the scrambled characters will match the casing of the original character.                                                  |
| previousText       | string  | (none)      | When supplied, the function will respect any unscrambled text that matches the input. This is helpful for "animating" text being un-scrambled. |
| characterSet       | string  | `a…zA…Z0…9` | Use this option to provide an alternate character set                                                                                          |

_all configuration properties are optional_

#### Examples

_`amount`_

```ts
scramble('Hello World', { amount: 1 }) // => 'W9DS1 Xi6vr'

scramble('Hello World', { amount: 0.75 }) // => 'HKTby WoEXz'

scramble('Hello World', { amount: 0.5 }) // => 'Ccrlo WoVlU'

scramble('Hello World', { amount: 0.25 }) // => 'Hello WFrlV'

scramble('Hello World', { amount: 0 }) // => 'Hello World'
```

_`sequential`_

```ts
/* No effect when amount === 1 */
scramble('Hello World', { amount: 1, sequential: true }) // => 'Mwzui ijwxj'

scramble('Hello World', { amount: 0.75, sequential: true }) // => 'HelTk 461zy'

scramble('Hello World', { amount: 0.5, sequential: true }) // => 'Hello z10Do'

scramble('Hello World', { amount: 0.25, sequential: true }) // => 'Hello WoEU8'

scramble('Hello World', { amount: 0, sequential: true }) // => 'Hello World'
```

_`preserveWhitespace`_

```ts
/* Default behavior */
scramble('Hello World', { preserveWhitespace: true }) // => 'S9O6X Kj5XA'

scramble('Hello World', { preserveWhitespace: false }) // => 'CqEr7J3aAZc'
```

_`preserveCasing`_

```ts
/* Default behavior */
scramble('Hello World', { preserveCasing: false }) // => 'TC0Vh yJN27'

scramble('Hello World', { preserveCasing: true }) // => 'Nu87w M2zcu'
```

_`previousText`_

This option can be provided to progressively "un-scramble" a string. This is mostly used internally, and other exports make this easier. See `sequence`, or the React component or hook.

```ts
const text1 = scramble('Hello World') // => 'PKoa5 gD8Uf'
const text2 = scramble('Hello World', { amount: 0.8, previousText: text1 }) // => 'NGYto oGilN'
const text3 = scramble('Hello World', { amount: 0.6, previousText: text2 }) // => 'HDlJo LaOld'
const text4 = scramble('Hello World', { amount: 0.4, previousText: text3 }) // => 'Hello yosld'
const text5 = scramble('Hello World', { amount: 0.2, previousText: text4 }) // => 'Hello Wosld'
const text6 = scramble('Hello World', { amount: 0, previousText: text5 }) // => 'Hello World'
```

_`characterSet`_

```ts
scramble('Hello World', { characterSet: 'xyz' }) // => 'zyxyz xyzxy'

scramble('Hello World', { characterSet: 'x' }) // => 'xxxxx xxxxx'

scramble('Hello World', { characterSet: '!@#$%^&*' }) // => '!!@^@ %$#%*'

/* 🚫 Emoji & Unicode support in progress */
scramble('Hello World', { characterSet: '🤞🐛' }) // => '...not yet'

scramble('Hello World', { characterSet: '♠︎♣︎♥︎♦︎' }) // => '...not yet'
```

### `sequence`

A helper function to generate an array of progressively scrambled/unscrambled text.

```ts
sequence(initialText: string, steps: number, config?: ScrambledTextProps) => string[]
```

```
import { sequence } from 'scrambled-text'

sequence('abcd', 5, { sequential: true })
// =>
// [
//   'z9bq',
//   'a8nL',
//   'ab1z',
//   'abcR',
//   'abcd'
// ]
```

### React: `<ScrambledText />` component

This component renders an animated sequence of text "unscrambling" over a period of time. The example below will start with fully scrambled text, un-scrambling over 10 seconds, to end with "Hello World"

```ts
import { ScrambledText } from 'scrambled-text'

function MyComponent() {
  return <ScrambledText text="Hello World" duration="10000" />
}
```

`ScrambledTextProps`:

| prop     | type                              | required | default        | description                                                                                                            |
| -------- | --------------------------------- | -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| text     | `string`                          | yes      |                | The text you want to scramble                                                                                          |
| config   | `ScrambleOptions`                 | no       | default config | The same configuration options as above                                                                                |
| running  | `boolean`                         | no       | `true`         | When set to `false`, the component will not animate                                                                    |
| interval | `number`                          | no       | `30`           | The interval at which the text will be re-scrambled (in ms)                                                            |
| duration | `number`                          | no       | `3000`         | The total duration of the unscrambling (in ms)                                                                         |
| reverse  | `boolean`                         | no       | `false`        | If `true`, the animation starts with un-scrambled text and progressively scrambles it _⚠️ In development, coming soon_ |
| wrapper  | `string` or `React.ComponentType` | no       | 'span'         | An optional wrapper component                                                                                          |

#### Examples

With a custom wrapper string:

```ts
<ScrambledText text="Hello" wrapper="h1" /> // => <h1>W9DS1 Xi6vr<h1>
```

With a custom wrapper component:

_*If you use this option, make sure your component uses the `children` prop*_

```ts
const MyWrapper = ({ children }) => (
  <div>
    <p>Scrambled:</p>
    <p>{children}</p>
  </div>
)

<ScrambledText text="Hello" wrapper={MyWrapper} />
// =>
// <div>
//    <p>Scrambled:</p>
//    <p>W9DS1 Xi6vr</p>
// </div>
```

### React: `useScrambledText`

```ts
useScrambledText(initialText: string, config: ScrambledTextProps) => {
  currentText: string,
  progress: number
}
```

This is basically the same behavior as the component, but within a hook. The configuration is the same as the component, but the `wrapper` option will be ignored.

It returns the latest scrambled text (`currentText`) as well as the total progress (`progress`) (`0-1`)

Usage:

```ts
import { useScrambledText } from 'scrambled-text'

function MyComponent() {
  const { currentText, progress } = useScrambledText('Hello World', {
    duration: 10000,
  })
  return (
    <div>
      <p>{currentText}</p>
      <h5>Progress: ${Math.round(progress * 100)}%</h5>
    </div>
  )
}
```
