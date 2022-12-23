import { getLines, toKeys, toNumbers } from '../utils'

const input = getLines(__dirname).map(toNumbers).map(toKeys('value'))
const refsOrder = [...input]

function getSum(mixes: number, multiplier: number) {
  const refs = [...input]

  for (let i = 0; i < mixes; i++) {
    for (let j = 0; j < refs.length; j++) {
      const index = refs.indexOf(refsOrder[j])
      const ref = refs.splice(index, 1)[0]
      let newIndex = (index + ref.value * multiplier) % refs.length
      refs.splice(newIndex, 0, ref)
      if (newIndex === 0) refs.push(refs.shift()!)
    }
  }

  let sum = 0
  let zeroIndex = refs.findIndex(ref => ref.value === 0)
  for (let i = 1000; i <= 3000; i += 1000) {
    sum += refs[(zeroIndex + i) % refs.length].value * multiplier
  }

  return sum
}

console.log('Part 1:', getSum(1, 1))
console.log('Part 2:', getSum(10, 811589153))
