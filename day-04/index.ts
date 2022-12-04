import { intersection } from 'lodash'
import { getLinesFromFile } from '../utils'

const pairs = getLinesFromFile('./day-04/data.txt').map(line =>
  line.split(',').map(range => range.split('-').map(Number))
)

function createRange([start, stop]: number[]) {
  const arr: number[] = new Array(stop - start + 1)
  for (let i = 0; i < arr.length; i++) arr[i] = start + i
  return arr
}

let fullyOverlapping = 0
let anyOverlapping = 0

for (const pair of pairs) {
  const ranges = pair.map(createRange)
  const overlaps = intersection(...ranges).length
  const shorterAssignment = Math.min(...ranges.map(x => x.length))
  if (overlaps === shorterAssignment) fullyOverlapping += 1
  if (overlaps > 0) anyOverlapping += 1
}

console.log('Part 1:', fullyOverlapping)
console.log('Part 2:', anyOverlapping)
