import { readFileSync } from 'fs'
import { last } from 'lodash'
import path from 'path'

export function getInput(dirname: string): string {
  return readFileSync(path.join(dirname, 'input.txt')).toString()
}

export function getLines<T extends string>(dirname: string): T[] {
  const lines = getInput(dirname).split('\n') as T[]
  if (last(lines) === '') lines.pop()
  return lines
}

export function getNumbers(dirname: string): number[] {
  const lines = getLines(dirname)

  return lines.length === 1
    ? lines[0]!.split(',').map(Number)
    : getLines(dirname).map(line => parseFloat(line))
}

export function getArray2d<T extends string>(
  dirname: string,
  splitBy = ''
): T[][] {
  return getLines(dirname).map(line => line.split(splitBy) as T[])
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

export function getManhattanDistance(
  a: Position,
  b: Position = { x: 0, y: 0 }
): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function getDistance(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function match<
  Variant extends PropertyKey,
  Options extends Record<Variant, () => any>
>(variant: Variant, options: Options): ReturnType<Options[Variant]> {
  return options[variant]()
}

export function getColumn<T>(array: T[][], columnNumber: number): T[] {
  const column: T[] = []
  for (const row of array) {
    column.push(row[columnNumber]!)
  }

  return column
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

export function adjacentPoints<T>(arr: T[][], x: number, y: number) {
  return {
    up: arr[y - 1]?.[x],
    upRight: arr[y - 1]?.[x + 1],
    upLeft: arr[y - 1]?.[x - 1],
    down: arr[y + 1]?.[x],
    downRight: arr[y + 1]?.[x + 1],
    downLeft: arr[y + 1]?.[x - 1],
    left: arr[y][x - 1],
    right: arr[y][x + 1],
  }
}
