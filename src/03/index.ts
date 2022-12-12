import { getLines } from '../utils'
import { chunk, intersection, add } from 'lodash'

const rucksacks = getLines(__dirname).map(x => [...x])

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

const badgeSum = chunk(rucksacks, 3)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add)

console.log('part 1:', prioritySum)
console.log('part 2:', badgeSum)
