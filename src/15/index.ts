import { arrayUnion } from 'interval-operations'
import { getLines, getManhattanDistance, toNumbers } from '../utils'

const P1_Y = 2_000_000
const P2_LIMIT = 4_000_000

const p1Ranges: [number, number][] = []
const p2Cols: Record<number, [number, number][]> = {}

getLines(__dirname).map(line => {
  const [sensorX, sensorY, beaconX, beaconY] = toNumbers(line)
  const sensor = { x: sensorX, y: sensorY }
  const beacon = { x: beaconX, y: beaconY }
  const radius = getManhattanDistance(sensor, beacon)
  const p1Range: number[] = []

  for (let i = -radius; i <= radius; i++) {
    const x = sensor.x + i
    const y1 = sensor.y + radius - Math.abs(i)
    const y2 = sensor.y + Math.abs(i) - radius

    if (y1 === P1_Y || y2 === P1_Y) {
      p1Range.push(x)
    }

    if (
      (y1 >= 0 || y2 >= 0) &&
      (y1 <= P2_LIMIT || y2 <= P2_LIMIT) &&
      x <= P2_LIMIT &&
      x >= 0
    ) {
      p2Cols[x] ??= []
      p2Cols[x].push(y1 < y2 ? [y1, y2] : [y2, y1])
    }
  }

  if (p1Range.length === 1) {
    p1Range.push(p1Range[0])
  }

  if (p1Range.length === 2) {
    p1Ranges.push(p1Range as [number, number])
  }
})

const p1 = arrayUnion(p1Ranges)[0] as number[]
console.log('Part 1:', p1[1] - p1[0])

for (const x in p2Cols) {
  const ranges = arrayUnion(p2Cols[x])
  if (ranges.length > 1) {
    const y = +ranges[0][1] + 1
    console.log('Part 2:', +x * P2_LIMIT + y)
    break
  }
}
