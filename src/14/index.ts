import { chunk, last } from 'lodash'
import { getLines, toKeys, key, createArray, toNumbers, asc } from '../utils'

enum Unit {
  AIR,
  ROCK,
  SAND,
}

const rocks = getLines(__dirname)
  .map(toNumbers)
  .map(p => chunk(p, 2).map(toKeys('x', 'y')))

const maxX = Math.max(...rocks.flatMap(p => p.map(key('x'))))
const maxY = Math.max(...rocks.flatMap(p => p.map(key('y'))))
const cave = createArray(maxY + 2, maxX * 2, Unit.AIR)

// Create rocks
rocks.forEach(path => {
  for (let i = 1; i < path.length; i++) {
    const [from, to] = path.slice(i - 1, i + 1)
    const [minY, maxY] = [from.y, to.y].sort(asc)
    const [minX, maxX] = [from.x, to.x].sort(asc)

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        cave[y][x] = Unit.ROCK
      }
    }
  }
})

function drop(y: number, x: number): Point {
  const down = cave[y + 1]?.[x]
  const downLeft = cave[y + 1]?.[x - 1]
  const downRight = cave[y + 1]?.[x + 1]

  if (down === Unit.AIR) {
    return drop(y + 1, x)
  } else if (downLeft === Unit.AIR) {
    return drop(y + 1, x - 1)
  } else if (downRight === Unit.AIR) {
    return drop(y + 1, x + 1)
  }

  return { x, y }
}

let p1 = 0
let p2 = 0

while (cave[0][500] !== Unit.SAND) {
  const { y, x } = drop(0, 500)
  cave[y][x] = Unit.SAND

  if (!last(cave)?.includes(Unit.SAND)) {
    p1 += 1
  }

  p2 += 1
}

console.log('Part 1:', p1)
console.log('Part 2:', p2)
