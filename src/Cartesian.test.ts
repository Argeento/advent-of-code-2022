import { Cartesian } from './Cartesian'

const testArr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

describe('Cartesian', () => {
  it('matrix must be square', () => {
    expect(() => new Cartesian([[1], [1, 2]])).toThrow()
    expect(() => new Cartesian([[1, 2], [1]])).toThrow()
    expect(() => new Cartesian(testArr)).not.toThrow()
  })

  it('returns cols', () => {
    const cart = new Cartesian(testArr)
    expect(cart.cols[0]).toStrictEqual([7, 4, 1])
    expect(cart.cols[1]).toStrictEqual([8, 5, 2])
    expect(cart.cols[2]).toStrictEqual([9, 6, 3])
  })

  it('returns rows', () => {
    const cart = new Cartesian(testArr)
    expect(cart.rows[0]).toStrictEqual([7, 8, 9])
    expect(cart.rows[1]).toStrictEqual([4, 5, 6])
    expect(cart.rows[2]).toStrictEqual([1, 2, 3])
  })

  it('gets value', () => {
    const cart = new Cartesian(testArr)
    expect(cart.arr[0][2]).toBe(1)
    expect(cart.get(0, 0)).toBe(7)
    expect(cart.get(1, 2)).toBe(2)
    expect(cart.get({ x: 0, y: 0 })).toBe(7)
    expect(cart.get({ x: 2, y: 2 })).toBe(3)
  })

  it('sets value', () => {
    const cart = new Cartesian(testArr)
    cart.set(0, 0, 10)
    expect(cart.get(0, 0)).toBe(10)
    cart.set({ x: 1, y: 2 }, 12)
    expect(cart.get(1, 2)).toBe(12)
    cart.arr[0][0] = 9
    expect(cart.get(0, 0)).toBe(9)
  })

  it('iterate for each item', () => {
    const cart = new Cartesian(testArr)
    const cb = jest.fn()
    cart.forEach(cb)
    expect(cb.mock.calls).toEqual([
      [7, 0, 0, cart],
      [4, 0, 1, cart],
      [1, 0, 2, cart],
      [8, 1, 0, cart],
      [5, 1, 1, cart],
      [2, 1, 2, cart],
      [9, 2, 0, cart],
      [6, 2, 1, cart],
      [3, 2, 2, cart],
    ])
  })

  it('prints array', () => {
    const cart = new Cartesian(testArr)
    const log = jest.fn()
    cart.print(log)
    expect(log.mock.calls.flatMap(x => x)).toEqual(['123', '456', '789'])
  })
})
