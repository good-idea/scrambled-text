export const identity = <T>(a: T): T => a

export const split = (char: string) => (text: string): string[] =>
  text.split(char)

export const pipe = (...fns) =>
  fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)))

type FilterFn = (item: any) => boolean

export const filter = (fn: FilterFn) => <T>(arr: T[]): T[] => arr.filter(fn)

export const slice = (begin: number, end?: number) => <T>(arr: T[]): T[] =>
  arr.slice(begin, end)

export const reverse = <T>(arr: T[]): T[] =>
  Array.prototype.slice.call(arr, 0).reverse()

/* Adapted From:
 * https://stackoverflow.com/a/6274381/6402238 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
