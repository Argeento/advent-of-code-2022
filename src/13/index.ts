import { isArray } from 'lodash'
import { getInput, getLines } from '../utils'

type Packet = number | Packet[]
enum Comparison {
  EQUAL = 0,
  LESS_THAN = -1,
  GREATER_THAN = 1,
}

const signal = getInput(__dirname)
  .split('\n\n')
  .map(packets => packets.split('\n').map(eval) as Packet[])
  .map(([left, right]) => ({ left, right }))

function compare(left: Packet, right: Packet): Comparison {
  if (isArray(left) && isArray(right)) {
    const length = Math.min(left.length, right.length)
    for (let i = 0; i < length; i++) {
      const comparison = compare(left[i], right[i])
      if (comparison !== Comparison.EQUAL) {
        return comparison
      }
    }

    if (left[length] === undefined && right[length] === undefined) {
      return Comparison.EQUAL
    }

    if (left[length] === undefined) {
      return Comparison.LESS_THAN
    }

    return Comparison.GREATER_THAN
  }

  if (isArray(left)) {
    return compare(left, [right])
  }

  if (isArray(right)) {
    return compare([left], right)
  }

  if (left < right) {
    return Comparison.LESS_THAN
  } else if (left === right) {
    return Comparison.EQUAL
  }

  return Comparison.GREATER_THAN
}

let sum = 0
signal.forEach((packets, i) => {
  if (compare(packets.left, packets.right) === Comparison.LESS_THAN) {
    sum += i + 1
  }
})

console.log('Part 1:', sum)

const signal2 = getLines(__dirname)
  .filter(x => x)
  .map(eval)

signal2.push([[2]], [[6]])
signal2.sort(compare)

const a = signal2.findIndex(x => JSON.stringify(x) == '[[2]]') + 1
const b = signal2.findIndex(x => JSON.stringify(x) == '[[6]]') + 1

console.log('Part 2:', a * b)
