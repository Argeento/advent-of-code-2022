import { cloneDeep } from 'lodash'
import { getLines, match } from '../utils'

type Blizzard = Point3d & { dir: string }
const input: Blizzard[] = []
getLines(__dirname).forEach((line, y) => {
  line.split('').forEach((dir, x) => {
    if ('><v^'.includes(dir)) input.push({ x, y, z: 0, dir })
  })
})

const str = <T extends Point>(b: T) => `${b.x},${b.y}`
const map = getLines(__dirname)
const layers: Blizzard[][] = [cloneDeep(input)]
const mapHeight = map.length
const mapWidth = map[0].length
const start = { x: 1, y: 0 }
const end = { x: mapWidth - 2, y: mapHeight - 1 }

function getNextBlizzardsPositions() {
  return input.map(blizzard => {
    blizzard.z++
    match(blizzard.dir, {
      v() {
        blizzard.y += 1
        if (blizzard.y === mapHeight - 1) blizzard.y = 1
      },
      '^'() {
        blizzard.y -= 1
        if (blizzard.y === 0) blizzard.y = mapHeight - 2
      },
      '<'() {
        blizzard.x -= 1
        if (blizzard.x === 0) blizzard.x = mapWidth - 2
      },
      '>'() {
        blizzard.x += 1
        if (blizzard.x === mapWidth - 1) blizzard.x = 1
      },
    })
    return blizzard
  })
}

function isBlizzard(x: number, y: number, z: number) {
  return layers[z].some(b => b.x === x && b.y === y)
}

function findWay(start: Point, end: Point, time: number) {
  let player: Record<string, boolean> = { [str(start)]: true }
  let minutes = 0

  for (let z = time; true; z++) {
    while (layers.length <= z) layers.push(getNextBlizzardsPositions())
    const possibleMoves: Record<string, boolean> = {}

    Object.keys(player).forEach(coords => {
      const [x, y] = coords.split(',').map(Number)

      if (!isBlizzard(x, y, z)) {
        possibleMoves[str({ x, y })] = true
      }

      if (
        x < mapWidth - 2 &&
        y !== 0 &&
        y !== mapHeight - 1 &&
        !isBlizzard(x + 1, y, z)
      ) {
        possibleMoves[str({ x: x + 1, y })] = true
      }

      if (x > 1 && y !== 0 && y !== mapHeight - 1 && !isBlizzard(x - 1, y, z)) {
        possibleMoves[str({ x: x - 1, y })] = true
      }

      if (
        (y < mapHeight - 2 || (y === mapHeight - 2 && x === end.x)) &&
        !isBlizzard(x, y + 1, z)
      ) {
        possibleMoves[str({ x, y: y + 1 })] = true
      }

      if ((y > 1 || (y === 1 && x === end.x)) && !isBlizzard(x, y - 1, z)) {
        possibleMoves[str({ x, y: y - 1 })] = true
      }
    })

    if (Object.keys(possibleMoves).some(coords => coords === str(end))) {
      break
    }

    minutes++
    player = possibleMoves
  }

  return minutes
}

const firstTripTime = findWay(start, end, 0)
const tripBackTime = findWay(end, start, firstTripTime)
const backToGoalTime = findWay(start, end, firstTripTime + tripBackTime)

console.log('Part 1:', firstTripTime)
console.log('Part 2:', firstTripTime + tripBackTime + backToGoalTime)
