import { sequence } from '../'

describe('sequence', () => {
  it('should return an list of progressively un-scrambled text', async () => {
    const list = sequence('abcd', 5, { sequential: true })
    expect(list.length).toBe(5)

    expect(list[0]).not.toMatch(/^a/)

    expect(list[1]).toMatch(/^a/)
    expect(list[1]).not.toMatch(/^ab/)

    expect(list[2]).toMatch(/^ab/)
    expect(list[2]).not.toMatch(/^abc/)

    expect(list[3]).toMatch(/^abc/)
    expect(list[3]).not.toMatch(/^abcd/)

    expect(list[4]).toMatch(/^abcd/)
  })
})
