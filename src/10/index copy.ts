import { inRange } from 'lodash'
import { getLinesFromInput } from '../utils'

const program = getLinesFromInput(__dirname).map(line => {
  const [command, arg] = line.split(' ')
  return { command, arg: +arg }
})

const registerX = [1]
let x = 1

for (const { command, arg } of program) {
  registerX.push(x)

  if (command === 'addx') {
    registerX.push((x += arg))
  }
}

// part 1
let sum = 0
for (let i = 20; i <= registerX.length; i += 40) {
  sum += registerX[i - 1] * i
}
console.log('Part 1:', sum)

// part 2
let crtPos = 0
let height = 0

const lines: string[] = []
for (let i = 0; i < registerX.length - 1; i++) {
  const sprite = registerX[i]
  lines[height] ??= ''
  lines[height] += inRange(crtPos, sprite - 1, sprite + 2) ? '#' : '.'

  crtPos += 1
  if (crtPos === 40) {
    crtPos = 0
    height += 1
  }
}

console.log(lines.join('\n'))
