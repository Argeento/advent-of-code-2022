import { range, values } from 'lodash'
import { getLinesFromInput, last } from '../utils'

const dirs = getLinesFromInput(__dirname)
  .map(line => line.split(' '))
  .map(([dir, steps]) => dir.repeat(+steps))
  .join('')

function move(knot: Point, dir: string) {
  if (dir === 'R') knot.x++
  if (dir === 'L') knot.x--
  if (dir === 'U') knot.y++
  if (dir === 'D') knot.y--
}

function follow(follower: Point, leader: Point) {
  const deltaX = leader.x - follower.x
  const deltaY = leader.y - follower.y
  const distance = Math.hypot(deltaX, deltaY)

  if (distance < 2) return

  // prettier-ignore
  const dir = Math.abs(deltaX) > Math.abs(deltaY)
    ? deltaX > 0 ? 'R' : 'L'
    : deltaY > 0 ? 'U' : 'D'

  move(follower, dir)

  if (distance > 2) {
    const align = 'UD'.includes(dir) ? 'x' : 'y'
    follower[align] += Math.sign(align === 'x' ? deltaX : deltaY)
  }
}

function tailPositions(dirs: string, ropeLength: number) {
  const positions = new Set<string>().add('0,0')
  const rope: Point[] = range(ropeLength).map(() => ({ x: 0, y: 0 }))

  for (const dir of dirs) {
    move(rope[0], dir)
    for (let i = 1; i < rope.length; i++) {
      follow(rope[i], rope[i - 1])
    }
    positions.add(values(last(rope)).join())
  }

  return positions.size
}

console.log('Part 1:', tailPositions(dirs, 2))
console.log('Part 2:', tailPositions(dirs, 10))
