import { asc, getLines, match } from '../utils'

type Elf = Point & { propose: Point | null; name: string }
enum Dir {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
}

const elves: Elf[] = []
const dirs = [Dir.E, Dir.N, Dir.S, Dir.W] as const

getLines(__dirname).forEach((line, y) => {
  line.split('').forEach((char, x) => {
    if (char === '#') elves.push({ x, y, propose: null, name: `${x}|${y}` })
  })
})

function dirGeneratorFactory() {
  const tmpDirs = [...dirs]
  return function () {
    tmpDirs.push(tmpDirs.shift()!)
    return [...tmpDirs]
  }
}

const nextDirs = dirGeneratorFactory()
const isElfOnPosition = ({ x, y }: Point) => {
  return elves.some(elf => elf.x === x && elf.y === y)
}

function isAnyElfOnPositions(positions: Point[]) {
  return positions.some(isElfOnPosition)
}

function getPopsNumberOnPosition({ x, y }: Point) {
  return elves.filter(elf => elf.propose?.x === x && elf.propose.y === y).length
}

for (let i = 0; true; i++) {
  const dirs = nextDirs()
  // propose
  let elvesOnRightPosition = 0
  elfLoop: for (const elf of elves) {
    elf.propose = null
    if (
      !isAnyElfOnPositions([
        { x: elf.x, y: elf.y - 1 },
        { x: elf.x, y: elf.y + 1 },
        { x: elf.x - 1, y: elf.y },
        { x: elf.x + 1, y: elf.y },
        { x: elf.x - 1, y: elf.y - 1 },
        { x: elf.x - 1, y: elf.y + 1 },
        { x: elf.x + 1, y: elf.y - 1 },
        { x: elf.x + 1, y: elf.y + 1 },
      ])
    ) {
      elvesOnRightPosition++
      continue
    }

    for (const dir of dirs) {
      match(dir, {
        N() {
          if (
            !isAnyElfOnPositions([
              { x: elf.x, y: elf.y - 1 },
              { x: elf.x - 1, y: elf.y - 1 },
              { x: elf.x + 1, y: elf.y - 1 },
            ])
          ) {
            elf.propose = { x: elf.x, y: elf.y - 1 }
          }
        },
        S() {
          if (
            !isAnyElfOnPositions([
              { x: elf.x, y: elf.y + 1 },
              { x: elf.x - 1, y: elf.y + 1 },
              { x: elf.x + 1, y: elf.y + 1 },
            ])
          ) {
            elf.propose = { x: elf.x, y: elf.y + 1 }
          }
        },
        E() {
          if (
            !isAnyElfOnPositions([
              { x: elf.x + 1, y: elf.y },
              { x: elf.x + 1, y: elf.y - 1 },
              { x: elf.x + 1, y: elf.y + 1 },
            ])
          ) {
            elf.propose = { x: elf.x + 1, y: elf.y }
          }
        },
        W() {
          if (
            !isAnyElfOnPositions([
              { x: elf.x - 1, y: elf.y - 1 },
              { x: elf.x - 1, y: elf.y },
              { x: elf.x - 1, y: elf.y + 1 },
            ])
          ) {
            elf.propose = { x: elf.x - 1, y: elf.y }
          }
        },
      })

      if (elf.propose !== null) {
        continue elfLoop
      }
    }
  }

  if (elvesOnRightPosition === elves.length) {
    console.log('Part 2:', i + 1)
    break
  }

  // move
  for (let elf of elves) {
    if (elf.propose === null) continue
    if (getPopsNumberOnPosition(elf.propose) === 1) {
      elf.x = elf.propose.x
      elf.y = elf.propose.y
    }
  }

  if (i === 9) {
    elves.sort((a, b) => asc(a.x, b.x))
    const maxLeft = elves[0].x
    const maxRight = elves[elves.length - 1].x
    elves.sort((a, b) => asc(a.y, b.y))
    const maxTop = elves[0].y
    const maxBottom = elves[elves.length - 1].y
    const area = (maxRight - maxLeft + 1) * (maxBottom - maxTop + 1)
    console.log('Part 1:', area - elves.length)
  }
}
