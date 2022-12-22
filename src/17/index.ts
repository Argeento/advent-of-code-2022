import { findLastIndex } from 'lodash'
import { findCycles } from '../find-cycles'
import { getInput } from '../utils'

type Shape = DeepReadonly<{ chars: string[]; width: number; height: number }>
type Rock = Point & Readonly<{ shape: Shape }>
type Cave = string[][]

const jetPattern = [...getInput(__dirname).trim()] as Readonly<('<' | '>')[]>
const shapes = [
  ['####'],
  ['.#.', '###', '.#.'],
  ['###', '..#', '..#'],
  ['#', '#', '#', '#'],
  ['##', '##'],
] as const

function putInCave(rock: Rock, cave: Cave) {
  for (let y = 0; y < rock.shape.height; y++) {
    for (let x = 0; x < rock.shape.width; x++) {
      const char = rock.shape.chars[y][x]
      if (char === '#') {
        cave[rock.y + y][rock.x + x] = char
      }
    }
  }
}

function getShape(shapeNr: number): Shape {
  const shape = shapes[shapeNr % shapes.length]
  return {
    chars: shape,
    width: shape[0].length,
    height: shape.length,
  }
}

function canPushRock(rock: Rock, cave: Cave, dir: -1 | 1) {
  let canPush = true
  loop: for (let y = 0; y < rock.shape.height; y++) {
    for (let x = 0; x < rock.shape.width; x++) {
      const char = rock.shape.chars[y][x]
      const newY = rock.y + y
      const newX = rock.x + x + dir
      cave[newY] ??= [...'.......']

      if (newX < 0 || newX > 6 || (char === '#' && cave[newY][newX] === '#')) {
        canPush = false
        break loop
      }
    }
  }
  return canPush
}

function canRockFall(rock: Rock, cave: Cave) {
  let canFall = true
  loop: for (let y = 0; y < rock.shape.height; y++) {
    for (let x = 0; x < rock.shape.width; x++) {
      const char = rock.shape.chars[y][x]
      const newY = rock.y + y - 1
      const newX = rock.x + x
      cave[newY] ??= [...'.......']

      if (newY < 0 || (char === '#' && cave[newY][newX] === '#')) {
        canFall = false
        break loop
      }
    }
  }
  return canFall
}

function dropRock(rock: Rock, cave: Cave, jetNr: number): number {
  const dir = jetPattern[jetNr] === '<' ? -1 : 1
  jetNr %= jetPattern.length
  jetNr += 1

  if (canPushRock(rock, cave, dir)) {
    rock.x += dir
  }

  if (canRockFall(rock, cave)) {
    rock.y -= 1
    return dropRock(rock, cave, jetNr)
  }

  putInCave(rock, cave)
  return jetNr
}

function getCaveHeight(cave: Cave) {
  return findLastIndex(cave, line => line.includes('#')) + 1
}

function createCave(options: { height?: number; rocks?: number }) {
  const cave: Cave = []
  let jetNr = 0
  let i = 0

  while (true) {
    const height = getCaveHeight(cave)
    const dropPoint = getCaveHeight(cave) + 3
    const rock = { x: 2, y: dropPoint, shape: getShape(i) }

    jetNr = dropRock(rock, cave, jetNr)
    i++

    if (options.rocks) {
      if (options.rocks === i) {
        break
      }
    }

    if (options.height) {
      if (height > options.height) {
        break
      }
    }
  }

  return {
    cave,
    rocks: i,
    height: getCaveHeight(cave),
  }
}

console.log('Part 1', createCave({ rocks: 2022 }).height)

const { startIndex: start, length: cycleHeight } = findCycles(
  createCave({ rocks: 5000 }).cave.map(x => x.join(''))
)[0]

const allRocks = 1e12
const rocksBeforeCycle = createCave({ height: start }).rocks
const rocksAfterFirstCycle = createCave({ height: start + cycleHeight }).rocks
const rocksToCreateCycle = rocksAfterFirstCycle - rocksBeforeCycle
const repeats = Math.floor((allRocks - rocksBeforeCycle) / rocksToCreateCycle)
const iterationsLeft = allRocks - repeats * rocksToCreateCycle
const heightWithoutCycles = createCave({ rocks: iterationsLeft }).height
console.log('Part 2', heightWithoutCycles + cycleHeight * repeats)
