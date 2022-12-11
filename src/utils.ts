import { readFileSync } from 'fs'
import path from 'path'

export function getInput(dirname: string): string {
  return readFileSync(path.join(dirname, 'input.txt')).toString()
}

export function getLinesFromInput<T extends string>(dirname: string): T[] {
  const lines = getInput(dirname).split('\n') as T[]

  if (last(lines) === '') {
    lines.pop()
  }

  return lines
}

export function getNumbersFromInput(dirname: string): number[] {
  const lines = getLinesFromInput(dirname)

  return lines.length === 1
    ? lines[0]!.split(',').map(Number)
    : getLinesFromInput(dirname).map(line => parseFloat(line))
}

export function getArray2dFromInput<T extends string>(
  dirname: string,
  splitBy = ''
): T[][] {
  return getLinesFromInput(dirname).map(line => line.split(splitBy) as T[])
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

export function inRange(min: number, value: number, max: number): boolean {
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
  positionA: Position,
  positionB: Position = { x: 0, y: 0 }
): number {
  return (
    Math.abs(positionA.x - positionB.x) + Math.abs(positionA.y - positionB.y)
  )
}

export function getDistance(positionA: Position, PositionB: Position): number {
  return Math.hypot(positionA.x - PositionB.x, positionA.y - PositionB.y)
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
  callback: (x: number, y: number, item: T) => void
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

export function toNumber(str: string): number {
  return parseFloat(str.match(/\-?\d+((.|,)\d+)?/)?.[0] || '')
}

export function toNumbers(str: string): number[] {
  return (str.match(/\-?\d+((.|,)\d+)?/g) ?? []).map(x => parseFloat(x))
}

export function divisible(a: number, b: number): boolean {
  return a % b === 0
}

/** Greatest common divisor */
export function getGcd(a: number, b: number): number {
  return !b ? a : getGcd(b, a % b)
}

/** Least Common Multiple */
export function getLcm(a: number[]): number
export function getLcm(a: number, b: number): number
export function getLcm(a: number | number[], b?: number): number {
  if (Array.isArray(a)) {
    return a.reduce(getLcm, 1)
  }
  // @ts-ignore
  return a * (b / getGcd(a, b))
}
