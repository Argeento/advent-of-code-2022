import { multiply, range } from 'lodash'
import { desc, getInput, getLcm, toNumber, toNumbers } from '../utils'

type CalcWorry = (worry: number) => number

const input = getInput(__dirname)
  .split('\n\n')
  .map(x => x.split('\n'))

function getMonkeys(calcWorry: CalcWorry) {
  const lcm = getLcm(input.map(x => x[3]).map(toNumber))
  const monkeys = input.map(line => ({
    items: toNumbers(line[1]),
    divisible: toNumber(line[3]),
    targetTrue: toNumber(line[4]),
    targetFalse: toNumber(line[5]),
    inspects: 0,
    operation(old: number): number {
      return eval(line[2].slice(19))
    },
    throwItems() {
      this.inspects += this.items.length
      this.items.map(item => {
        const worry = calcWorry(this.operation(item)) % lcm
        const test = worry % this.divisible === 0
        const target = test ? this.targetTrue : this.targetFalse
        monkeys[target].items.push(worry)
      })
      this.items.length = 0
    },
  }))

  return monkeys
}

function business(rounds: number, calcWorry: CalcWorry) {
  const monkeys = getMonkeys(calcWorry)

  range(rounds).forEach(() => {
    monkeys.forEach(monkey => monkey.throwItems())
  })

  return monkeys
    .map(monkey => monkey.inspects)
    .sort(desc)
    .slice(0, 2)
    .reduce(multiply)
}

const part1 = business(20, x => Math.floor(x / 3))
const part2 = business(10_000, x => x)

console.log('Part 1', part1)
console.log('Part 2', part2)
