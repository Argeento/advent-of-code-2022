import { range } from 'lodash'
import { getLines } from '../utils'

const signal = getLines(__dirname)[0]

function findStartIndex(signal: string, markerLength: number) {
  let regex = '(.)'
  for (let i = 2; i <= markerLength; i++) {
    const negativeLookAhead = range(1, i).map(n => `\\${n}`)
    regex += `(?!(?:${negativeLookAhead.join('|')}))(.)`
  }
  return signal.match(new RegExp(regex))!.index! + markerLength
}

console.log('Part 1:', findStartIndex(signal, 4))
console.log('Part 2:', findStartIndex(signal, 14))
