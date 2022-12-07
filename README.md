# Advent of Code 2022

My solutions for [Advent of Code 2022](https://adventofcode.com/2022/) in TypeScript

## Story

Santa's reindeer typically eat regular reindeer food, but they need a lot of magical energy to deliver presents on Christmas. For that, their favorite snack is a special type of **star fruit** that only grows deep in the jungle. The Elves have brought you on their annual expedition to the grove where the fruit grows.

To supply enough magical energy, the expedition needs to retrieve a minimum of fifty stars by December 25th. Although the Elves assure you that the grove has plenty of fruit, you decide to grab any fruit you see along the way, just in case.

## Star fruits

| Day |            Quest             | Part 1 | Part 2 |
| :-: | :--------------------------: | :----: | :----: |
|  1  |    [Calorie Counting][1]     | :star: | :star: |
|  2  |   [Rock Paper Scissors][2]   | :star: | :star: |
|  3  | [Rucksack Reorganization][3] | :star: | :star: |
|  4  |      [Camp Cleanup][4]       | :star: | :star: |
|  5  |      [Supply Stacks][5]      | :star: | :star: |
|  6  |     [Tuning Trouble][6]      | :star: | :star: |
|  7  | [No Space Left On Device][7] | :star: | :star: |

## The journey

### Day 1: Calorie Counting

The jungle must be too overgrown and difficult to navigate in vehicles or access from the air; the Elves' expedition traditionally goes on foot. As your boats approach land, the Elves begin taking inventory of their supplies. One important consideration is food - in particular, the number of Calories each Elf is carrying.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/01/story.png">

Quest: [adventofcode.com/2022/day/1](https://adventofcode.com/2022/day/1)

#### Solution

```ts
import { add, desc, getLinesFromInput } from '../utils'

const lines = getLinesFromInput(__dirname)
const elves: number[] = [0]

for (const line of lines) {
  if (line === '') {
    elves.unshift(0)
  } else {
    elves[0] += parseInt(line)
  }
}

elves.sort(desc)

console.log('Part 1:', elves[0])
console.log('Part 2:', elves.slice(0, 3).reduce(add))
```

---

### Day 2: Rock Paper Scissors

The Elves begin to set up camp on the beach. To decide whose tent gets to be closest to the snack storage, a giant Rock Paper Scissors tournament is already in progress.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/02/story.png">

Quest: [adventofcode.com/2022/day/2](https://adventofcode.com/2022/day/2)

#### Solution

```ts
import { add, getLinesFromInput } from '../utils'

type Strategy = `${'A' | 'B' | 'C'}${'X' | 'Y' | 'Z'}`
type PointsMap = Record<Strategy, number>

const W = 6 // WIN
const D = 3 // DRAW
const L = 0 // LOSE

const X = 1 // A - ROCK
const Y = 2 // B - PAPER
const Z = 3 // C - SCISSORS

const strategies = getLinesFromInput(__dirname).map(
  line => line.replace(' ', '') as Strategy
)

const pointsMap: PointsMap = {
  AX: D + X,
  AY: W + Y,
  AZ: L + Z,
  BX: L + X,
  BY: D + Y,
  BZ: W + Z,
  CX: W + X,
  CY: L + Y,
  CZ: D + Z,
}

const pointsMap2: PointsMap = {
  AX: L + Z,
  AY: D + X,
  AZ: W + Y,
  BX: L + X,
  BY: D + Y,
  BZ: W + Z,
  CX: L + Y,
  CY: D + Z,
  CZ: W + X,
}

console.log('Part 1:', strategies.map(s => pointsMap[s]).reduce(add))
console.log('Part 2:', strategies.map(s => pointsMap2[s]).reduce(add))
```

---

### Day 3: Rucksack Reorganization

One Elf has the important job of loading all of the rucksacks with supplies for the jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, and so a few items now need to be rearranged.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/03/story.png">

Quest: [adventofcode.com/2022/day/3](https://adventofcode.com/2022/day/3)

#### Solution

```ts
import { add, getLinesFromInput } from '../utils'
import { chunk, intersection } from 'lodash'

const rucksacks = getLinesFromInput(__dirname).map(x => [...x])

function itemToPriority(item: string) {
  const code = item.charCodeAt(0)
  return code - (code > 90 ? 96 : 38)
}

function commonItem(rucksacks: string[][]) {
  return intersection(...rucksacks)[0]
}

function divideRucksack(rucksack: string[]) {
  return chunk(rucksack, rucksack.length / 2)
}

const prioritySum = rucksacks
  .map(divideRucksack)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add)

const badgeSum = chunk(rucksacks, 3)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add)

console.log('part 1:', prioritySum)
console.log('part 2:', badgeSum)
```

---

### Day 4: Camp Cleanup

Space needs to be cleared before the last supplies can be unloaded from the ships, and so several Elves have been assigned the job of cleaning up sections of the camp.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/04/story.png">

Quest: [adventofcode.com/2022/day/4](https://adventofcode.com/2022/day/4)

#### Solution

```ts
import { intersection, range } from 'lodash'
import { getLinesFromInput } from '../utils'

const pairs = getLinesFromInput(__dirname).map(line =>
  line.split(',').map(range => range.split('-').map(Number))
)

let fullyOverlapping = 0
let anyOverlapping = 0

for (const pair of pairs) {
  const ranges = pair.map(elf => range(elf[0], elf[1] + 1))
  const overlaps = intersection(...ranges).length
  const shorterAssignment = Math.min(...ranges.map(x => x.length))
  if (overlaps === shorterAssignment) fullyOverlapping += 1
  if (overlaps > 0) anyOverlapping += 1
}

console.log('Part 1:', fullyOverlapping)
console.log('Part 2:', anyOverlapping)
```

---

### Day 5: Supply Stacks

The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/05/story.png">

Quest: [adventofcode.com/2022/day/5](https://adventofcode.com/2022/day/5)

#### Solution

```ts
import { deepCopy, last, getLinesFromInput } from '../utils'

const CRATE_MOVER_9000 = 'CrateMover 9000'
const CRATE_MOVER_9001 = 'CrateMover 9001'
type Step = { move: number; from: number; to: number }

// Read file
const lines = getLinesFromInput(__dirname)
const numberOfStacks = (lines[0].length + 1) / 4
const heightOfStacks = lines.findIndex(line => line[1] === '1')
const stacks: string[][] = new Array(numberOfStacks).fill(0).map(() => [])

for (let y = 0; y < heightOfStacks; y++) {
  for (let x = 0; x < numberOfStacks; x++) {
    const crate = lines[y][1 + x * 4]
    if (crate !== ' ') stacks[x].unshift(crate)
  }
}

const steps: Step[] = lines.slice(heightOfStacks + 2).map(line => {
  const [move, from, to] = line.match(/(\d+)/g)!.map(Number)
  return { move, from: from - 1, to: to - 1 }
})

// Part 1, 2:
const stacksPart2 = deepCopy(stacks)

function rearrange(stacks: string[][], step: Step, craneModel: string) {
  const crates = stacks[step.from].splice(-step.move)
  if (craneModel === CRATE_MOVER_9000) crates.reverse()
  stacks[step.to].push(...crates)
}

for (const step of steps) {
  rearrange(stacks, step, CRATE_MOVER_9000)
  rearrange(stacksPart2, step, CRATE_MOVER_9001)
}

console.log('Part 1:', stacks.map(last).join(''))
console.log('Part 2:', stacksPart2.map(last).join(''))
```

---

### Day 6: Tuning Trouble

The preparations are finally complete; you and the Elves leave camp on foot and begin to make your way toward the star fruit grove.

As you move through the dense undergrowth, one of the Elves gives you a handheld device. He says that it has many fancy features, but the most important one to set up right now is the communication system.

However, because he's heard you have significant experience dealing with signal-based systems, he convinced the other Elves that it would be okay to give you their one malfunctioning device - surely you'll have no problem fixing it.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/06/story.png">

Quest: [adventofcode.com/2022/day/6](https://adventofcode.com/2022/day/6)

#### Solution

```ts
import { range } from 'lodash'
import { getLinesFromInput } from '../utils'

const signal = getLinesFromInput(__dirname)[0]

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
```

---

### Day 7: No Space Left On Device

You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

```bash
$ system-update --please --pretty-please-with-sugar-on-top
Error: No space left on device
```

Perhaps you can delete some files to make space for the update?

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/07/story.png">

Quest: [adventofcode.com/2022/day/7](https://adventofcode.com/2022/day/7)

#### Solution

```ts
import { asc, add, getLinesFromInput } from '../utils'

const lines = getLinesFromInput(__dirname)
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
```

---

## How to run?

Requirements:

```
node v18.12.1
```

Install dependencies:

```shell
npm ci
```

Run solution:

```shell
npx ts-node src/<nr>/index.ts
```

## Thanks to the AoC team

Puzzles, Code, & Design: [Eric Wastl](https://twitter.com/ericwastl)

Beta Testing:

- [Tim Giannetti](https://twitter.com/Sr_Giannetti)
- Ben Lucek
- [JP Burke](https://twitter.com/yatpay)
- [Aneurysm9](https://twitter.com/Aneurysm9)
- Andrew Skalski

Community Managers: [Danielle Lucek](https://reddit.com/message/compose/?to=/r/adventofcode) and [Aneurysm9](https://twitter.com/Aneurysm9)

[1]: #day-1-calorie-counting
[2]: #day-2-rock-paper-scissors
[3]: #day-3-rucksack-reorganization
[4]: #day-4-camp-cleanup
[5]: #day-5-supply-stacks
[6]: #day-6-tuning-trouble
[7]: #day-7-no-space-left-on-device
