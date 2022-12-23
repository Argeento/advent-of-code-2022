import { add, negate } from 'lodash'
import { getLines, toNumbers } from '../utils'
import Graph from 'node-dijkstra'
import memoizee from 'memoizee'

const cubes = getLines(__dirname).map(toNumbers)
const lavaMap: Record<string, boolean> = {}

cubes.forEach(cube => {
  lavaMap[cube.toString()] = true
})

const isLava = (point: number[]) => !!lavaMap[point.toString()]
const isAir = negate(isLava)
const countLavaSides = memoizee(([x, y, z]: number[]) => {
  let sides = 0
  if (isLava([x + 1, y, z])) sides++
  if (isLava([x - 1, y, z])) sides++
  if (isLava([x, y + 1, z])) sides++
  if (isLava([x, y - 1, z])) sides++
  if (isLava([x, y, z + 1])) sides++
  if (isLava([x, y, z - 1])) sides++
  return sides
})

const p1Surface = cubes
  .map(countLavaSides)
  .map(sides => 6 - sides)
  .reduce(add)

console.log('Part 1:', p1Surface)

const airGraph = new Graph()
const volumeSide = Math.max(...cubes.flatMap(x => x)) + 2

for (let z = 0; z < volumeSide; z++) {
  for (let y = 0; y < volumeSide; y++) {
    for (let x = 0; x < volumeSide; x++) {
      const point = [x, y, z]
      if (isAir(point)) {
        const routes: Record<string, 1> = {}
        if (isAir([x + 1, y, z])) routes[[x + 1, y, z].toString()] = 1
        if (isAir([x - 1, y, z])) routes[[x - 1, y, z].toString()] = 1
        if (isAir([x, y + 1, z])) routes[[x, y + 1, z].toString()] = 1
        if (isAir([x, y - 1, z])) routes[[x, y - 1, z].toString()] = 1
        if (isAir([x, y, z + 1])) routes[[x, y, z + 1].toString()] = 1
        if (isAir([x, y, z - 1])) routes[[x, y, z - 1].toString()] = 1
        airGraph.addNode(point.toString(), routes)
      }
    }
  }
}

const freeAirPoint = [volumeSide - 1, volumeSide - 1, volumeSide - 1].toString()
let insideEdges = 0

for (let z = 0; z < volumeSide; z++) {
  for (let y = 0; y < volumeSide; y++) {
    for (let x = 0; x < volumeSide; x++) {
      const point = [x, y, z]
      if (isAir(point) && !airGraph.path(point.toString(), freeAirPoint)) {
        insideEdges += countLavaSides(point)
      }
    }
  }
}

console.log('Part 2:', p1Surface - insideEdges)
