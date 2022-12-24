import { negate } from 'lodash'
import { getLines, toKeys } from '../utils'

const monkeys = getLines(__dirname).map(x => {
  if (x.startsWith('humn')) return 'humn = NaN'
  return x.replace(':', '=')
})

// @ts-ignore
while (typeof global.root !== 'number') {
  for (const monkey of monkeys) {
    try {
      eval(`global.${monkey}`)
    } catch (e) {}
  }
}

const p2Monkeys = getLines(__dirname)
  .map(x => x.split(': '))
  .map(toKeys('name', 'value'))

// @ts-ignore
const isNumberMonkey = monkey => !Number.isNaN(global[monkey.name])
const numberMonkeys = p2Monkeys.filter(isNumberMonkey).map(monkey => {
  monkey.value = eval(monkey.value)
  return monkey
})

let humanMonkeys = p2Monkeys.filter(negate(isNumberMonkey))
const human = humanMonkeys.find(m => m.name === 'humn')!
human.value = 'x'

humanMonkeys.forEach(humanMonkey => {
  const numberMonkey = numberMonkeys.find(numberMonkey =>
    humanMonkey.value.includes(numberMonkey.name)
  )

  if (numberMonkey) {
    humanMonkey.value = humanMonkey.value.replace(
      numberMonkey.name,
      numberMonkey.value
    )
  }
})

const rootMonkey = humanMonkeys.find(m => m.name === 'root')!
const topMonkeyName = rootMonkey.value.match(/[a-z]{4}/)![0]
const value = rootMonkey.value.match(/\d+/)![0]
humanMonkeys = humanMonkeys.filter(m => m !== rootMonkey)

let eq = `${topMonkeyName} = ${value}`
while (!eq.includes('x')) {
  const monkey = humanMonkeys.find(m => eq.includes(m.name))!
  eq = eq.replace(monkey.name, `(${monkey.value})`)
}

console.log('Part 2 eq:')
console.log(eq)
