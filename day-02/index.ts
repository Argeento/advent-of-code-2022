import { add, getLinesFromFile } from '../utils'

type Strategy = `${'A' | 'B' | 'C'}${'X' | 'Y' | 'Z'}`
type PointsMap = Record<Strategy, number>

const W = 6 // WIN
const D = 3 // DRAW
const L = 0 // LOSE

const X = 1 // A - ROCK
const Y = 2 // B - PAPER
const Z = 3 // C - SCISSORS

const strategies = getLinesFromFile('./day-02/data.txt').map(
  line => line.replace(' ', '') as Strategy
)

const pointsMap: PointsMap = {
  AX: D + X,
  AY: W + Y,
  AZ: L + Z,
  BX: L + X,
  BY: D + Y,
  BZ: W + Z,
  CX: W + X,
  CY: L + Y,
  CZ: D + Z,
}

console.log(
  'Part 1:',
  strategies.map(strategy => pointsMap[strategy]).reduce(add)
)

const pointsMap2: PointsMap = {
  AX: L + Z,
  AY: D + X,
  AZ: W + Y,
  BX: L + X,
  BY: D + Y,
  BZ: W + Z,
  CX: L + Y,
  CY: D + Z,
  CZ: W + X,
}

console.log(
  'Part 2:',
  strategies.map(strategy => pointsMap2[strategy]).reduce(add)
)
