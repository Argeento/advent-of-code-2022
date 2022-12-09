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
export class Cartesian<Item> {
  public arr: Item[][]

  constructor(array: Item[][]) {
    if (array.some(line => line.length !== array.length)) {
      throw new Error('The array must be square!')
    }

    this.arr = unzip(array).map(reverse)
  }

  public get(point: Point): Item
  public get(x: number, y: number): Item
  public get(x: number | Point, y?: number): Item | void {
    if (typeof x === 'object') return this.arr[x.x][x.y]
    if (y !== undefined) return this.arr[x][y]
  }

  public set(point: Point, item: Item): this
  public set(x: number, y: number, item: Item): this
  public set(x: number | Point, y: number | Item, item?: Item): this {
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
    cb: (item: Item, x: number, y: number, cartesian: this) => void
  ): this {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const item = this.get(x, y)
        cb(item, x, y, this)
      }
    }
    return this
  }

  public print(logFn = console.log): this {
    ;[...this.rows].reverse().forEach(row => {
      logFn(row.join(''))
    })

    return this
  }

  public get size(): number {
    return this.arr.length
  }

  public get cols(): Item[][] {
    return this.arr
  }

  public get rows(): Item[][] {
    return unzip(this.arr)
  }

  public get values(): Item[] {
    return this.arr.flatMap(x => x)
  }

  static createEmpty<T>(size: number, fill: T) {
    const arr: T[][] = []
    for (let x = 0; x < size; x++) {
      arr.push([])
      for (let y = 0; y < size; y++) {
        arr[x][y] = fill
      }
    }

    return new Cartesian(arr)
  }
}
