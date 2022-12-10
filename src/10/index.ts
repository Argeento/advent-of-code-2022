import { getLinesFromInput, toNumber, inRange, divisible } from '../utils'

let x = 1
let sum = 0
let cycle = 0
let crt = ''

getLinesFromInput(__dirname).forEach(line => {
  exec()
  if (line.startsWith('add')) {
    exec()
    x += toNumber(line)
  }
})

function exec() {
  if (divisible(cycle + 21, 40)) sum += (cycle + 1) * x
  crt += inRange(x - 1, cycle % 40, x + 1) ? '#' : '.'
  cycle++
}

console.log('Part 1:', sum)
console.log(crt.match(/.{40}/g)!.join('\n'))
