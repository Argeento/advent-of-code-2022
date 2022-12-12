import { intersection, range } from 'lodash'
import { getLines } from '../utils'

const pairs = getLines(__dirname).map(line =>
  line.split(',').map(range => range.split('-').map(Number))
)

let fullyOverlapping = 0
let anyOverlapping = 0

for (const pair of pairs) {
  const ranges = pair.map(elf => range(elf[0], elf[1] + 1))
  const overlaps = intersection(...ranges).length
  const shorterAssignment = Math.min(...ranges.map(x => x.length))
  if (overlaps === shorterAssignment) fullyOverlapping += 1
  if (overlaps > 0) anyOverlapping += 1
}

console.log('Part 1:', fullyOverlapping)
console.log('Part 2:', anyOverlapping)
