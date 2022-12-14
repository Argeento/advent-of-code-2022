import chalk from 'chalk'
import { flatMapDeep, isArray } from 'lodash'
import { getInput } from '../utils'

type Packet = number | Packet[]

const signal = getInput(__dirname)
  .split('\n\n')
  .map(packets => packets.split('\n').map(eval) as Packet[])
  .map(([left, right]) => ({ left, right }))

function toString(packet: Packet) {
  const original = JSON.stringify(packet)
  const originalLength = JSON.stringify(packet).length

  if (!isArray(packet)) {
    packet = [packet]
  }

  const str = flatMapDeep(packet)
    .map(nr => nr.toString().padStart(2, '0'))
    .join('')

  return { str, originalLength, original }
}

function compare(left: Packet, right: Packet) {
  const leftStr = toString(left)
  const rightSt = toString(right)

  console.log({ leftStr, rightSt })

  if (leftStr.str === rightSt.str) {
    return leftStr.originalLength < rightSt.originalLength ? 'left' : 'right'
  }

  if (leftStr.str < rightSt.str) {
    return 'left'
  }

  return 'right'
}

let sum = 0
signal.forEach((packets, i) => {
  console.log('Part:', i + 1)
  const x = compare(packets.left, packets.right)
  console.log(
    'co mniejsze?',
    x === 'left' ? chalk.green('left') : chalk.red('right')
  )
  console.log()
  console.log()

  if (x == 'left') {
    sum += i + 1
  }
})

console.log('Part 1:', sum)
