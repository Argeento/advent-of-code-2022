import { add } from 'lodash'
import { asc, getLines } from '../utils'

const lines = getLines(__dirname)
const fs: Record<string, number> = {}
const path: string[] = []

for (const line of lines) {
  if (/ cd /.test(line)) {
    const arg = line.slice(5)
    arg === '..' ? path.pop() : path.push(arg)
  } else if (/^\d/.test(line)) {
    let tmp = ''
    path.forEach(dir => {
      tmp += dir
      fs[tmp] ??= 0
      fs[tmp] += parseInt(line)
    })
  }
}

const sum = Object.values(fs)
  .filter(size => size < 100_000)
  .reduce(add)

const size = Object.values(fs)
  .sort(asc)
  .find(size => fs['/'] - size <= 40_000_000)

console.log('Part 1:', sum)
console.log('Part 2:', size)
