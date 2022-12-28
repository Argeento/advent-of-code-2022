import { add } from 'lodash'
import { getLines } from '../utils'

const input = getLines(__dirname)

function toDec(snafu: string) {
  return [...snafu]
    .reverse()
    .map(char => char.replace('-', '-1').replace('=', '-2'))
    .map((char, i) => parseInt(char) * 5 ** i)
    .reduce(add)
}

function toSnafu(nr: number) {
  const snafu = [...nr.toString(5)].map(Number).reverse()

  snafu.forEach((x, i) => {
    if (x > 2) {
      snafu[i] -= 5
      snafu[i + 1] ??= 0
      snafu[i + 1] += 1
    }
  })

  return snafu
    .reverse()
    .map(x => '=-012'[x + 2])
    .join('')
}

const fuel = input.map(toDec).reduce(add)
console.log('Part 1:', toSnafu(fuel))
