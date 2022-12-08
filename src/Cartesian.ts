import { reverse, unzip } from 'lodash'

export type Point = {
  x: number
  y: number
}

/**
 * Place an array in cartesian coordinate system
 * to use more natural X and Y positioning:
 * ```
 *       ^ y
 *       |
 *       123
 *       456
 * ------759-----> x
 *       |
 *       |
 *       |
 * ```
 */
export class Cartesian<T> {
  public arr: T[][]

  constructor(array: T[][]) {
    if (array.some(line => line.length !== array.length)) {
      throw new Error('The array must be square!')
    }

    this.arr = unzip(array).map(reverse)
  }

  public get(point: Point): T
  public get(x: number, y: number): T
  public get(x: number | Point, y?: number): T | void {
    if (typeof x === 'object') return this.arr[x.x][x.y]
    if (y !== undefined) return this.arr[x][y]
  }

  public set(point: Point, item: T): this
  public set(x: number, y: number, item: T): this
  public set(x: number | Point, y: number | T, item?: T): this {
    if (typeof x === 'object') {
      // @ts-ignore
      this.arr[x.x][x.y] = y
    }

    if (typeof x === 'number') {
      // @ts-ignore
      this.arr[x][y] = item
    }

    return this
  }

  public forEach(
    cb: (item: T, x: number, y: number, cartesian: this) => void
  ): this {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const item = this.get(x, y)
        cb(item, x, y, this)
      }
    }
    return this
  }

  public print(): this {
    this.rows.forEach(row => {
      console.log(row.join(''))
    })

    return this
  }

  public get size(): number {
    return this.arr.length
  }

  public get cols(): T[][] {
    return this.arr
  }

  public get rows(): T[][] {
    return unzip(this.arr)
  }
}
