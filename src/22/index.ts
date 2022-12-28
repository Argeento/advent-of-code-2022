import { findIndex, findLastIndex, negate } from 'lodash'
import { getInput, key, match } from '../utils'

type Player = Point & { facing: 0 | 90 | 180 | 270 }
enum Tile {
  EMPTY = ' ',
  OPEN = '.',
  WALL = '#',
}
enum Turn {
  R = 'R',
  L = 'L',
}
enum Face {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  FRONT = 'FRONT',
  LEFT = 'LEFT',
  BACK = 'BACK',
  RIGHT = 'RIGHT',
  NONE = 'NONE',
}
enum Dir {
  UP = 0,
  RIGHT = 90,
  DOWN = 180,
  LEFT = 270,
}
const CUBE_WIDTH = 50
const input = getInput(__dirname).split('\n\n')
const map = input[0].split('\n').map(x => [...x]) as Tile[][]
const mapWidth = Math.max(...map.map(key('length')))
const mapHeight = map.length

for (let y = 0; y < mapHeight; y++) {
  for (let x = 0; x < mapWidth; x++) {
    map[y][x] ??= Tile.EMPTY
  }
}

const commands = input[1]
  .trim()
  .match(/(?:\d+|[A-Z]+)/g)!
  .map(x => (/\d/.test(x) ? parseInt(x) : x)) as [number, Turn]

const isEmpty = (tile: Tile) => tile === Tile.EMPTY || tile === undefined
const isNotEmpty = negate(isEmpty)

function changeDir(player: Player, turn: Turn) {
  player.facing += turn === Turn.L ? 270 : 90
  player.facing %= 360
}

function p1Move(player: Player, distance: number) {
  let newY = player.y
  let newX = player.x

  for (let i = 0; i < distance; i++) {
    if (player.facing === 0) newY--
    if (player.facing === 90) newX++
    if (player.facing === 180) newY++
    if (player.facing === 270) newX--

    const deltaX = newX - player.x
    const deltaY = newY - player.y

    if (isEmpty(map[newY]?.[newX])) {
      if (deltaX < 0) {
        newX = findLastIndex(map[newY], isNotEmpty)
      }
      if (deltaX > 0) {
        newX = findIndex(map[newY], isNotEmpty)
      }
      if (deltaY > 0) {
        newY = findIndex(map, row => isNotEmpty(row[newX]))
      }
      if (deltaY < 0) {
        newY = findLastIndex(map, row => isNotEmpty(row[newX]))
      }
    }

    if (map[newY][newX] === Tile.WALL) {
      break
    }

    player.x = newX
    player.y = newY
  }
}

const faces = [
  [Face.NONE, Face.FRONT, Face.RIGHT],
  [Face.NONE, Face.BOTTOM, Face.NONE],
  [Face.LEFT, Face.BACK, Face.NONE],
  [Face.TOP, Face.NONE, Face.NONE],
]

function getFace(y: number, x: number): Face {
  const faceX = Math.floor(x / CUBE_WIDTH)
  const faceY = Math.floor(y / CUBE_WIDTH)
  return faces[faceY][faceX]
}

function getOnMapPosition(face: Face, y: number, x: number): Point {
  let faceY = faces.findIndex(f => f.includes(face))
  let faceX = faces[faceY].findIndex(f => f === face)
  return { y: y + faceY * CUBE_WIDTH, x: x + faceX * CUBE_WIDTH }
}

function p2Move(player: Player, distance: number) {
  let face = getFace(player.y, player.x)
  let newFacing = player.facing
  let faceX = player.x % CUBE_WIDTH
  let faceY = player.y % CUBE_WIDTH

  for (let i = 0; i < distance; i++) {
    if (newFacing === 0) faceY--
    if (newFacing === 90) faceX++
    if (newFacing === 180) faceY++
    if (newFacing === 270) faceX--

    if (faceY < 0) {
      match(face, {
        [Face.FRONT]() {
          face = Face.TOP
          faceY = faceX
          faceX = 0
          newFacing = Dir.RIGHT
        },
        [Face.BOTTOM]() {
          face = Face.FRONT
          faceY = CUBE_WIDTH - 1
        },
        [Face.BACK]() {
          face = Face.BOTTOM
          faceY = CUBE_WIDTH - 1
        },
        [Face.LEFT]() {
          face = Face.BOTTOM
          faceY = faceX
          faceX = 0
          newFacing = Dir.RIGHT
        },
        [Face.RIGHT]() {
          face = Face.TOP
          faceY = CUBE_WIDTH - 1
        },
        [Face.TOP]() {
          face = Face.LEFT
          faceY = CUBE_WIDTH - 1
        },
        [Face.NONE]() {
          throw 1
        },
      })
    }

    if (faceY === CUBE_WIDTH) {
      match(face, {
        [Face.FRONT]() {
          face = Face.BOTTOM
          faceY = 0
        },
        [Face.BOTTOM]() {
          face = Face.BACK
          faceY = 0
        },
        [Face.BACK]() {
          face = Face.TOP
          faceY = faceX
          faceX = CUBE_WIDTH - 1
          newFacing = Dir.LEFT
        },
        [Face.LEFT]() {
          face = Face.TOP
          faceY = 0
        },
        [Face.RIGHT]() {
          face = Face.BOTTOM
          faceY = faceX
          faceX = CUBE_WIDTH - 1
          newFacing = Dir.LEFT
        },
        [Face.TOP]() {
          face = Face.RIGHT
          faceY = 0
        },
        [Face.NONE]() {
          throw 1
        },
      })
    }

    if (faceX === CUBE_WIDTH) {
      match(face, {
        [Face.FRONT]() {
          face = Face.RIGHT
          faceX = 0
        },
        [Face.BOTTOM]() {
          face = Face.RIGHT
          faceX = faceY
          faceY = CUBE_WIDTH - 1
          newFacing = Dir.UP
        },
        [Face.BACK]() {
          face = Face.RIGHT
          faceY = CUBE_WIDTH - faceY - 1
          faceX = CUBE_WIDTH - 1
          newFacing = Dir.LEFT
        },
        [Face.LEFT]() {
          face = Face.BACK
          faceX = 0
        },
        [Face.RIGHT]() {
          face = Face.BACK
          faceY = CUBE_WIDTH - faceY - 1
          faceX = CUBE_WIDTH - 1
          newFacing = Dir.LEFT
        },
        [Face.TOP]() {
          face = Face.BACK
          faceX = faceY
          faceY = CUBE_WIDTH - 1
          newFacing = Dir.UP
        },
        [Face.NONE]() {
          throw 1
        },
      })
    }

    if (faceX < 0) {
      match(face, {
        [Face.FRONT]() {
          face = Face.LEFT
          faceY = CUBE_WIDTH - faceY - 1
          faceX = 0
          newFacing = Dir.RIGHT
        },
        [Face.BOTTOM]() {
          face = Face.LEFT
          faceX = faceY
          faceY = 0
          newFacing = Dir.DOWN
        },
        [Face.BACK]() {
          face = Face.LEFT
          faceX = CUBE_WIDTH - 1
        },
        [Face.LEFT]() {
          face = Face.FRONT
          faceY = CUBE_WIDTH - faceY - 1
          faceX = 0
          newFacing = Dir.RIGHT
        },
        [Face.RIGHT]() {
          face = Face.FRONT
          faceX = CUBE_WIDTH - 1
        },
        [Face.TOP]() {
          face = Face.FRONT
          faceX = faceY
          faceY = 0
          newFacing = Dir.DOWN
        },
        [Face.NONE]() {
          throw 1
        },
      })
    }

    const { x, y } = getOnMapPosition(face, faceY, faceX)

    if (map[y][x] === Tile.WALL) {
      break
    }

    player.x = x
    player.y = y
    player.facing = newFacing
  }
}

function getPassword(player: Player) {
  changeDir(player, Turn.L)
  return 1000 * (player.y + 1) + 4 * (player.x + 1) + player.facing / 90
}

function createPlayer(): Player {
  return {
    y: 0,
    x: map[0].findIndex(point => point === Tile.OPEN),
    facing: 90,
  }
}

const p1Player = createPlayer()
const p2Player = createPlayer()

commands.forEach(command => {
  if (typeof command === 'number') {
    p1Move(p1Player, command)
    p2Move(p2Player, command)
  } else {
    changeDir(p1Player, command)
    changeDir(p2Player, command)
  }
})

console.log('Part 1', getPassword(p1Player))
console.log('Part 2', getPassword(p2Player))
