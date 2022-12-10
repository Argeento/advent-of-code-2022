import { add, getLinesFromInput } from '../utils'

const lines = getLinesFromInput(__dirname).map(x => x.replace(' ', ''))

const points: Record<string, number[]> = {
  AX: [4, 3],
  AY: [8, 4],
  AZ: [3, 8],
  BX: [1, 1],
  BY: [5, 5],
  BZ: [9, 9],
  CX: [7, 2],
  CY: [2, 6],
  CZ: [6, 7],
}

console.log('Part 1:', lines.map(s => points[s][0]).reduce(add))
console.log('Part 2:', lines.map(s => points[s][1]).reduce(add))
