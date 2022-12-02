import { readFileSync } from 'fs'

export function getLinesFromFile<T extends string>(file: string): T[] {
  return readFileSync(file).toString().trim().split('\n') as T[]
}

export function getNumbersFromFile(file: string): number[] {
  const lines = getLinesFromFile(file)

  return lines.length === 1
    ? lines[0]!.split(',').map(Number)
    : getLinesFromFile(file).map(line => parseFloat(line))
}

export function getArray2dFromFile<T extends string>(
  file: string,
  splitBy = ''
): T[][] {
  return getLinesFromFile(file).map(line => line.split(splitBy) as T[])
}

export function add(a: number, b: number): number {
  return a + b
}

export function multiply(a: number, b: number): number {
  return a * b
}

export function asc(a: any, b: any): number {
  return a - b
}

export function desc(a: any, b: any): number {
  return b - a
}

export function isInRange(min: number, value: number, max: number): boolean {
  return value >= min && value <= max
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function rotateClockwise<T>(arr: Array2d<T>): Array2d<T> {
  const copy = deepCopy<Array2d<T>>(arr)
  const n = copy.length
  const x = Math.floor(n / 2)
  const y = n - 1

  for (let i = 0; i < x; i++) {
    for (let j = i; j < y - i; j++) {
      const tmp = copy[i]![j]
      // @ts-ignore
      copy[i][j] = copy[y - j][i]
      // @ts-ignore
      copy[y - j][i] = copy[y - i][y - j]
      // @ts-ignore
      copy[y - i][y - j] = copy[j][y - i]
      // @ts-ignore
      copy[j][y - i] = tmp
    }
  }

  return copy
}

export function flipX<T>(arr: Array2d<T>): Array2d<T> {
  let copy = deepCopy<Array2d<T>>(arr)
  copy = copy.map(row => row.reverse())

  return copy
}

export function flipY<T>(arr: Array2d<T>): Array2d<T> {
  let copy = deepCopy<Array2d<T>>(arr)
  copy = copy.reverse()

  return copy
}

export function getManhattanDistance(
  positionA: Position2d,
  positionB: Position2d = { x: 0, y: 0 }
): number {
  return (
    Math.abs(positionA.x - positionB.x) + Math.abs(positionA.y - positionB.y)
  )
}

export function match<
  Variant extends PropertyKey,
  Options extends Record<Variant, () => any>
>(variant: Variant, options: Options): ReturnType<Options[Variant]> {
  return options[variant]()
}

export function log(...arg: any[]): void {
  console.log(...arg)
}

export function getColumn<T>(array: T[][], columnNumber: number): T[] {
  const column: T[] = []
  for (const row of array) {
    column.push(row[columnNumber]!)
  }

  return column
}

export function negateFunction(fn: (...arg: any) => boolean): () => boolean {
  return (...arg) => !fn(...arg)
}

export function memorize<Fn extends (...args: any[]) => any>(
  fn: Fn
): (...args: Parameters<Fn>) => ReturnType<Fn> {
  const memo = new Map()

  return (...args) => {
    const uniqKey = JSON.stringify(args)

    if (memo.has(uniqKey)) {
      return memo.get(uniqKey)
    } else {
      const returnValue = fn(...args)
      memo.set(uniqKey, returnValue)
      return returnValue
    }
  }
}

export function loop2d<T>(
  array: T[][],
  callback: (y: number, x: number, item: T) => void
): void {
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[y]!.length; x++) {
      callback(y, x, array[y]![x]!)
    }
  }
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}
