import chalk from 'chalk'
import { findLastIndex, range } from 'lodash'
import { findCycles } from '../find-cycles'
import { getInput, key } from '../utils'

type Shape = { chars: string[]; width: number; height: number }
type Rock = Point & { shape: Shape }
type Cave = string[][]

const jetPattern = getInput(__dirname).trim()

let jetNr = 0
function nextJet() {
  return jetPattern[jetNr++ % jetPattern.length] as '<' | '>'
}

const shapes = [
  ['####'],
  ['.#.', '###', '.#.'],
  ['###', '..#', '..#'],
  ['#', '#', '#', '#'],
  ['##', '##'],
]

let shapeNr = 0
function nextShape(): Shape {
  const shape = shapes[shapeNr++ % shapes.length]
  return {
    chars: shape,
    width: shape[0].length,
    height: shape.length,
  }
}

function drop(rock: Rock, cave: Cave) {
  const dir = nextJet() === '<' ? -1 : 1

  let canPush = true
  loop1: for (let shapeY = 0; shapeY < rock.shape.height; shapeY++) {
    for (let shapeX = 0; shapeX < rock.shape.width; shapeX++) {
      const char = rock.shape.chars[shapeY][shapeX]
      const newY = rock.y + shapeY
      const newX = rock.x + shapeX + dir

      cave[newY] ??= [...'.......']
      if (newX < 0 || newX > 6 || (char === '#' && cave[newY][newX] === '#')) {
        canPush = false
        break loop1
      }
    }
  }

  if (canPush) {
    rock.x += dir
  }

  let canFall = true
  loop2: for (let shapeY = 0; shapeY < rock.shape.height; shapeY++) {
    for (let shapeX = 0; shapeX < rock.shape.width; shapeX++) {
      const char = rock.shape.chars[shapeY][shapeX]
      const newY = rock.y + shapeY - 1
      const newX = rock.x + shapeX

      cave[newY] ??= [...'.......']
      if (newY < 0 || (char === '#' && cave[newY][newX] === '#')) {
        canFall = false
        break loop2
      }
    }
  }

  if (canFall) {
    rock.y -= 1
    drop(rock, cave)
  }
}

function draw(rock: Rock, cave: Cave) {
  for (let shapeY = 0; shapeY < rock.shape.height; shapeY++) {
    for (let shapeX = 0; shapeX < rock.shape.width; shapeX++) {
      const char = rock.shape.chars[shapeY][shapeX]
      if (char === '#') {
        cave[rock.y + shapeY][rock.x + shapeX] = char
      }
    }
  }
}

function createCave(caveLength: number, a?: number) {
  const cave: Cave = []
  let iterations = 0
  while (true) {
    iterations++
    const lastRockIndex = findLastIndex(cave, line => line.includes('#'))
    const dropPoint = lastRockIndex === -1 ? 3 : lastRockIndex + 4

    const rock: Rock = {
      x: 2,
      y: dropPoint,
      shape: nextShape(),
    }

    drop(rock, cave)
    draw(rock, cave)

    if (a && a === iterations) {
      break
    } else if (lastRockIndex > caveLength) {
      break
    }
  }

  return { cave, iterations }
}

const iterations = 2023
const startIndex = 2
const cycleLength = 982

const startCave = createCave(0, startIndex)
const startCycleCave = createCave(startIndex, startIndex + cycleLength)

console.log(startCycleCave)

const iterationsToCreateCycle = startCycleCave.iterations - startCave.iterations
const repeats = Math.floor(
  (iterations - startCave.iterations) / iterationsToCreateCycle
)

const iterationsLeft = iterations - repeats * iterationsToCreateCycle

const startEndCave = createCave(0, iterationsLeft)

const height = repeats * cycleLength + startEndCave.cave.length //  wolna przestrzeń na górze
console.log(height) // tu jeszzce jest kilka set ze startu i endu
console.log(chalk.green(3068 + ' <- prawidłowe rozwiązanie'))
console.log('diff: ', 3068 - height)

// 1514285714288 - correct

const cycles = findCycles(
  createCave(2022)
    .cave.map(x => x.join(''))
    .filter(x => x.indexOf('#') >= 0),
  {
    // minCycleLength: 1400,
    // minRepeats: 6,
    // maxRepeats: 15,
  }
)
  .map(x => {
    const { elements, rate, ...a } = x
    return a
  })
  .slice(0, 2)

console.log(cycles)

function printCave(cave: string[][]) {
  console.log(
    [...cave]
      .reverse()
      .map((x, i, arr) => x.join('') + ' ' + (arr.length - i - 1))
      .join('\n')
  )
  console.log()
}
