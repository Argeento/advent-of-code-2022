import { add, desc, getLinesFromFile } from '../utils'

const lines = getLinesFromFile('./day-01/data.txt')
const elves: number[] = [0]

for (const line of lines) {
  if (line === '') {
    elves.unshift(0)
  } else {
    elves[0] += parseInt(line)
  }
}

elves.sort(desc)

console.log(`Part 1: ${elves[0]}`)
console.log(`Part 2: ${elves.slice(0, 3).reduce(add)}`)
