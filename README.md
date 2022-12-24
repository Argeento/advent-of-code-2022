# Advent of Code 2022

My solutions for [Advent of Code 2022](https://adventofcode.com/2022/) in TypeScript

## Story

Santa's reindeer typically eat regular reindeer food, but they need a lot of magical energy to deliver presents on Christmas. For that, their favorite snack is a special type of **star fruit** that only grows deep in the jungle. The Elves have brought you on their annual expedition to the grove where the fruit grows.

To supply enough magical energy, the expedition needs to retrieve a minimum of fifty stars by December 25th. Although the Elves assure you that the grove has plenty of fruit, you decide to grab any fruit you see along the way, just in case.

## Star fruits

| Day |             Quest              | Part 1 | Part 2 |
| :-: | :----------------------------: | :----: | :----: |
|  1  |     [Calorie Counting][1]      | :star: | :star: |
|  2  |    [Rock Paper Scissors][2]    | :star: | :star: |
|  3  |  [Rucksack Reorganization][3]  | :star: | :star: |
|  4  |       [Camp Cleanup][4]        | :star: | :star: |
|  5  |       [Supply Stacks][5]       | :star: | :star: |
|  6  |      [Tuning Trouble][6]       | :star: | :star: |
|  7  |  [No Space Left On Device][7]  | :star: | :star: |
|  8  |    [Treetop Tree House][8]     | :star: | :star: |
|  9  |        [Rope Bridge][9]        | :star: | :star: |
| 10  |     [Cathode-Ray Tube][10]     | :star: | :star: |
| 11  |   [Monkey in the Middle][11]   | :star: | :star: |
| 12  | [Hill Climbing Algorithm][12]  | :star: | :star: |
| 13  |     [Distress Signal][13]      | :star: | :star: |
| 14  |    [Regolith Reservoir][14]    | :star: | :star: |
| 15  |  [Beacon Exclusion Zone][15]   | :star: | :star: |
| 16  |  [Proboscidea Volcanium][16]   | :star: | :star: |
| 17  |     [Pyroclastic Flow][17]     | :star: | :star: |
| 18  |     [Boiling Boulders][18]     | :star: | :star: |
| 19  |   [Not Enough Minerals][19]    | :star: | :star: |
| 20  | [Grove Positioning System][20] | :star: | :star: |
| 21  |       [Monkey Math][21]        | :star: | :star: |

## The journey

### Day 1: Calorie Counting

The jungle must be too overgrown and difficult to navigate in vehicles or access from the air; the Elves' expedition traditionally goes on foot. As your boats approach land, the Elves begin taking inventory of their supplies. One important consideration is food - in particular, the number of Calories each Elf is carrying.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/01/story.png">

Quest: [adventofcode.com/2022/day/1](https://adventofcode.com/2022/day/1)

#### Solution

```ts
import { add } from 'lodash'
import { desc, getLines } from '../utils'

const lines = getLines(__dirname)
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
import { add } from 'lodash'
import { getLines } from '../utils'

const lines = getLines(__dirname).map(x => x.replace(' ', ''))

const points: Record<string, number[]> = {
  AX: [4, 3],
  AY: [8, 4],
  AZ: [3, 8],
  BX: [1, 1],
  BY: [5, 5],
  BZ: [9, 9],
  CX: [7, 2],
  CY: [2, 6],
  CZ: [6, 7],
}

console.log('Part 1:', lines.map(s => points[s][0]).reduce(add))
console.log('Part 2:', lines.map(s => points[s][1]).reduce(add))
```

---

### Day 3: Rucksack Reorganization

One Elf has the important job of loading all of the rucksacks with supplies for the jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, and so a few items now need to be rearranged.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/03/story.png">

Quest: [adventofcode.com/2022/day/3](https://adventofcode.com/2022/day/3)

#### Solution

```ts
import { getLines } from '../utils'
import { chunk, intersection, add } from 'lodash'

const rucksacks = getLines(__dirname).map(x => [...x])

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
import { getLines } from '../utils'

const pairs = getLines(__dirname).map(line =>
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
import { cloneDeep, last } from 'lodash'
import { getLines } from '../utils'

const CRATE_MOVER_9000 = 'CrateMover 9000'
const CRATE_MOVER_9001 = 'CrateMover 9001'
type Step = { move: number; from: number; to: number }

// Read file
const lines = getLines(__dirname)
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
const stacksPart2 = cloneDeep(stacks)

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
```

---

### Day 8: Treetop Tree House

The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/08/story.png">

Quest: [adventofcode.com/2022/day/8](https://adventofcode.com/2022/day/8)

#### Solution

```ts
import { multiply } from 'lodash'
import { Cartesian } from '../Cartesian'
import { getArray2d } from '../utils'

const trees = new Cartesian(getArray2d(__dirname).map(line => line.map(Number)))

let maxScore = -Infinity
let visibleTrees = 0

trees.forEach((tree, x, y) => {
  const col = trees.cols[x]
  const row = trees.rows[y]

  const dirs = [
    col.slice(0, y).reverse(), // bottom
    col.slice(y + 1), // top
    row.slice(0, x).reverse(), // left
    row.slice(x + 1), // right
  ]

  const isVisible = dirs.some(dir => tree > Math.max(...dir))
  const scenicScore = dirs
    .map(dir => dir.findIndex(t => t >= tree) + 1 || dir.length)
    .reduce(multiply, 1)

  if (scenicScore > maxScore) maxScore = scenicScore
  if (isVisible) visibleTrees += 1
})

console.log('Part 1', visibleTrees)
console.log('Part 2', maxScore)
```

---

### Day 9: Rope Bridge

This rope bridge creaks as you walk along it. You aren't sure how old it is, or whether it can even support your weight.

It seems to support the Elves just fine, though. The bridge spans a gorge which was carved out by the massive river far below you.

You step carefully; as you do, the ropes stretch and twist. You decide to distract yourself by modeling rope physics; maybe you can even figure out where not to step.

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/09/story.png">

Quest: [adventofcode.com/2022/day/9](https://adventofcode.com/2022/day/9)

#### Solution

```ts
import { range, values, last } from 'lodash'
import { getLines } from '../utils'

const dirs = getLines(__dirname)
  .map(line => line.split(' '))
  .map(([dir, steps]) => dir.repeat(+steps))
  .join('')

function move(knot: Point, dir: string) {
  if (dir === 'R') knot.x++
  if (dir === 'L') knot.x--
  if (dir === 'U') knot.y++
  if (dir === 'D') knot.y--
}

function follow(follower: Point, leader: Point) {
  const deltaX = leader.x - follower.x
  const deltaY = leader.y - follower.y
  const distance = Math.hypot(deltaX, deltaY)

  if (distance < 2) return

  // prettier-ignore
  const dir = Math.abs(deltaX) > Math.abs(deltaY)
    ? deltaX > 0 ? 'R' : 'L'
    : deltaY > 0 ? 'U' : 'D'

  move(follower, dir)

  if (distance > 2) {
    const align = 'UD'.includes(dir) ? 'x' : 'y'
    follower[align] += Math.sign(align === 'x' ? deltaX : deltaY)
  }
}

function tailPositions(dirs: string, ropeLength: number) {
  const positions = new Set<string>().add('0,0')
  const rope: Point[] = range(ropeLength).map(() => ({ x: 0, y: 0 }))

  for (const dir of dirs) {
    move(rope[0], dir)
    for (let i = 1; i < rope.length; i++) {
      follow(rope[i], rope[i - 1])
    }
    positions.add(values(last(rope)).join())
  }

  return positions.size
}

console.log('Part 1:', tailPositions(dirs, 2))
console.log('Part 2:', tailPositions(dirs, 10))
```

---

### Day 10: Cathode-Ray Tube

You avoid the ropes, plunge into the river, and swim to shore.

The Elves yell something about meeting back up with them upriver, but the river is too loud to tell exactly what they're saying. They finish crossing the bridge and disappear from view.

Situations like this must be why the Elves prioritized getting the communication system on your handheld device working. You pull it out of your pack, but the amount of water slowly draining from a big crack in its screen tells you it probably won't be of much immediate use.

Quest: [adventofcode.com/2022/day/10](https://adventofcode.com/2022/day/10)

#### Solution

```ts
import { getLines, toNumber, inRange, divisible } from '../utils'

let x = 1
let sum = 0
let cycle = 0
let crt = ''

getLines(__dirname).forEach(line => {
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
```

---

### Day 11: Monkey in the Middle

As you finally start making your way upriver, you realize your pack is much lighter than you remember. Just then, one of the items from your pack goes flying overhead. Monkeys are playing Keep Away with your missing things!

To get your stuff back, you need to be able to predict where the monkeys will throw your items. After some careful observation, you realize the monkeys operate based on how worried you are about each item.

Quest: [adventofcode.com/2022/day/11](https://adventofcode.com/2022/day/11)

#### Solution

```ts
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
```

---

### Day 12: Hill Climbing Algorithm

You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

Quest: [adventofcode.com/2022/day/12](https://adventofcode.com/2022/day/12)

#### Solution

```ts
import EasyStar from 'easystarjs'
import { range } from 'lodash'
import { getArray2d, loop2d } from '../utils'

const input = getArray2d(__dirname)
const start = { x: 0, y: 0 }
const end = { x: 0, y: 0 }
const lowestPoints: Point[] = []
const pathMap: number[][] = range(input.length).map(() =>
  range(input[0].length).map(() => 0)
)

const map = new EasyStar.js()
map.setGrid(pathMap)
map.setAcceptableTiles([0])

function toHeight(letter?: string) {
  return letter?.charCodeAt(0) ?? 99
}

loop2d(input, (y, x) => {
  if (input[y][x] === 'S') {
    start.x = x
    start.y = y
    input[y][x] = 'a'
  }

  if (input[y][x] === 'E') {
    end.x = x
    end.y = y
    input[y][x] = 'z'
  }

  if (input[y][x] === 'a') {
    lowestPoints.push({ x, y })
  }

  const dirs: EasyStar.Direction[] = []
  const current = toHeight(input[y][x])

  const up = toHeight(input[y - 1]?.[x])
  const down = toHeight(input[y + 1]?.[x])
  const left = toHeight(input[y][x - 1])
  const right = toHeight(input[y][x + 1])

  if (current - up < 2) dirs.push(EasyStar.TOP)
  if (current - down < 2) dirs.push(EasyStar.BOTTOM)
  if (current - left < 2) dirs.push(EasyStar.LEFT)
  if (current - right < 2) dirs.push(EasyStar.RIGHT)

  map.setDirectionalCondition(x, y, dirs)
})

function getLength(start: Point, end: Point) {
  return new Promise<number>(resolve => {
    map.findPath(start.x, start.y, end.x, end.y, steps => {
      resolve(steps ? steps.length - 1 : Infinity)
    })
  })
}

getLength(start, end).then(path => {
  console.log('Part 1:', path)
})

Promise.all(lowestPoints.map(p => getLength(p, end))).then(paths =>
  console.log('Part 2:', Math.min(...paths))
)

map.calculate()
```

---

### Day 13: Distress Signal

You climb the hill and again try contacting the Elves. However, you instead receive a signal you weren't expecting: a distress signal.

Your handheld device must still not be working properly; the packets from the distress signal got decoded out of order. You'll need to re-order the list of received packets to decode the message.

Quest: [adventofcode.com/2022/day/13](https://adventofcode.com/2022/day/13)

#### Solution

```ts
import { isArray } from 'lodash'
import { getInput, getLines } from '../utils'

type Packet = number | Packet[]
enum Comparison {
  EQUAL = 0,
  LESS_THAN = -1,
  GREATER_THAN = 1,
}

const signal = getInput(__dirname)
  .split('\n\n')
  .map(packets => packets.split('\n').map(eval) as Packet[])
  .map(([left, right]) => ({ left, right }))

function compare(left: Packet, right: Packet): Comparison {
  if (isArray(left) && isArray(right)) {
    const length = Math.min(left.length, right.length)
    for (let i = 0; i < length; i++) {
      const comparison = compare(left[i], right[i])
      if (comparison !== Comparison.EQUAL) {
        return comparison
      }
    }

    if (left[length] === undefined && right[length] === undefined) {
      return Comparison.EQUAL
    }

    if (left[length] === undefined) {
      return Comparison.LESS_THAN
    }

    return Comparison.GREATER_THAN
  }

  if (isArray(left)) {
    return compare(left, [right])
  }

  if (isArray(right)) {
    return compare([left], right)
  }

  if (left < right) {
    return Comparison.LESS_THAN
  } else if (left === right) {
    return Comparison.EQUAL
  }

  return Comparison.GREATER_THAN
}

let sum = 0
signal.forEach((packets, i) => {
  if (compare(packets.left, packets.right) === Comparison.LESS_THAN) {
    sum += i + 1
  }
})

console.log('Part 1:', sum)

const signal2 = getLines(__dirname)
  .filter(x => x)
  .map(eval)

signal2.push([[2]], [[6]])
signal2.sort(compare)

const a = signal2.findIndex(x => JSON.stringify(x) == '[[2]]') + 1
const b = signal2.findIndex(x => JSON.stringify(x) == '[[6]]') + 1

console.log('Part 2:', a * b)
```

---

### Day 14: Regolith Reservoir

The distress signal leads you to a giant waterfall! Actually, hang on - the signal seems like it's coming from the waterfall itself, and that doesn't make any sense. However, you do notice a little path that leads behind the waterfall.

Correction: the distress signal leads you behind a giant waterfall! There seems to be a large cave system here, and the signal definitely leads further inside.

As you begin to make your way deeper underground, you feel the ground rumble for a moment. Sand begins pouring into the cave! If you don't quickly figure out where the sand is going, you could quickly become trapped!

Quest: [adventofcode.com/2022/day/14](https://adventofcode.com/2022/day/14)

#### Solution

```ts
import { chunk, last } from 'lodash'
import { getLines, toKeys, key, createArray, toNumbers, asc } from '../utils'

enum Unit {
  AIR,
  ROCK,
  SAND,
}

const rocks = getLines(__dirname)
  .map(toNumbers)
  .map(p => chunk(p, 2).map(toKeys('x', 'y')))

const maxX = Math.max(...rocks.flatMap(p => p.map(key('x'))))
const maxY = Math.max(...rocks.flatMap(p => p.map(key('y'))))
const cave = createArray(maxY + 2, maxX * 2, Unit.AIR)

// Create rocks
rocks.forEach(path => {
  for (let i = 1; i < path.length; i++) {
    const [from, to] = path.slice(i - 1, i + 1)
    const [minY, maxY] = [from.y, to.y].sort(asc)
    const [minX, maxX] = [from.x, to.x].sort(asc)

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        cave[y][x] = Unit.ROCK
      }
    }
  }
})

function drop(y: number, x: number): Point {
  const down = cave[y + 1]?.[x]
  const downLeft = cave[y + 1]?.[x - 1]
  const downRight = cave[y + 1]?.[x + 1]

  if (down === Unit.AIR) {
    return drop(y + 1, x)
  } else if (downLeft === Unit.AIR) {
    return drop(y + 1, x - 1)
  } else if (downRight === Unit.AIR) {
    return drop(y + 1, x + 1)
  }

  return { x, y }
}

let p1 = 0
let p2 = 0

while (cave[0][500] !== Unit.SAND) {
  const { y, x } = drop(0, 500)
  cave[y][x] = Unit.SAND

  if (!last(cave)?.includes(Unit.SAND)) {
    p1 += 1
  }

  p2 += 1
}

console.log('Part 1:', p1)
console.log('Part 2:', p2)
```

---

### Day 15: Beacon Exclusion Zone

You feel the ground rumble again as the distress signal leads you to a large network of subterranean tunnels. You don't have time to search them all, but you don't need to: your pack contains a set of deployable sensors that you imagine were originally built to locate lost Elves.

The sensors aren't very powerful, but that's okay; your handheld device indicates that you're close enough to the source of the distress signal to use them. You pull the emergency sensor system out of your pack, hit the big button on top, and the sensors zoom off down the tunnels.

Quest: [adventofcode.com/2022/day/15](https://adventofcode.com/2022/day/15)

#### Solution

```ts
import { arrayUnion } from 'interval-operations'
import { getLines, getManhattanDistance, toNumbers } from '../utils'

const P1_Y = 2_000_000
const P2_LIMIT = 4_000_000

const p1Ranges: [number, number][] = []
const p2Cols: Record<number, [number, number][]> = {}

getLines(__dirname).map(line => {
  const [sensorX, sensorY, beaconX, beaconY] = toNumbers(line)
  const sensor = { x: sensorX, y: sensorY }
  const beacon = { x: beaconX, y: beaconY }
  const radius = getManhattanDistance(sensor, beacon)
  const p1Range: number[] = []

  for (let i = -radius; i <= radius; i++) {
    const x = sensor.x + i
    const y1 = sensor.y + radius - Math.abs(i)
    const y2 = sensor.y + Math.abs(i) - radius

    if (y1 === P1_Y || y2 === P1_Y) {
      p1Range.push(x)
    }

    if (
      (y1 >= 0 || y2 >= 0) &&
      (y1 <= P2_LIMIT || y2 <= P2_LIMIT) &&
      x <= P2_LIMIT &&
      x >= 0
    ) {
      p2Cols[x] ??= []
      p2Cols[x].push(y1 < y2 ? [y1, y2] : [y2, y1])
    }
  }

  if (p1Range.length === 1) {
    p1Range.push(p1Range[0])
  }

  if (p1Range.length === 2) {
    p1Ranges.push(p1Range as [number, number])
  }
})

const p1 = arrayUnion(p1Ranges)[0] as number[]
console.log('Part 1:', p1[1] - p1[0])

for (const x in p2Cols) {
  const ranges = arrayUnion(p2Cols[x])
  if (ranges.length > 1) {
    const y = +ranges[0][1] + 1
    console.log('Part 2:', +x * P2_LIMIT + y)
    break
  }
}
```

---

### Day 16: Proboscidea Volcanium

The sensors have led you to the origin of the distress signal: yet another handheld device, just like the one the Elves gave you. However, you don't see any Elves around; instead, the device is surrounded by elephants! They must have gotten lost in these tunnels, and one of the elephants apparently figured out how to turn on the distress signal.

The ground rumbles again, much stronger this time. What kind of cave is this, exactly? You scan the cave with your handheld device; it reports mostly igneous rock, some ash, pockets of pressurized gas, magma... this isn't just a cave, it's a volcano!

You need to get the elephants out of here, quickly. Your device estimates that you have 30 minutes before the volcano erupts, so you don't have time to go back out the way you came in.

Quest: [adventofcode.com/2022/day/16](https://adventofcode.com/2022/day/16)

#### Solution

```ts
import { getLines, toNumber } from '../utils'
import Graph from 'node-dijkstra'
import combinations from 'combinations'
import memoizee from 'memoizee'

console.time('time')

type Costs = Record<string, Record<string, number>>
type Valve = {
  name: string
  flow: number
  tunnels: string[]
}

const flowRateMap: Record<string, number> = {}
const valves = getLines(__dirname).map(line => {
  const [name, ...tunnels] = line.match(/[A-Z]{2}/g)!
  const flow = toNumber(line)
  flowRateMap[name] = flow
  return { name, flow, tunnels }
})

const tunnelsRoute = new Graph()
valves.forEach(valve => {
  const edges = valve.tunnels.reduce(
    (obj, tunnel) => ({ ...obj, [tunnel]: 1 }),
    {}
  )
  tunnelsRoute.addNode(valve.name, edges)
})

const aaValve = valves.find(valve => valve.name === 'AA')!
const everyFlowValve = valves.filter(valve => valve.flow)
const getPathWeight = memoizee((from: string, to: string) => {
  const path = tunnelsRoute.path(from, to) as string[]
  return path.length - 1
})

function createCosts(valves: Valve[]) {
  valves = [aaValve, ...valves]
  const costs: Record<string, Record<string, number>> = {}

  for (let i = 0; i < valves.length; i++) {
    const from = valves[i]
    const restValves = valves.filter(v => v !== from)
    for (const to of restValves) {
      costs[from.name] ??= {}
      costs[from.name][to.name] = getPathWeight(from.name, to.name)
    }
  }

  return costs
}

function best(
  costs: Costs,
  time: number,
  current: string = 'AA',
  open: string[] = []
): number {
  if (time === 0) return 0

  const results = Object.keys(costs[current])
    .filter(destination => {
      return !open.includes(destination) && time > costs[current][destination]
    })
    .map(dest => {
      const remaining = time - costs[current][dest] - 1
      const pressure = remaining * flowRateMap[dest]
      return pressure + best(costs, remaining, dest, [dest, ...open])
    })

  return Math.max(0, ...results)
}

const p1Costs = createCosts(everyFlowValve)
console.log('Part 1:', best(p1Costs, 30))
console.timeLog('time')

const allPerm = combinations(everyFlowValve, 3, everyFlowValve.length / 2)
let max = -Infinity
for (const player of allPerm) {
  const elephant = everyFlowValve.filter(valve => !player.includes(valve))
  const sum = best(createCosts(player), 26) + best(createCosts(elephant), 26)
  if (sum > max) {
    max = sum
  }
}

console.log('Part 2:', max)
console.timeEnd('time')
```

---

### Day 17: Pyroclastic Flow

Your handheld device has located an alternative exit from the cave for you and the elephants. The ground is rumbling almost continuously now, but the strange valves bought you some time. It's definitely getting warmer in here, though.

The tunnels eventually open into a very tall, narrow chamber. Large, oddly-shaped rocks are falling into the chamber from above, presumably due to all the rumbling. If you can't work out where the rocks will fall next, you might be crushed!

Quest: [adventofcode.com/2022/day/17](https://adventofcode.com/2022/day/17)

#### Solution

```ts
import { findLastIndex } from 'lodash'
import { findCycles } from '../find-cycles'
import { getInput } from '../utils'

type Shape = DeepReadonly<{ chars: string[]; width: number; height: number }>
type Rock = Point & Readonly<{ shape: Shape }>
type Cave = string[][]

const jetPattern = [...getInput(__dirname).trim()] as Readonly<('<' | '>')[]>
const shapes = [
  ['####'],
  ['.#.', '###', '.#.'],
  ['###', '..#', '..#'],
  ['#', '#', '#', '#'],
  ['##', '##'],
] as const

function putInCave(rock: Rock, cave: Cave) {
  for (let y = 0; y < rock.shape.height; y++) {
    for (let x = 0; x < rock.shape.width; x++) {
      const char = rock.shape.chars[y][x]
      if (char === '#') {
        cave[rock.y + y][rock.x + x] = char
      }
    }
  }
}

function getShape(shapeNr: number): Shape {
  const shape = shapes[shapeNr % shapes.length]
  return {
    chars: shape,
    width: shape[0].length,
    height: shape.length,
  }
}

function canPushRock(rock: Rock, cave: Cave, dir: -1 | 1) {
  let canPush = true
  loop: for (let y = 0; y < rock.shape.height; y++) {
    for (let x = 0; x < rock.shape.width; x++) {
      const char = rock.shape.chars[y][x]
      const newY = rock.y + y
      const newX = rock.x + x + dir
      cave[newY] ??= [...'.......']

      if (newX < 0 || newX > 6 || (char === '#' && cave[newY][newX] === '#')) {
        canPush = false
        break loop
      }
    }
  }
  return canPush
}

function canRockFall(rock: Rock, cave: Cave) {
  let canFall = true
  loop: for (let y = 0; y < rock.shape.height; y++) {
    for (let x = 0; x < rock.shape.width; x++) {
      const char = rock.shape.chars[y][x]
      const newY = rock.y + y - 1
      const newX = rock.x + x
      cave[newY] ??= [...'.......']

      if (newY < 0 || (char === '#' && cave[newY][newX] === '#')) {
        canFall = false
        break loop
      }
    }
  }
  return canFall
}

function dropRock(rock: Rock, cave: Cave, jetNr: number): number {
  const dir = jetPattern[jetNr] === '<' ? -1 : 1
  jetNr %= jetPattern.length
  jetNr += 1

  if (canPushRock(rock, cave, dir)) {
    rock.x += dir
  }

  if (canRockFall(rock, cave)) {
    rock.y -= 1
    return dropRock(rock, cave, jetNr)
  }

  putInCave(rock, cave)
  return jetNr
}

function getCaveHeight(cave: Cave) {
  return findLastIndex(cave, line => line.includes('#')) + 1
}

function createCave(options: { height?: number; rocks?: number }) {
  const cave: Cave = []
  let jetNr = 0
  let i = 0

  while (true) {
    const height = getCaveHeight(cave)
    const dropPoint = getCaveHeight(cave) + 3
    const rock = { x: 2, y: dropPoint, shape: getShape(i) }

    jetNr = dropRock(rock, cave, jetNr)
    i++

    if (options.rocks) {
      if (options.rocks === i) {
        break
      }
    }

    if (options.height) {
      if (height > options.height) {
        break
      }
    }
  }

  return {
    cave,
    rocks: i,
    height: getCaveHeight(cave),
  }
}

console.log('Part 1', createCave({ rocks: 2022 }).height)

const { startIndex: start, length: cycleHeight } = findCycles(
  createCave({ rocks: 5000 }).cave.map(x => x.join(''))
)[0]

const allRocks = 1e12
const rocksBeforeCycle = createCave({ height: start }).rocks
const rocksAfterFirstCycle = createCave({ height: start + cycleHeight }).rocks
const rocksToCreateCycle = rocksAfterFirstCycle - rocksBeforeCycle
const repeats = Math.floor((allRocks - rocksBeforeCycle) / rocksToCreateCycle)
const rocksLeft = allRocks - repeats * rocksToCreateCycle
const heightWithoutCycles = createCave({ rocks: rocksLeft }).height
console.log('Part 2', heightWithoutCycles + cycleHeight * repeats)
```

---

### Day 18: Boiling Boulders

ou and the elephants finally reach fresh air. You've emerged near the base of a large volcano that seems to be actively erupting! Fortunately, the lava seems to be flowing away from you and toward the ocean.

Bits of lava are still being ejected toward you, so you're sheltering in the cavern exit a little longer. Outside the cave, you can see the lava landing in a pond and hear it loudly hissing as it solidifies.

Depending on the specific compounds in the lava and speed at which it cools, it might be forming obsidian! The cooling rate should be based on the surface area of the lava droplets, so you take a quick scan of a droplet as it flies past you

Quest: [adventofcode.com/2022/day/18](https://adventofcode.com/2022/day/18)

#### Solution

```ts
import { add, negate } from 'lodash'
import { getLines, toNumbers } from '../utils'
import Graph from 'node-dijkstra'
import memoizee from 'memoizee'

const cubes = getLines(__dirname).map(toNumbers)
const lavaMap: Record<string, boolean> = {}

cubes.forEach(cube => {
  lavaMap[cube.toString()] = true
})

const isLava = (point: number[]) => !!lavaMap[point.toString()]
const isAir = negate(isLava)
const countLavaSides = memoizee(([x, y, z]: number[]) => {
  let sides = 0
  if (isLava([x + 1, y, z])) sides++
  if (isLava([x - 1, y, z])) sides++
  if (isLava([x, y + 1, z])) sides++
  if (isLava([x, y - 1, z])) sides++
  if (isLava([x, y, z + 1])) sides++
  if (isLava([x, y, z - 1])) sides++
  return sides
})

const p1Surface = cubes
  .map(countLavaSides)
  .map(sides => 6 - sides)
  .reduce(add)

console.log('Part 1:', p1Surface)

const airGraph = new Graph()
const volumeSide = Math.max(...cubes.flatMap(x => x)) + 2

for (let z = 0; z < volumeSide; z++) {
  for (let y = 0; y < volumeSide; y++) {
    for (let x = 0; x < volumeSide; x++) {
      const point = [x, y, z]
      if (isAir(point)) {
        const routes: Record<string, 1> = {}
        if (isAir([x + 1, y, z])) routes[[x + 1, y, z].toString()] = 1
        if (isAir([x - 1, y, z])) routes[[x - 1, y, z].toString()] = 1
        if (isAir([x, y + 1, z])) routes[[x, y + 1, z].toString()] = 1
        if (isAir([x, y - 1, z])) routes[[x, y - 1, z].toString()] = 1
        if (isAir([x, y, z + 1])) routes[[x, y, z + 1].toString()] = 1
        if (isAir([x, y, z - 1])) routes[[x, y, z - 1].toString()] = 1
        airGraph.addNode(point.toString(), routes)
      }
    }
  }
}

const freeAirPoint = [volumeSide - 1, volumeSide - 1, volumeSide - 1].toString()
let insideEdges = 0

for (let z = 0; z < volumeSide; z++) {
  for (let y = 0; y < volumeSide; y++) {
    for (let x = 0; x < volumeSide; x++) {
      const point = [x, y, z]
      if (isAir(point) && !airGraph.path(point.toString(), freeAirPoint)) {
        insideEdges += countLavaSides(point)
      }
    }
  }
}

console.log('Part 2:', p1Surface - insideEdges)
```

---

### Day 19: Not Enough Minerals

Your scans show that the lava did indeed form obsidian!

The wind has changed direction enough to stop sending lava droplets toward you, so you and the elephants exit the cave. As you do, you notice a collection of geodes around the pond. Perhaps you could use the obsidian to create some geode-cracking robots and break them open?

Quest: [adventofcode.com/2022/day/19](https://adventofcode.com/2022/day/19)

#### Solution

```ts
import { add, multiply } from 'lodash'
import { desc, getLines, toKeys, toNumbers } from '../utils'

const blueprints = getLines(__dirname)
  .map(toNumbers)
  .map(
    toKeys(
      'id',
      'oreRobotOreCost',
      'clayRobotOreCost',
      'obsidianRobotOreCost',
      'obsidianRobotClayCost',
      'geodeRobotOreCost',
      'geodeRobotObsidianCost'
    )
  )

type Blueprint = typeof blueprints[number]

function createState() {
  return {
    ore: 0,
    oreRobots: 1,
    clay: 0,
    clayRobots: 0,
    obsidian: 0,
    obsidianRobots: 0,
    geode: 0,
    geodeRobots: 0,
    waiting: 0,
  }
}

type State = Readonly<ReturnType<typeof createState>>
type RealitiesMap = Record<string, boolean>

function tick(
  state: State,
  print: Blueprint,
  minute: number,
  realitiesMap: RealitiesMap
): State[] {
  if (minute > 20 && state.clayRobots === 0) return []
  if (minute > 25 && state.obsidianRobots === 0) return []

  if (state.oreRobots > 20) return []
  if (state.clayRobots > 20) return []

  const possibleStates: State[] = []
  const newState: State = {
    ...state,
    ore: state.ore + state.oreRobots,
    clay: state.clay + state.clayRobots,
    obsidian: state.obsidian + state.obsidianRobots,
    geode: state.geode + state.geodeRobots,
    waiting: state.waiting + 1,
  }

  if (
    state.ore >= print.geodeRobotOreCost &&
    state.obsidian >= print.geodeRobotObsidianCost
  ) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.geodeRobotOreCost,
      obsidian: newState.obsidian - print.geodeRobotObsidianCost,
      geodeRobots: newState.geodeRobots + 1,
      waiting: 0,
    }

    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }

    return possibleStates
  }

  if (
    state.ore >= print.obsidianRobotOreCost &&
    state.clay >= print.obsidianRobotClayCost
  ) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.obsidianRobotOreCost,
      clay: newState.clay - print.obsidianRobotClayCost,
      obsidianRobots: newState.obsidianRobots + 1,
      waiting: 0,
    }

    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }

    return possibleStates
  }

  if (newState.waiting < 6) {
    const json = JSON.stringify(newState)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push({ ...newState })
    }
  } else {
    return []
  }

  if (state.ore >= print.clayRobotOreCost) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.clayRobotOreCost,
      clayRobots: newState.clayRobots + 1,
      waiting: 0,
    }

    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }
  }

  if (state.ore >= print.oreRobotOreCost) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.oreRobotOreCost,
      oreRobots: newState.oreRobots + 1,
      waiting: 0,
    }
    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }
  }

  return possibleStates
}

function getMaxGeodes(blueprint: Blueprint, time: number) {
  let realities: State[] = [createState()]
  const realitiesMap: RealitiesMap = {}

  for (let minute = 1; minute <= time; minute++) {
    realities = realities.flatMap(state =>
      tick(state, blueprint, minute, realitiesMap)
    )
  }

  return realities.sort((a, b) => desc(a.geode, b.geode))[0].geode
}

const p1Sum = blueprints
  .map(blueprint => blueprint.id * getMaxGeodes(blueprint, 24))
  .reduce(add)

const p2Product = blueprints
  .slice(0, 3)
  .map(blueprint => getMaxGeodes(blueprint, 32))
  .reduce(multiply, 1)

console.log('Part 1:', p1Sum)
console.log('Part 2:', p2Product)
```

---

### Day 20: Grove Positioning System

It's finally time to meet back up with the Elves. When you try to contact them, however, you get no reply. Perhaps you're out of range?

You know they're headed to the grove where the star fruit grows, so if you can figure out where that is, you should be able to meet back up with them.

Fortunately, your handheld device has a file (your puzzle input) that contains the grove's coordinates! Unfortunately, the file is encrypted - just in case the device were to fall into the wrong hands.

Maybe you can decrypt it?

Quest: [adventofcode.com/2022/day/20](https://adventofcode.com/2022/day/20)

#### Solution

```ts
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
```

---

### Day 21: Monkey Math

The monkeys are back! You're worried they're going to try to steal your stuff again, but it seems like they're just holding their ground and making various monkey noises at you.

Eventually, one of the elephants realizes you don't speak monkey and comes over to interpret. As it turns out, they overheard you talking about trying to find the grove; they can show you a shortcut if you answer their riddle.

(Part 2 in `/src/21/p2.ts` file)

Quest: [adventofcode.com/2022/day/21](https://adventofcode.com/2022/day/21)

#### Solution

```ts
// @ts-nocheck
import { getLines } from '../utils'

// prettier-ignore
while (!global.root || console.log(root))
  for (let x of getLines(__dirname))
    try { eval('global.' + x.replace(...':=')) } catch (_) {}
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

Generate `README.md`:

```shell
npm run readme
```

## Story illustrations

[Midjourney](https://twitter.com/midjourney) and [DALL-E](https://openai.com/dall-e-2/)

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
[8]: #day-8-treetop-tree-house
[9]: #day-9-rope-bridge
[10]: #day-10-cathode-ray-tube
[11]: #day-11-monkey-in-the-middle
[12]: #day-12-hill-climbing-algorithm
[13]: #day-13-distress-signal
[14]: #day-14-regolith-reservoir
[15]: #day-15-beacon-exclusion-zone
[16]: #day-16-proboscidea-volcanium
[17]: #day-17-pyroclastic-flow
[18]: #day-18-boiling-boulders
[19]: #day-19-not-enough-minerals
[20]: #day-20-grove-positioning-system
[21]: #day-21-monkey-math
