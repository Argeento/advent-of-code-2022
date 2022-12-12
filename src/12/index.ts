import EasyStar from 'easystarjs'
import { range } from 'lodash'
import { getArray2dFromInput, loop2d } from '../utils'

const input = getArray2dFromInput(__dirname)
const start = { x: 0, y: 0 }
const end = { x: 0, y: 0 }
const lowestPoints: Point[] = []
const pathMap: number[][] = range(input.length).map(() =>
  range(input[0].length).map(() => 0)
)

const map = new EasyStar.js()
map.setGrid(pathMap)
map.setAcceptableTiles([0])

function toHeight(letter?: string) {
  return letter?.charCodeAt(0) ?? 99
}

loop2d(input, (y, x) => {
  if (input[y][x] === 'S') {
    start.x = x
    start.y = y
    input[y][x] = 'a'
  }

  if (input[y][x] === 'E') {
    end.x = x
    end.y = y
    input[y][x] = 'z'
  }

  if (input[y][x] === 'a') {
    lowestPoints.push({ x, y })
  }

  const dirs: EasyStar.Direction[] = []
  const current = toHeight(input[y][x])
  const up = toHeight(input[y - 1]?.[x])
  const down = toHeight(input[y + 1]?.[x])
  const left = toHeight(input[y][x - 1])
  const right = toHeight(input[y][x + 1])

  if (current - up < 2) dirs.push(EasyStar.TOP)
  if (current - down < 2) dirs.push(EasyStar.BOTTOM)
  if (current - left < 2) dirs.push(EasyStar.LEFT)
  if (current - right < 2) dirs.push(EasyStar.RIGHT)

  map.setDirectionalCondition(x, y, dirs)
})

function getLength(start: Point, end: Point) {
  return new Promise<number>(resolve => {
    map.findPath(start.x, start.y, end.x, end.y, steps => {
      resolve(steps ? steps.length - 1 : Infinity)
    })
  })
}

getLength(start, end).then(path => {
  console.log('Part 1:', path)
})

Promise.all(lowestPoints.map(p => getLength(p, end))).then(paths =>
  console.log('Part 2:', Math.min(...paths))
)

map.calculate()
