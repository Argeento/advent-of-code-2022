import { add, getLinesFromFile } from '../utils'
import { chunk, intersection } from 'lodash'

const rucksacks = getLinesFromFile('./day-03/data.txt').map(x => [...x])

function itemToPriority(item: string) {
  const code = item.charCodeAt(0)
  return code - (code > 90 ? 96 : 38)
}

function commonItem(rucksacks: string[][]) {
  return intersection(...rucksacks)[0]
}

function divideRucksack(rucksack: string[]) {
  return chunk(rucksack, rucksack.length / 2)
}

const prioritySum = rucksacks
  .map(divideRucksack)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add)

console.log('part 1:', prioritySum)

const badgeSum = chunk(rucksacks, 3)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add)

console.log('part 2:', badgeSum)
